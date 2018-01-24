//takes in an IPFS hash and returns the address portion (_ipfsHash) in the format that remix uses, as well as the function code (_ipfsHashFunc) and the size (_ipfsHashSize) as integers.
//this is the format that our smart contract uses to represent IPFS hashes
//assumes that ipfs hashes are 34 bytes in lenght. aka normal IPFS hashes.
const bs58 = require('bs58')
function ipfsHashDecompose() {
    if (process.argv.length === 2) {
        console.log("please enter an IPFS hash as an argument")
    }else{
        console.log("IPFS hash: "+process.argv[2]);
        const bytes = bs58.decode(process.argv[2])
        let _ipfsHashFuncBytes=bytes.slice(0,1)
        let _ipfsHashSizeBytes=bytes.slice(1,2)
        let _ipfsHashBytes=bytes.slice(2,34)
        let _ipfsHashStringArr=[]
        _ipfsHashBytes.forEach(byte=>{
            _ipfsHashStringArr.push("0x"+byte.toString(16))
        })
        return({_ipfsHash: JSON.stringify(_ipfsHashStringArr), _ipfsHashFunc: _ipfsHashFuncBytes.readInt8(), _ipfsHashSize: _ipfsHashSizeBytes.readInt8()  })
    }
}
console.log(ipfsHashDecompose());