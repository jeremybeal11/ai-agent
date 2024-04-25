import { CompletionCreateParams } from "openai/resources/chat/index";

export const functions: CompletionCreateParams.Function[] = [
  {
    name: "something_special",
    description:
      "Do something special.",
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

function do_good(address: string) {

    const someAddress = address

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

async function something_special(address: string) {
  const response = await do_good(address);
  console.log("this brings back what exactly?", response);

  // TODO Remove everything below this line and replace it with your own code
  //const transactionHash = await get_hash(response.data.transactionId);
  //console.log(transactionHash);
  //const transactionUrl = `https://basescan.org/tx/${transactionHash}`;
  return response;
}

export async function runFunction(name: string, args: any) {
  switch (name) {
    case "something_special":
      return await something_special(args["address"]);
    default:
      return null;
  }
}