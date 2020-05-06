var bitscreenABI =[
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
				"name": "newPercent",
				"type": "uint256"
			}
		],
		"name": "changePriceDecreasePercent",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "newPeriod",
				"type": "uint256"
			}
		],
		"name": "changePriceDecreasePeriod",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
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
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "PriceChange",
		"type": "event"
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
			},
			{
				"indexed": false,
				"name": "_cost",
				"type": "uint256"
			}
		],
		"name": "ImageChange",
		"type": "event"
	},
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
			},
			{
				"name": "_periodPercentagePriceDecrease",
				"type": "uint256"
			},
			{
				"name": "_priceDecreasePeriodLengthSecs",
				"type": "uint256"
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
		"name": "withdrawDividend",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "withdrawOwnerAmount",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "calculateCurrDynamicPrice",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "contractValue",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
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
		"constant": true,
		"inputs": [],
		"name": "dividendinfo",
		"outputs": [
			{
				"name": "activeAdBuysForDividend",
				"type": "uint256"
			},
			{
				"name": "ownerpool",
				"type": "uint256"
			},
			{
				"name": "dividendPool",
				"type": "uint256"
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
		"name": "inquireDividentAmount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
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
				"name": "currTopBid",
				"type": "uint256"
			},
			{
				"name": "currTopBidTimeStamp",
				"type": "uint256"
			},
			{
				"name": "lifetimeValue",
				"type": "uint256"
			},
			{
				"name": "periodPercentagePriceDecrease",
				"type": "uint256"
			},
			{
				"name": "PriceDecreasePeriodLengthSecs",
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

//bitscreen 1.0 main net address
//var bitscreenAddress="0xc306fd2ed6775ae8da2021bf67a3148d74ad3ceb"

var bitscreenAddress="0x0094110C81183740C23D561818500cE0C8222d8B"