const bs58 = require('bs58')

function ipfsHashCompose(hexHashPortion) {
    let byteArr = [18, 32];
    for (var i = 2; i < hexHashPortion.length; i += 2) {
        byteArr.push(parseInt(hexHashPortion.substr(i, 2), 16))
    }
    return bs58.encode(byteArr)
}



function ipfsHashDecompose() {


}

module.exports = {
    ipfsHashCompose: ipfsHashCompose,
    ipfsHashDecompose: ipfsHashDecompose
}