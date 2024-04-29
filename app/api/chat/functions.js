"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runFunction = exports.functions = exports.TRANSACTION_COMMAND_NAMES = void 0;
const ai_signer_1 = require("../../../src/agent/ai-signer");
exports.TRANSACTION_COMMAND_NAMES = {
    send: "send_money",
    swap: "swap",
};
const defaultTransactionCommandInterface = {
    name: "command",
    description: "Do something.",
    parameters: {
        type: "object",
        properties: {},
        required: ["address"],
    },
};
exports.functions = [
    {
        name: "something_special",
        description: "Do something special.",
        parameters: {
            type: "object",
            properties: {
                address: {
                    type: "string",
                    description: "The address",
                },
            },
            required: ["address"],
        },
    },
];
function do_good(address) {
    const someAddress = address;
    console.log("this is the address", someAddress, "and the DOGOOD function is running");
    return someAddress;
}
// Get transaction hash from transactionId using Syndicate API with retry logic
// async function get_hash(transactionId: string): Promise<string> {
//   let transactionHash = '';
//   const options = {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${process.env.SYNDICATE_API_KEY}`
//     }
//   };
//   // Keep trying until the transaction hash is available
//   while (!transactionHash) {
//     try {
//       const response = await fetch(`https://api.syndicate.io/wallet/project/${process.env.PROJECT_ID}/request/${transactionId}`, options);
//       const data = await response.json();
//       transactionHash = data.transactionAttempts[0]?.hash || '';
//     } catch (error) {
//       console.error('Error getting transaction details:', error);
//     }
//     // Wati for a few seconds before retrying
//     if (!transactionHash) {
//       await new Promise(resolve => setTimeout(resolve, 5000));  // Wait for 5 seconds
//     }
//   }
//   return transactionHash;
// }
async function something_special(address) {
    //   const response = await do_good(address);
    //   console.log("this brings back what exactly?", response);
    // TODO Remove everything below this line and replace it with your own code
    //const transactionHash = await get_hash(response.data.transactionId);
    //console.log(transactionHash);
    //const transactionUrl = `https://basescan.org/tx/${transactionHash}`;
    //   return response;
}
async function runFunction(name, args) {
    switch (name) {
        case exports.TRANSACTION_COMMAND_NAMES.send: {
            const newSendCommand = args;
            console.log("this is the new send command", newSendCommand);
            return await (0, ai_signer_1.safeSigner)(newSendCommand);
        }
        default:
            return null;
    }
}
exports.runFunction = runFunction;
