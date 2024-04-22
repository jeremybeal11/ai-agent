const { getOpenAIResponse } = require('../openai/openai_chat');
const readline = require('readline');
const { safeSigner } = require('./ai-signer');

//const getUserInput = require('../openai/openai_chat')
const { OpenAI } = require('openai');
const dotenv = require('dotenv');

dotenv.config();

// Initialize OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Make sure to set this environment variable
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function handleUserInput() {
    try {
        // Call getOpenAIResponse with the manualMessage first
        const response = await getOpenAIResponse();

        console.log('Initial OpenAI response:', response);
    } catch (error) {
        console.error('Error getting OpenAI response:', error);
        rl.close(); // Close the readline interface on error
        return; // Exit the function if there's an error
    }

    // After processing the manualMessage, prompt the user for the next message
    rl.question('Enter your message: ', async (message) => {
        if (message.toLowerCase() === 'exit') {
            console.log('Exiting the chat.');
            rl.close();
        } else {
            try {
                const getResponse = await getOpenAIResponse(message);

                try {
                    const parsedResponse = JSON.parse(getResponse);

                    let walletInfo;
                    if (['SEND', 'RECEIVE'].includes(parsedResponse.command)) {
                        walletInfo = {
                            walletAddress:
                                parsedResponse.requestParameters.walletAddress,
                            amount: parsedResponse.requestParameters.amount,
                        };
                    }
                } catch (error) {
                    console.log('Oops...', getResponse);
                }

                // TODO: OpenAI Responses can be either sent to the user as a confirmation message (ask yes/no), or directly executed given the response's specified command

                handleUserInput(); // Prompt for the next message
            } catch (error) {
                console.error('Error getting OpenAI response:', error);
                rl.close(); // Close the readline interface on error
            }
        }
    });
}

console.log("OpenAI Chat Interface (type 'exit' to quit)");
handleUserInput();

module.exports = { handleUserInput };
