import  ethers  from 'ethers'
import  EthersAdapter  from '@safe-global/protocol-kit'
import  { MetaTransactionData }  from '@safe-global/safe-core-sdk-types'
import Safe from '@safe-global/protocol-kit'


import dotenv from 'dotenv'

dotenv.config();

//require("dotenv").config();


// https://chainlist.org/?search=sepolia&testnets=true
const RPC_URL='https://sepolia.base.org'
const provider = new ethers.JsonRpcProvider(RPC_URL)

const owner1Signer = new ethers.Wallet(process.env.AI_PK, provider)
const owner2Signer = new ethers.Wallet(process.env.SIGNER_W2, provider)
const safeAddress = "0x8413e348B1ed25E06d007e5f5d946a8ffC5240aC"

const ethAdapterOwner1 = new EthersAdapter({
  ethers,
  signerOrProvider: owner1Signer
})


const manualMessage = "send 10 USDC to paul's wallet at 0x096d3c124688cbc01bCea04052de98f245378D82"

async function safeSigner(walletInfo) {


    if (walletInfo) {
      const walletAddress = walletInfo.walletAddress;
      const amount = walletInfo.amount;

      console.log("Wallet address:", amount);

      const safeSdk: Safe = await Safe.create({ ethAdapter: ethAdapterOwner1, safeAddress })

      
      // Now you have the walletAddress and amount, you can create the transaction
      const safeTransactionData: MetaTransactionData = {
        to: walletAddress,
        data: '0x',
        value: ethers.parseUnits(amount, 'ether').toString() // Assuming the amount is in ether
      };

      const safeTransaction =  await safeSdk.createTransaction({transactions: [safeTransactionData]})
      const signedSafeTX = await safeSdk.signTransaction(safeTransaction)


      console.log("The safe transaction is", safeTransaction, "and the signedTX is", signedSafeTX);


      // Log the transaction data
      //console.log("the safe transaction data is ", safeTransactionData);

      return safeTransaction

    } else {
      console.error('No wallet info could be retrieved.');
      return null
    }

}

// async function main() {

//   try {
//     const walletInfo = await handleUserInput();

//     // Pass the result to safeSigner and wait for the transaction data
//     const safeTransactionData = await safeSigner(walletInfo);

//     console.log("The transaction data is", safeTransactionData);

//     //return getData;
//   // ... use safeTransactionData as needed ...
//     } catch (error) {
//       console.error('An error occurred:', error);
//     }

// }




module.exports = { safeSigner }

 

