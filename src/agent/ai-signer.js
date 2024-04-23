"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var protocol_kit_1 = require("@safe-global/protocol-kit");
var safe_core_sdk_types_1 = require("@safe-global/safe-core-sdk-types");
var protocol_kit_2 = require("@safe-global/protocol-kit");
var api_kit_1 = require("@safe-global/api-kit");
require('dotenv').config();
var owner1PK = process.env.AI_PK;
var AI_ADD = "0x3FfE02322f6D3b23b4f153289E1f280eb15c0089";
if (!owner1PK || owner1PK === '') {
    console.error('No AI_PK provided');
    process.exit(1);
}
// https://chainlist.org/?search=sepolia&testnets=true
var RPC_URL = 'https://base.llamarpc.com';
//const provider = new Web3.providers.HttpProvider(RPC_URL);
var provider = new ethers_1.ethers.JsonRpcProvider(RPC_URL);
var signer1 = new ethers_1.ethers.Wallet(owner1PK, provider);
//const web3 = new Web3(provider);
//const owner1Signer = new ethers.Wallet(owner1PK, provider);
//const owner2Signer = new ethers.Wallet(process.env.SIGNER_W2, provider)
var safeAddress = '0x8413e348B1ed25E06d007e5f5d946a8ffC5240aC';
var ethAdapter = new protocol_kit_1.EthersAdapter({
    ethers: ethers_1.ethers,
    signerOrProvider: signer1
});
var apiKit = new api_kit_1.default({
    chainId: 8453n,
    txServiceUrl: RPC_URL
});
//const manualMessage = "send 10 USDC to paul's wallet at 0x096d3c124688cbc01bCea04052de98f245378D82";
function safeSigner(walletInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var walletAddress, amount, protocolKit, safeTransactionData, safeTransaction, safeTxHash, signature, pendingTransactions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!walletInfo) return [3 /*break*/, 7];
                    walletAddress = walletInfo.walletAddress;
                    amount = walletInfo.amount;
                    return [4 /*yield*/, protocol_kit_2.default.create({
                            ethAdapter: ethAdapter,
                            safeAddress: safeAddress,
                        })];
                case 1:
                    protocolKit = _a.sent();
                    safeTransactionData = {
                        to: walletAddress,
                        data: '0x',
                        value: amount, // Assuming the amount is in ether
                        operation: safe_core_sdk_types_1.OperationType.Call
                    };
                    return [4 /*yield*/, protocolKit.createTransaction({ transactions: [safeTransactionData] })];
                case 2:
                    safeTransaction = _a.sent();
                    return [4 /*yield*/, protocolKit.getTransactionHash(safeTransaction)];
                case 3:
                    safeTxHash = _a.sent();
                    return [4 /*yield*/, protocolKit.signHash(safeTxHash)];
                case 4:
                    signature = _a.sent();
                    console.log("The safe transaction is", safeTxHash);
                    //console.log("and the hash is", safeTxHash);
                    return [4 /*yield*/, apiKit.proposeTransaction({
                            safeAddress: '0x8413e348B1ed25E06d007e5f5d946a8ffC5240aC',
                            safeTransactionData: safeTransaction.data,
                            safeTxHash: safeTxHash,
                            senderAddress: AI_ADD,
                            senderSignature: signature.data
                        })];
                case 5:
                    //console.log("and the hash is", safeTxHash);
                    _a.sent();
                    return [4 /*yield*/, apiKit.getTransaction(safeTxHash)];
                case 6:
                    pendingTransactions = _a.sent();
                    console.log("The pending transaction is", pendingTransactions);
                    return [2 /*return*/, safeTransaction];
                case 7:
                    console.error('No wallet info could be retrieved.');
                    return [2 /*return*/, null];
            }
        });
    });
}
safeSigner({
    walletAddress: '0x096d3c124688cbc01bCea04052de98f245378D82',
    amount: '1',
});
module.exports = { safeSigner: safeSigner };
