const { getOpenAIResponse, messageHistory } = require('../openai/openai_chat');
const { userWallet } = require('./wallet-info');
const { safeSigner } = require('./ai-signer');
const readline = require('readline');
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

        console.log('OpenAI response:', response);
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
                const messageStore = messageHistory.push({
                    role: 'user',
                    content: message,
                });
                const getResponse = await getOpenAIResponse(messageStore);
                console.log('getResponse is', getResponse);

                if (getResponse) {
                    const wallet = userWallet(getResponse);
                    const userSign = safeSigner(wallet);

                    console.log('signed TX is', userSign);
                    console.log('wallet is', wallet); //this works
                    //return wallet;
                } else {
                    console.error(
                        'Response is undefined or not a string',
                        getResponse
                    );
                    return null;
                }
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
