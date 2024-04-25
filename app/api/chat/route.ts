import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";
import { OpenAI } from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { functions, runFunction } from "./functions";
import { SendCommand  } from "../../../src/agent/commands/send";
import { ReceiveCommand } from "../../../src/agent/commands/receive";
//import { TrendingCoinsCommand } from "../../../src/agent/commands/trendingCoins";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {

  if (
    process.env.NODE_ENV !== "development" &&
    process.env.KV_REST_API_URL &&
    process.env.KV_REST_API_TOKEN
  ) {
    const ip = req.headers.get("x-forwarded-for");
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(50, "1 d"),
    });

    const { success, limit, reset, remaining } = await ratelimit.limit(
      `chathn_ratelimit_${ip}`,
    );

    if (!success) {
      return new Response("You have reached your request limit for the day.", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }
  }

  const { messages } = await req.json();

  // Game context that is sent to OpenAI
  const context = 
    {
    role: "system",
    content: `
        You are a financial assistant, and your job is to chat with the client execute commands upon their request.
        If the user asks for possible ideas you are interested in, suggest that they can send money to a friend or family. 
        Do not suggest any other ideas.
        If the user gives an idea related to integrating or building on Syndicate's APIs, tell the user to send a DM to Germany. 
        The something_special function can only be called once. 
        These are the available commands you are able to execute, where "command" is the identifier and requestParameters is the set of parameters to be interpreted from the chat request:
    ` +
        JSON.stringify({
            command: 'SEND',
            requestParameters: new SendCommand(),
            confirmationMessage: '',
        }) +
        ',\n\n' +
        JSON.stringify({
            command: 'RECEIVE',
            requestParameters: new ReceiveCommand(),
            confirmationMessage: '',
        })

    };

  // Combine the context with the user prompts into an array
  const combinedMessages = [context, ...messages];

  // check if the conversation requires a function call to be made
  const initialResponse = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: combinedMessages,
    stream: true,
    functions,
    function_call: "auto",
  });

  const stream = OpenAIStream(initialResponse, {
    experimental_onFunctionCall: async (
      { name, arguments: args },
      createFunctionCallMessages,
    ) => {
      const result = await runFunction(name, args);
      const newMessages = createFunctionCallMessages(result);
      return openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        stream: true,
        messages: [...combinedMessages, ...newMessages],
      });
    },
  });

  return new StreamingTextResponse(stream);
}