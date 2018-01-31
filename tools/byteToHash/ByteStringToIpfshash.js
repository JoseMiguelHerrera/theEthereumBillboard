//takes in an IPFS hash and returns the address portion (_ipfsHash) in the format that remix uses, as well as the function code (_ipfsHashFunc) and the size (_ipfsHashSize) as integers.
//this is the format that our smart contract uses to represent IPFS hashes
//assumes that ipfs hashes are 34 bytes in lenght. aka normal IPFS hashes.


//takes in a string that represents the pure hash portion of an IPFS hash in hex format
//makes the assumption that it is a normal (18 type hash, 32 byts in length) IPFS hash
//returns an IPFS hash

const bs58 = require('bs58')
function ipfsHashCompose() {
    if (process.argv.length === 2) {
        console.log("please enter the hex hash portion of an IPFS hash as an argument")
    }else{
        console.log("hex hash portion of an IPFS hash: "+process.argv[2]);

        let byteArr =[18,32];

        for (var i = 2; i < process.argv[2].length; i += 2) {
           byteArr.push(parseInt(process.argv[2].substr(i, 2),16))
        }

        return bs58.encode(byteArr)
    }
}
console.log(ipfsHashCompose());