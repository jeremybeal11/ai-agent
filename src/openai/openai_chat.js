const { OpenAI } = require('openai');
const dotenv = require('dotenv');
import { ReceiveCommand } from '../agent/commands/receive';
import { SendCommand } from '../agent/commands/send';
import { TrendingCoinsCommand } from '../agent/commands/trendingCoins';

dotenv.config();

const manualMessage =
    "send 10 USDC to paul's wallet at 0x096d3c124688cbc01bCea04052de98f245378D82";

// Initialize OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Make sure to set this environment variable
});

const messageHistory = [
    {
        role: 'system',
        content:
            'You are a financial assistant, and your job is to chat with the client execute commands upon their request.',
    },
    {
        role: 'system',
        content:
            'These are the available commands you are able to execute, where "command" is the identifier and requestParameters is the set of parameters to be interpreted from the chat request: \n\n' +
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
            }) +
            ',\n\n' +
            JSON.stringify({
                command: 'TRENDING_COINS',
                requestParameters: new TrendingCoinsCommand(),
                confirmationMessage: '',
            }),
    },
    {
        role: 'system',
        content:
            "For each user's message, extrapolate which command the user wishes to execute and please return a JSON serialized user-facing confirmation of the command that adheres to the request interface, including the interpreted of each request parameter.", //return the command in the corresponding response format as notated by the provided interface
    },
];

// TODO: OpenAI Responses should be stored in a running conversation in a database

function updateMessageHistory(messages, role, content) {
    messages.push({ role: role, content: content });

    return messages;
}

// Function to get a response from OpenAI
async function getOpenAIResponse(message) {
    message?.length > 0 &&
        updateMessageHistory(messageHistory, 'user', message);

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // Replace with the model you want to use
            messages: messageHistory,
        });

        const aiResponse = completion.choices[0].message.content;
        //console.log("AI response:", aiResponse);

        // // Include previous messages and the new message in the request
        // const messages = previousMessages.concat([
        //   {"role": "user", "content": message}
        // ]);
        //console.log("AI response:", aiResponse);
        return aiResponse;

        // Append the new response from OpenAI to the messages array
        //messages.push({"role": "assistant", "content": response.choices[0].message.content});

        //var obj = JSON.stringify(response)
        //console.log("object is", response.choices[0].message.content)
        // return the message object for parsing later
        //return messages;
    } catch (error) {
        console.error('Error getting response from OpenAI:', error);
        return null;
    }
}

//getOpenAIResponse(messageHistory)

// async function sendMessage(messages) {

//     conversation.push({ role: 'user', content: messages });

//     getOpenAIResponse(conversation).then((response) => {

//       conversation.push({ role: 'assistant', content: response });

//       console.log(response)
//     })

//     return conversation;

// }

//sendMessage(manualMessage);
//getOpenAIResponse(manualMessage)

module.exports = { getOpenAIResponse, updateMessageHistory, messageHistory };
