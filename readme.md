# BitSceen MVP

This is the code for the site that will allow users to pay with ether to change the content on the screen for our art gallery idea. Powered by ethereum and IPFS. 

## Getting Started

This repo currently contains 3 folders:

-server+frontend: this contains the code for a nodeJS server that has the purpose of serving the front end of the websie, but provide ipfs read and write abilities.

-smart contract: this contains the code for the BitSceen MVP smart contract. This needs to be connected to the frontend via web3.js + metamask

-tools: this currently contains a tool for testing the smart contract. The smart contract can be teste using the online remix IDE, which takes in parameters for IPFS hashes in a very specific way. This tool converts an IPFS hash to this format for testing.


### Prerequisites

-the server requires nodeJS

-the server requires IPFS https://ipfs.io/docs/install/ to be installed on your machine and having the daemon running

-the smart contract requires  the remix IDE for testing, metamask, and rikeby ethers. I can send you some of these test ethers if you want to test it.


