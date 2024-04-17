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
        while (_) try {
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
exports.__esModule = true;
var ethers_1 = require("ethers");
var protocol_kit_1 = require("@safe-global/protocol-kit");
var protocol_kit_2 = require("@safe-global/protocol-kit");
var dotenv_1 = require("dotenv");
dotenv_1["default"].config();
//require("dotenv").config();
// https://chainlist.org/?search=sepolia&testnets=true
var RPC_URL = 'https://sepolia.base.org';
var provider = new ethers_1.ethers.JsonRpcProvider(RPC_URL);
var owner1Signer = new ethers_1.ethers.Wallet(process.env.AI_PK, provider);
var owner2Signer = new ethers_1.ethers.Wallet(process.env.SIGNER_W2, provider);
var safeAddress = "0x8413e348B1ed25E06d007e5f5d946a8ffC5240aC";
var ethAdapterOwner1 = new protocol_kit_1.EthersAdapter({
    ethers: ethers_1.ethers,
    signerOrProvider: owner1Signer
});
var manualMessage = "send 10 USDC to paul's wallet at 0x096d3c124688cbc01bCea04052de98f245378D82";
function safeSigner(walletInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var walletAddress, amount, safeSdk, safeTransactionData, safeTransaction, signedSafeTX;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!walletInfo) return [3 /*break*/, 4];
                    walletAddress = walletInfo.walletAddress;
                    amount = walletInfo.amount;
                    console.log("Wallet address:", amount);
                    return [4 /*yield*/, protocol_kit_2["default"].create({ ethAdapter: ethAdapterOwner1, safeAddress: safeAddress })
                        // Now you have the walletAddress and amount, you can create the transaction
                    ];
                case 1:
                    safeSdk = _a.sent();
                    safeTransactionData = {
                        to: walletAddress,
                        data: '0x',
                        value: ethers_1.ethers.parseUnits(amount, 'ether').toString() // Assuming the amount is in ether
                    };
                    return [4 /*yield*/, safeSdk.createTransaction({ transactions: [safeTransactionData] })];
                case 2:
                    safeTransaction = _a.sent();
                    return [4 /*yield*/, safeSdk.signTransaction(safeTransaction)];
                case 3:
                    signedSafeTX = _a.sent();
                    console.log("The safe transaction is", safeTransaction, "and the signedTX is", signedSafeTX);
                    // Log the transaction data
                    //console.log("the safe transaction data is ", safeTransactionData);
                    return [2 /*return*/, safeTransaction];
                case 4:
                    console.error('No wallet info could be retrieved.');
                    return [2 /*return*/, null];
            }
        });
    });
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
module.exports = { safeSigner: safeSigner };
