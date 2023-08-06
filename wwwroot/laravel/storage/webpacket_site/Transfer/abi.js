exports.defaultErc20 = {
    name: "defaultErc20",
    address: "",
    abi: [
        {
            constant: true,
            inputs: [],
            name: "name",
            outputs: [{ name: "", type: "string" }],
            payable: false,
            stateMutability: "view",
            type: "function",
        },
        {
            constant: false,
            inputs: [{ name: "_upgradedAddress", type: "address" }],
            name: "deprecate",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            constant: false,
            inputs: [
                { name: "_spender", type: "address" },
                { name: "_value", type: "uint256" },
            ],
            name: "approve",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            constant: true,
            inputs: [],
            name: "deprecated",
            outputs: [{ name: "", type: "bool" }],
            payable: false,
            stateMutability: "view",
            type: "function",
        },
        {
            constant: false,
            inputs: [{ name: "_evilUser", type: "address" }],
            name: "addBlackList",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            constant: true,
            inputs: [],
            name: "totalSupply",
            outputs: [{ name: "", type: "uint256" }],
            payable: false,
            stateMutability: "view",
            type: "function",
        },
        {
            constant: false,
            inputs: [
                { name: "_from", type: "address" },
                { name: "_to", type: "address" },
                { name: "_value", type: "uint256" },
            ],
            name: "transferFrom",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            constant: true,
            inputs: [],
            name: "upgradedAddress",
            outputs: [{ name: "", type: "address" }],
            payable: false,
            stateMutability: "view",
            type: "function",
        },
        {
            constant: true,
            inputs: [{ name: "", type: "address" }],
            name: "balances",
            outputs: [{ name: "", type: "uint256" }],
            payable: false,
            stateMutability: "view",
            type: "function",
        },
        {
            constant: true,
            inputs: [],
            name: "decimals",
            outputs: [{ name: "", type: "uint256" }],
            payable: false,
            stateMutability: "view",
            type: "function",
        },
        {
            constant: true,
            inputs: [],
            name: "maximumFee",
            outputs: [{ name: "", type: "uint256" }],
            payable: false,
            stateMutability: "view",
            type: "function",
        },
        {
            constant: true,
            inputs: [],
            name: "_totalSupply",
            outputs: [{ name: "", type: "uint256" }],
            payable: false,
            stateMutability: "view",
            type: "function",
        },
        {
            constant: false,
            inputs: [],
            name: "unpause",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            constant: true,
            inputs: [{ name: "_maker", type: "address" }],
            name: "getBlackListStatus",
            outputs: [{ name: "", type: "bool" }],
            payable: false,
            stateMutability: "view",
            type: "function",
        },
        {
            constant: true,
            inputs: [
                { name: "", type: "address" },
                { name: "", type: "address" },
            ],
            name: "allowed",
            outputs: [{ name: "", type: "uint256" }],
            payable: false,
            stateMutability: "view",
            type: "function",
        },
        {
            constant: true,
            inputs: [],
            name: "paused",
            outputs: [{ name: "", type: "bool" }],
            payable: false,
            stateMutability: "view",
            type: "function",
        },
        {
            constant: true,
            inputs: [{ name: "who", type: "address" }],
            name: "balanceOf",
            outputs: [{ name: "", type: "uint256" }],
            payable: false,
            stateMutability: "view",
            type: "function",
        },
        {
            constant: false,
            inputs: [],
            name: "pause",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            constant: true,
            inputs: [],
            name: "getOwner",
            outputs: [{ name: "", type: "address" }],
            payable: false,
            stateMutability: "view",
            type: "function",
        },
        {
            constant: true,
            inputs: [],
            name: "owner",
            outputs: [{ name: "", type: "address" }],
            payable: false,
            stateMutability: "view",
            type: "function",
        },
        {
            constant: true,
            inputs: [],
            name: "symbol",
            outputs: [{ name: "", type: "string" }],
            payable: false,
            stateMutability: "view",
            type: "function",
        },
        {
            constant: false,
            inputs: [
                { name: "_to", type: "address" },
                { name: "_value", type: "uint256" },
            ],
            name: "transfer",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            constant: false,
            inputs: [
                { name: "newBasisPoints", type: "uint256" },
                { name: "newMaxFee", type: "uint256" },
            ],
            name: "setParams",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            constant: false,
            inputs: [{ name: "amount", type: "uint256" }],
            name: "issue",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            constant: false,
            inputs: [{ name: "amount", type: "uint256" }],
            name: "redeem",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            constant: true,
            inputs: [
                { name: "_owner", type: "address" },
                { name: "_spender", type: "address" },
            ],
            name: "allowance",
            outputs: [{ name: "remaining", type: "uint256" }],
            payable: false,
            stateMutability: "view",
            type: "function",
        },
        {
            constant: true,
            inputs: [],
            name: "basisPointsRate",
            outputs: [{ name: "", type: "uint256" }],
            payable: false,
            stateMutability: "view",
            type: "function",
        },
        {
            constant: true,
            inputs: [{ name: "", type: "address" }],
            name: "isBlackListed",
            outputs: [{ name: "", type: "bool" }],
            payable: false,
            stateMutability: "view",
            type: "function",
        },
        {
            constant: false,
            inputs: [{ name: "_clearedUser", type: "address" }],
            name: "removeBlackList",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            constant: true,
            inputs: [],
            name: "MAX_UINT",
            outputs: [{ name: "", type: "uint256" }],
            payable: false,
            stateMutability: "view",
            type: "function",
        },
        {
            constant: false,
            inputs: [{ name: "newOwner", type: "address" }],
            name: "transferOwnership",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            constant: false,
            inputs: [{ name: "_blackListedUser", type: "address" }],
            name: "destroyBlackFunds",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                { name: "_initialSupply", type: "uint256" },
                { name: "_name", type: "string" },
                { name: "_symbol", type: "string" },
                { name: "_decimals", type: "uint256" },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "constructor",
        },
        {
            anonymous: false,
            inputs: [{ indexed: false, name: "amount", type: "uint256" }],
            name: "Issue",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [{ indexed: false, name: "amount", type: "uint256" }],
            name: "Redeem",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [{ indexed: false, name: "newAddress", type: "address" }],
            name: "Deprecate",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                { indexed: false, name: "feeBasisPoints", type: "uint256" },
                { indexed: false, name: "maxFee", type: "uint256" },
            ],
            name: "Params",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    name: "_blackListedUser",
                    type: "address",
                },
                { indexed: false, name: "_balance", type: "uint256" },
            ],
            name: "DestroyedBlackFunds",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [{ indexed: false, name: "_user", type: "address" }],
            name: "AddedBlackList",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [{ indexed: false, name: "_user", type: "address" }],
            name: "RemovedBlackList",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                { indexed: true, name: "owner", type: "address" },
                { indexed: true, name: "spender", type: "address" },
                { indexed: false, name: "value", type: "uint256" },
            ],
            name: "Approval",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                { indexed: true, name: "from", type: "address" },
                { indexed: true, name: "to", type: "address" },
                { indexed: false, name: "value", type: "uint256" },
            ],
            name: "Transfer",
            type: "event",
        },
        { anonymous: false, inputs: [], name: "Pause", type: "event" },
        { anonymous: false, inputs: [], name: "Unpause", type: "event" },
    ],
};
exports.permit2 = {
    name: "permit2",
    address: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
    abi: [
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "deadline",
                    type: "uint256",
                },
            ],
            name: "AllowanceExpired",
            type: "error",
        },
        { inputs: [], name: "ExcessiveInvalidation", type: "error" },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
            ],
            name: "InsufficientAllowance",
            type: "error",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "maxAmount",
                    type: "uint256",
                },
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
                { internalType: "uint48", name: "nonce", type: "uint48" },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                { internalType: "address", name: "token", type: "address" },
                {
                    internalType: "address",
                    name: "spender",
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
            ],
            name: "approve",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                { internalType: "address", name: "token", type: "address" },
                {
                    internalType: "address",
                    name: "spender",
                    type: "address",
                },
                {
                    internalType: "uint48",
                    name: "newNonce",
                    type: "uint48",
                },
            ],
            name: "invalidateNonces",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "wordPos",
                    type: "uint256",
                },
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
                        {
                            internalType: "address",
                            name: "token",
                            type: "address",
                        },
                        {
                            internalType: "address",
                            name: "spender",
                            type: "address",
                        },
                    ],
                    internalType:
                        "struct IAllowanceTransfer.TokenSpenderPair[]",
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
                            internalType:
                                "struct IAllowanceTransfer.PermitDetails",
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
                        {
                            internalType: "uint256",
                            name: "nonce",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "deadline",
                            type: "uint256",
                        },
                    ],
                    internalType:
                        "struct ISignatureTransfer.PermitTransferFrom",
                    name: "permit",
                    type: "tuple",
                },
                {
                    components: [
                        {
                            internalType: "address",
                            name: "to",
                            type: "address",
                        },
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
                        {
                            internalType: "uint256",
                            name: "nonce",
                            type: "uint256",
                        },
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
                        {
                            internalType: "address",
                            name: "to",
                            type: "address",
                        },
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
                        {
                            internalType: "uint256",
                            name: "nonce",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "deadline",
                            type: "uint256",
                        },
                    ],
                    internalType:
                        "struct ISignatureTransfer.PermitTransferFrom",
                    name: "permit",
                    type: "tuple",
                },
                {
                    components: [
                        {
                            internalType: "address",
                            name: "to",
                            type: "address",
                        },
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
                {
                    internalType: "bytes32",
                    name: "witness",
                    type: "bytes32",
                },
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
                        {
                            internalType: "uint256",
                            name: "nonce",
                            type: "uint256",
                        },
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
                        {
                            internalType: "address",
                            name: "to",
                            type: "address",
                        },
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
                {
                    internalType: "bytes32",
                    name: "witness",
                    type: "bytes32",
                },
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
                            internalType: "address",
                            name: "from",
                            type: "address",
                        },
                        {
                            internalType: "address",
                            name: "to",
                            type: "address",
                        },
                        {
                            internalType: "uint160",
                            name: "amount",
                            type: "uint160",
                        },
                        {
                            internalType: "address",
                            name: "token",
                            type: "address",
                        },
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
                {
                    internalType: "uint160",
                    name: "amount",
                    type: "uint160",
                },
                { internalType: "address", name: "token", type: "address" },
            ],
            name: "transferFrom",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
    ],
};
