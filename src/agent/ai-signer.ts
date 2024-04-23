import { ethers } from 'ethers';
import { EthersAdapter } from '@safe-global/protocol-kit';
import { MetaTransactionData, OperationType } from '@safe-global/safe-core-sdk-types';
import Safe from '@safe-global/protocol-kit';
import SafeApiKit from '@safe-global/api-kit'
//const Web3 = require('web3');
//import { Web3Adapter } from '@safe-global/protocol-kit'

import dotenv from 'dotenv';
import { WalletInfo } from './wallet-info';

require('dotenv').config();

const owner1PK = process.env.AI_PK;

const AI_ADD= "0x3FfE02322f6D3b23b4f153289E1f280eb15c0089"

if (!owner1PK || owner1PK === '') {
    console.error('No AI_PK provided');
    process.exit(1);
}

// https://chainlist.org/?search=sepolia&testnets=true
const RPC_URL = 'https://base.llamarpc.com';
//const provider = new Web3.providers.HttpProvider(RPC_URL);
const provider = new ethers.JsonRpcProvider(RPC_URL);

const signer1 = new ethers.Wallet(owner1PK, provider);
//const web3 = new Web3(provider);


//const owner1Signer = new ethers.Wallet(owner1PK, provider);
//const owner2Signer = new ethers.Wallet(process.env.SIGNER_W2, provider)
const safeAddress = '0x8413e348B1ed25E06d007e5f5d946a8ffC5240aC';



const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer1
});

const apiKit = new SafeApiKit({
    chainId: 8453n,
    txServiceUrl: RPC_URL
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
            data: '0x',
            value: amount, // Assuming the amount is in ether
            operation: OperationType.Call
        };

        const safeTransaction =  await protocolKit.createTransaction({transactions: [safeTransactionData]})
        const safeTxHash = await protocolKit.getTransactionHash(safeTransaction)
        const signature = await protocolKit.signHash(safeTxHash)


        console.log("The safe transaction is", safeTxHash);
        //console.log("and the hash is", safeTxHash);

        await apiKit.proposeTransaction({
            safeAddress: '0x8413e348B1ed25E06d007e5f5d946a8ffC5240aC',
            safeTransactionData: safeTransaction.data,
            safeTxHash,
            senderAddress: AI_ADD,
            senderSignature: signature.data
        
        })

        const pendingTransactions = await apiKit.getTransaction(safeTxHash)
        console.log("The pending transaction is", pendingTransactions)
        

        return safeTransaction;
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
