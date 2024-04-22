import { ethers } from 'ethers';
import { EthersAdapter } from '@safe-global/protocol-kit';
import { SafeFactory } from '@safe-global/protocol-kit';
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import Safe from '@safe-global/protocol-kit';
import SafeFactoryConfig from '@safe-global/protocol-kit';

import dotenv from 'dotenv';
import { WalletInfo } from './wallet-info';

require('dotenv').config();

const owner1PK = process.env.AI_PK;

if (!owner1PK || owner1PK === '') {
    console.error('No AI_PK provided');
    process.exit(1);
}

// https://chainlist.org/?search=sepolia&testnets=true
const RPC_URL = 'https://mainnet.base.org';
const provider = new ethers.JsonRpcProvider(RPC_URL);

const owner1Signer = new ethers.Wallet(owner1PK, provider);
//const owner2Signer = new ethers.Wallet(process.env.SIGNER_W2, provider)
const safeAddress = '0x8413e348B1ed25E06d007e5f5d946a8ffC5240aC';

const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: owner1Signer,
});

//const protocolKit = new SafeFactoryConfig.create({ethAdapter: owner1Signer})

const manualMessage =
    "send 10 USDC to paul's wallet at 0x096d3c124688cbc01bCea04052de98f245378D82";

async function safeSigner(walletInfo: WalletInfo) {
    if (walletInfo) {
        const walletAddress = walletInfo.walletAddress;
        const amount = walletInfo.amount;

        console.log('Wallet address:', walletInfo);

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
            value: '1', // Assuming the amount is in ether
        };

        const safeTransaction = await protocolKit.createTransaction({
            transactions: [safeTransactionData],
        });
        const signature = await protocolKit.signTransaction(safeTransaction);

        console.log(
            'The safe transaction is',
            safeTransactionData,
            'and the signedTX is',
            signature
        );

        // Log the transaction data
        //console.log("the safe transaction data is ", safeTransactionData);

        return safeTransaction;
    } else {
        console.error('No wallet info could be retrieved.');
        return null;
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

safeSigner({
    walletAddress: '0x096d3c124688cbc01bCea04052de98f245378D82',
    amount: '',
});

module.exports = { safeSigner };
