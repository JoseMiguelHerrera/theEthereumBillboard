var bitscreenABI =[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_sexual",
				"type": "bool"
			},
			{
				"indexed": false,
				"name": "_violent",
				"type": "bool"
			},
			{
				"indexed": false,
				"name": "_political",
				"type": "bool"
			},
			{
				"indexed": false,
				"name": "_controversial",
				"type": "bool"
			},
			{
				"indexed": false,
				"name": "_illegal",
				"type": "bool"
			}
		],
		"name": "RuleChange",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_ipfsHash",
				"type": "bytes32"
			},
			{
				"name": "_ipfsHashFunc",
				"type": "uint8"
			},
			{
				"name": "_ipfsHashSize",
				"type": "uint8"
			}
		],
		"name": "changeBid",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_ipfsHash",
				"type": "bytes32"
			},
			{
				"name": "_ipfsHashFunc",
				"type": "uint8"
			},
			{
				"name": "_ipfsHashSize",
				"type": "uint8"
			}
		],
		"name": "emergencyOverwrite",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_hash",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "_hashFunction",
				"type": "uint8"
			},
			{
				"indexed": false,
				"name": "_size",
				"type": "uint8"
			}
		],
		"name": "ImageChange",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_sexual",
				"type": "bool"
			},
			{
				"name": "_violent",
				"type": "bool"
			},
			{
				"name": "_political",
				"type": "bool"
			},
			{
				"name": "_controversial",
				"type": "bool"
			},
			{
				"name": "_illegal",
				"type": "bool"
			}
		],
		"name": "changeRules",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "remove",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_ipfsHash",
				"type": "bytes32"
			},
			{
				"name": "_ipfsHashFunc",
				"type": "uint8"
			},
			{
				"name": "_ipfsHashSize",
				"type": "uint8"
			},
			{
				"name": "_heightRatio",
				"type": "uint8"
			},
			{
				"name": "_widthRatio",
				"type": "uint8"
			},
			{
				"name": "_country",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "currPicHash",
		"outputs": [
			{
				"name": "hash",
				"type": "bytes32"
			},
			{
				"name": "hashFunction",
				"type": "uint8"
			},
			{
				"name": "size",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getBadAddresses",
		"outputs": [
			{
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "rules",
		"outputs": [
			{
				"name": "sexual",
				"type": "bool"
			},
			{
				"name": "violent",
				"type": "bool"
			},
			{
				"name": "political",
				"type": "bool"
			},
			{
				"name": "controversial",
				"type": "bool"
			},
			{
				"name": "illegal",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "screenstate",
		"outputs": [
			{
				"name": "currLargestAmount",
				"type": "uint256"
			},
			{
				"name": "totalRaised",
				"type": "uint256"
			},
			{
				"name": "currHolder",
				"type": "address"
			},
			{
				"name": "heightRatio",
				"type": "uint8"
			},
			{
				"name": "widthRatio",
				"type": "uint8"
			},
			{
				"name": "country",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

var bitscreenAddress="0xcbb840c93d99212a26c50266aa7a84355eaf3781"