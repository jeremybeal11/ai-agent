const {getOpenAIResponse, updateMessageHistory, messageHistory} = require('../openai/openai_chat')
const readline = require("readline");
const { safeSigner } = require('./ai-signer');

//const getUserInput = require('../openai/openai_chat')
const { OpenAI } = require("openai");
const dotenv = require("dotenv");


dotenv.config() 


// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Make sure to set this environment variable
});


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function handleUserInput() {
  try {
    // Call getOpenAIResponse with the manualMessage first
    const response = await getOpenAIResponse();

    console.log("OpenAI response:", response);
  } catch (error) {
    console.error("Error getting OpenAI response:", error);
    rl.close(); // Close the readline interface on error
    return; // Exit the function if there's an error
  }

  // After processing the manualMessage, prompt the user for the next message
  rl.question("Enter your message: ", async (message) => {
    if (message.toLowerCase() === "exit") {
      console.log("Exiting the chat.");
      rl.close();
    } else {
      try {

        const messageStore = messageHistory.push( {role: "user", content: message});
        const getResponse = await getOpenAIResponse(messageStore);
        if (getResponse) {
          // Regular expression to match a typical wallet address and an amount
          const walletAddressRegex = /0x[a-fA-F0-9]{40}/i;
          const amountRegex = /(\d+\.?\d*)\s*USDC/;
    
          // Extract wallet address and amount from the response
          const walletAddressMatch = getResponse.match(walletAddressRegex);
          const amountMatch = getResponse.match(amountRegex);
        
          // If both wallet address and amount are found, create the object
          if (walletAddressMatch && amountMatch) {
            const walletInfo = {
              walletAddress: walletAddressMatch[0],
              amount: amountMatch[1] // This captures the numeric value after "Amount:"
            };
            // Now you can use the walletInfo object
            //console.log("Wallet info:", JSON.stringify(walletInfo));

            //console.log("OpenAI response:", getResponse, "wallet address is", walletInfo.amount);
    
            return walletInfo;
    
          } else {
            console.error('Could not extract wallet address and amount from the response');
            return null;
          }
        } else {
          console.error('Response is undefined or not a string', getResponse);
        }
        handleUserInput(); // Prompt for the next message
      } catch (error) {
        console.error("Error getting OpenAI response:", error);
        rl.close(); // Close the readline interface on error
      }
    }
  });
}

 console.log("OpenAI Chat Interface (type 'exit' to quit)");
 handleUserInput();



 module.exports = {handleUserInput};