var bitscreenABI = [
	{
		"constant": true,
		"inputs": [],
		"name": "screenstate",
		"outputs": [
			{
				"name": "currFundDest",
				"type": "string"
			},
			{
				"name": "currLargestAmount",
				"type": "uint256"
			},
			{
				"name": "currHolder",
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
			},
			{
				"name": "_dest",
				"type": "string"
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
	}
]

var bitscreenAddress="0xc16d3f3b9796ff0b57fcac45be4024728b3c7b3b"