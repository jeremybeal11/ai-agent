//import { ethers } from 'ethers';
//import { EthersAdapter } from '@safe-global/protocol-kit';
import { MetaTransactionData, OperationType } from '@safe-global/safe-core-sdk-types';
import Safe from '@safe-global/protocol-kit';
import SafeApiKit from '@safe-global/api-kit'
const Web3 = require('web3');
import { Web3Adapter } from '@safe-global/protocol-kit'
import dotenv from 'dotenv';
import { WalletInfo } from './wallet-info';

require('dotenv').config();

const owner1PK = process.env.AI_PK;

const AI_ADDR= "0x3FfE02322f6D3b23b4f153289E1f280eb15c0089"

if (!owner1PK || owner1PK === '') {
    console.error('No AI_PK provided');
    process.exit(1);
}

// https://chainlist.org/?search=sepolia&testnets=true
const RPC_URL = 'https://mainnet.base.org';
const provider = new Web3.providers.HttpProvider(RPC_URL);
//const provider = new ethers.JsonRpcProvider(RPC_URL);

//const signer1 = new ethers.Wallet(owner1PK, provider);
const web3 = new Web3(provider);


//const owner1Signer = new ethers.Wallet(owner1PK, provider);
//const owner2Signer = new ethers.Wallet(process.env.SIGNER_W2, provider)
const safeAddress = '0x8413e348B1ed25E06d007e5f5d946a8ffC5240aC';

const ethAdapter = new Web3Adapter({
    web3,
    signerAddress: AI_ADDR
});

const apiKit = new SafeApiKit({
    chainId: 8453n
  })

//const manualMessage = "send 10 USDC to paul's wallet at 0x096d3c124688cbc01bCea04052de98f245378D82";

async function safeSigner(walletInfo: WalletInfo) {


    if (walletInfo) {
        const walletAddress = walletInfo.walletAddress;
        const amount = walletInfo.amount;

        //console.log('block number is', await provider.getBlockNumber());

        //const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner1})

        // Create Safe instance
        const protocolKit = await Safe.create({
            ethAdapter,
            safeAddress: safeAddress,
        });

        // Now you have the walletAddress and amount, you can create the transaction
        const safeTransactionData: MetaTransactionData = {
            to: walletAddress,
            value: amount, // Assuming the amount is in ether
            data: '0x',
            operation: OperationType.Call
        };
        //const senderAddress = await signer1.getAddress();
        const safeTransaction =  await protocolKit.createTransaction({transactions: [safeTransactionData]})
        const safeTxHash = await protocolKit.getTransactionHash(safeTransaction)
        const signature = await protocolKit.signHash(safeTxHash)


        //console.log("The safe transaction is", safeTxHash);
        //console.log("and the hash is", safeTxHash);

        try {
        await apiKit.proposeTransaction({
            safeAddress: safeAddress,
            safeTransactionData: safeTransaction.data,
            safeTxHash,
            senderAddress: AI_ADDR,
            senderSignature: signature.data
        
        })

        //const pendingTransactions = await apiKit.getTransaction(safeTxHash)
        //console.log("The pending transaction is", protocolKit.getAddress())
        

        return safeTransaction;
    } catch (error: any) {
        console.error("Error while proposing transaction:", error.response ? error.response.data : error.message);
    }
    
    } else {
        console.error('No wallet info could be retrieved.');
        return null;
    }
}

safeSigner({
    walletAddress: '0x096d3c124688cbc01bCea04052de98f245378D82',
    amount: '1',
});

module.exports = { safeSigner };
