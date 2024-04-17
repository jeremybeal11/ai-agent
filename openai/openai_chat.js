const { OpenAI } = require("openai");
const dotenv = require("dotenv");


dotenv.config() 


const manualMessage = "send 10 USDC to paul's wallet at 0x096d3c124688cbc01bCea04052de98f245378D82"


// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Make sure to set this environment variable
});


const messageHistory = [
  
  {
    "role": "system", 
    "content": "You are a financial assistant, and your job is to chat with the client and send USDC upon his request."
  }
  
]

function updateMessageHistory(messages, role, content) {

  messages.append({ "role": role, "content": content });

  return messages
}


// Function to get a response from OpenAI
async function getOpenAIResponse(message) {
  try {

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Replace with the model you want to use
      messages: messageHistory
    });


    const aiResponse = completion.choices[0].message.content;
    //console.log("AI response:", aiResponse);

    // // Include previous messages and the new message in the request
    // const messages = previousMessages.concat([
    //   {"role": "user", "content": message}
    // ]);
    //console.log("AI response:", aiResponse);
    return aiResponse

     // Append the new response from OpenAI to the messages array
     //messages.push({"role": "assistant", "content": response.choices[0].message.content});

    
    //var obj = JSON.stringify(response)
    //console.log("object is", response.choices[0].message.content)
    // return the message object for parsing later
    //return messages;
    
  } catch (error) {
    console.error("Error getting response from OpenAI:", error);
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

module.exports = {getOpenAIResponse, updateMessageHistory,messageHistory};
