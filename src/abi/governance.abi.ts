export const ABI_JSON = [
    {
        "type": "constructor",
        "stateMutability": "undefined",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_token"
            },
            {
                "type": "address",
                "name": "_timelock"
            }
        ]
    },
    {
        "type": "error",
        "name": "Empty",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "LateQuorumVoteExtensionSet",
        "inputs": [
            {
                "type": "uint64",
                "name": "oldVoteExtension",
                "indexed": false
            },
            {
                "type": "uint64",
                "name": "newVoteExtension",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ProposalCanceled",
        "inputs": [
            {
                "type": "uint256",
                "name": "proposalId",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ProposalCreated",
        "inputs": [
            {
                "type": "uint256",
                "name": "proposalId",
                "indexed": false
            },
            {
                "type": "address",
                "name": "proposer",
                "indexed": false
            },
            {
                "type": "address[]",
                "name": "targets"
            },
            {
                "type": "uint256[]",
                "name": "values"
            },
            {
                "type": "string[]",
                "name": "signatures"
            },
            {
                "type": "bytes[]",
                "name": "calldatas"
            },
            {
                "type": "uint256",
                "name": "startBlock",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "endBlock",
                "indexed": false
            },
            {
                "type": "string",
                "name": "description",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ProposalExecuted",
        "inputs": [
            {
                "type": "uint256",
                "name": "proposalId",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ProposalExtended",
        "inputs": [
            {
                "type": "uint256",
                "name": "proposalId",
                "indexed": true
            },
            {
                "type": "uint64",
                "name": "extendedDeadline",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ProposalQueued",
        "inputs": [
            {
                "type": "uint256",
                "name": "proposalId",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "eta",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ProposalThresholdSet",
        "inputs": [
            {
                "type": "uint256",
                "name": "oldProposalThreshold",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "newProposalThreshold",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "QuorumNumeratorUpdated",
        "inputs": [
            {
                "type": "uint256",
                "name": "oldQuorumNumerator",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "newQuorumNumerator",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "TimelockChange",
        "inputs": [
            {
                "type": "address",
                "name": "oldTimelock",
                "indexed": false
            },
            {
                "type": "address",
                "name": "newTimelock",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "VoteCast",
        "inputs": [
            {
                "type": "address",
                "name": "voter",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "proposalId",
                "indexed": false
            },
            {
                "type": "uint8",
                "name": "support",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "weight",
                "indexed": false
            },
            {
                "type": "string",
                "name": "reason",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "VoteCastWithParams",
        "inputs": [
            {
                "type": "address",
                "name": "voter",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "proposalId",
                "indexed": false
            },
            {
                "type": "uint8",
                "name": "support",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "weight",
                "indexed": false
            },
            {
                "type": "string",
                "name": "reason",
                "indexed": false
            },
            {
                "type": "bytes",
                "name": "params",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "VotingDelaySet",
        "inputs": [
            {
                "type": "uint256",
                "name": "oldVotingDelay",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "newVotingDelay",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "VotingPeriodSet",
        "inputs": [
            {
                "type": "uint256",
                "name": "oldVotingPeriod",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "newVotingPeriod",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "BALLOT_TYPEHASH",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bytes32",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "COUNTING_MODE",
        "constant": true,
        "stateMutability": "pure",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "string",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "EXTENDED_BALLOT_TYPEHASH",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bytes32",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "cancel",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "proposalId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "castVote",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "proposalId"
            },
            {
                "type": "uint8",
                "name": "support"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "castVoteBySig",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "proposalId"
            },
            {
                "type": "uint8",
                "name": "support"
            },
            {
                "type": "uint8",
                "name": "v"
            },
            {
                "type": "bytes32",
                "name": "r"
            },
            {
                "type": "bytes32",
                "name": "s"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "castVoteWithReason",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "proposalId"
            },
            {
                "type": "uint8",
                "name": "support"
            },
            {
                "type": "string",
                "name": "reason"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "castVoteWithReasonAndParams",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "proposalId"
            },
            {
                "type": "uint8",
                "name": "support"
            },
            {
                "type": "string",
                "name": "reason"
            },
            {
                "type": "bytes",
                "name": "params"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "castVoteWithReasonAndParamsBySig",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "proposalId"
            },
            {
                "type": "uint8",
                "name": "support"
            },
            {
                "type": "string",
                "name": "reason"
            },
            {
                "type": "bytes",
                "name": "params"
            },
            {
                "type": "uint8",
                "name": "v"
            },
            {
                "type": "bytes32",
                "name": "r"
            },
            {
                "type": "bytes32",
                "name": "s"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "execute",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "address[]",
                "name": "targets"
            },
            {
                "type": "uint256[]",
                "name": "values"
            },
            {
                "type": "bytes[]",
                "name": "calldatas"
            },
            {
                "type": "bytes32",
                "name": "descriptionHash"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "execute",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "uint256",
                "name": "proposalId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getActions",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "proposalId"
            }
        ],
        "outputs": [
            {
                "type": "address[]",
                "name": "targets"
            },
            {
                "type": "uint256[]",
                "name": "values"
            },
            {
                "type": "string[]",
                "name": "signatures"
            },
            {
                "type": "bytes[]",
                "name": "calldatas"
            }
        ]
    },
    {
        "type": "function",
        "name": "getReceipt",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "proposalId"
            },
            {
                "type": "address",
                "name": "voter"
            }
        ],
        "outputs": [
            {
                "type": "tuple",
                "name": "",
                "components": [
                    {
                        "type": "bool",
                        "name": "hasVoted"
                    },
                    {
                        "type": "uint8",
                        "name": "support"
                    },
                    {
                        "type": "uint256",
                        "name": "votes"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "getVotes",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "account"
            },
            {
                "type": "uint256",
                "name": "blockNumber"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getVotesWithParams",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "account"
            },
            {
                "type": "uint256",
                "name": "blockNumber"
            },
            {
                "type": "bytes",
                "name": "params"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "hasVoted",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "proposalId"
            },
            {
                "type": "address",
                "name": "account"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "hashProposal",
        "constant": true,
        "stateMutability": "pure",
        "payable": false,
        "inputs": [
            {
                "type": "address[]",
                "name": "targets"
            },
            {
                "type": "uint256[]",
                "name": "values"
            },
            {
                "type": "bytes[]",
                "name": "calldatas"
            },
            {
                "type": "bytes32",
                "name": "descriptionHash"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "lateQuorumVoteExtension",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint64",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "name",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "string",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "onERC1155BatchReceived",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": ""
            },
            {
                "type": "address",
                "name": ""
            },
            {
                "type": "uint256[]",
                "name": ""
            },
            {
                "type": "uint256[]",
                "name": ""
            },
            {
                "type": "bytes",
                "name": ""
            }
        ],
        "outputs": [
            {
                "type": "bytes4",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "onERC1155Received",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": ""
            },
            {
                "type": "address",
                "name": ""
            },
            {
                "type": "uint256",
                "name": ""
            },
            {
                "type": "uint256",
                "name": ""
            },
            {
                "type": "bytes",
                "name": ""
            }
        ],
        "outputs": [
            {
                "type": "bytes4",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "onERC721Received",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": ""
            },
            {
                "type": "address",
                "name": ""
            },
            {
                "type": "uint256",
                "name": ""
            },
            {
                "type": "bytes",
                "name": ""
            }
        ],
        "outputs": [
            {
                "type": "bytes4",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "proposalDeadline",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "proposalId"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "proposalEta",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "proposalId"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "proposalSnapshot",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "proposalId"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "proposalThreshold",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "proposals",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "proposalId"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "id"
            },
            {
                "type": "address",
                "name": "proposer"
            },
            {
                "type": "uint256",
                "name": "eta"
            },
            {
                "type": "uint256",
                "name": "startBlock"
            },
            {
                "type": "uint256",
                "name": "endBlock"
            },
            {
                "type": "uint256",
                "name": "forVotes"
            },
            {
                "type": "uint256",
                "name": "againstVotes"
            },
            {
                "type": "uint256",
                "name": "abstainVotes"
            },
            {
                "type": "bool",
                "name": "canceled"
            },
            {
                "type": "bool",
                "name": "executed"
            }
        ]
    },
    {
        "type": "function",
        "name": "propose",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address[]",
                "name": "targets"
            },
            {
                "type": "uint256[]",
                "name": "values"
            },
            {
                "type": "bytes[]",
                "name": "calldatas"
            },
            {
                "type": "string",
                "name": "description"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "propose",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address[]",
                "name": "targets"
            },
            {
                "type": "uint256[]",
                "name": "values"
            },
            {
                "type": "string[]",
                "name": "signatures"
            },
            {
                "type": "bytes[]",
                "name": "calldatas"
            },
            {
                "type": "string",
                "name": "description"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "queue",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address[]",
                "name": "targets"
            },
            {
                "type": "uint256[]",
                "name": "values"
            },
            {
                "type": "bytes[]",
                "name": "calldatas"
            },
            {
                "type": "bytes32",
                "name": "descriptionHash"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "queue",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "proposalId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "quorum",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "blockNumber"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "quorumDenominator",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "quorumNumerator",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "quorumVotes",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "relay",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "target"
            },
            {
                "type": "uint256",
                "name": "value"
            },
            {
                "type": "bytes",
                "name": "data"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setLateQuorumVoteExtension",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint64",
                "name": "newVoteExtension"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setProposalThreshold",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "newProposalThreshold"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setVotingDelay",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "newVotingDelay"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setVotingPeriod",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "newVotingPeriod"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "state",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "proposalId"
            }
        ],
        "outputs": [
            {
                "type": "uint8",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "supportsInterface",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes4",
                "name": "interfaceId"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "timelock",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "token",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "updateQuorumNumerator",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "newQuorumNumerator"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "updateTimelock",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "newTimelock"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "version",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "string",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "votingDelay",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "votingPeriod",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "receive",
        "stateMutability": "payable"
    }
]
