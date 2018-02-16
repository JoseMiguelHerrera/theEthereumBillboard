var web3js;
function checkMetamask() {
    return new Promise((resolve, reject) => {
        if (typeof web3 !== 'undefined') {
            console.log("injected web3 detected from something like metamask")

            // Use Mist/MetaMask's provider
            //var provider = web3.currentProvider
            web3js = new Web3(web3.currentProvider);
            web3js.eth.getAccounts((err, accounts) => {
                if (accounts.length === 0) {
                    reject("no account detected. please unlock metamask");
                } else {
                    web3js.eth.defaultAccount = accounts[0];
                    resolve();
                }
            });
        } else {
            console.log("no injected web3 detected, using local. Read only for now");
            //reject("bitscreen only works properly with MetaMask installed, please install before using!");
            web3js = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/UiFZYgJw80AI7LbKtG7o:8545"));
            resolve();
        }
    })
}

function getContract() {
    return new Promise((resolve, reject) => {
        var bitscreenContract = web3js.eth.contract(bitscreenABI);
        var bitscreen = bitscreenContract.at(bitscreenAddress);

        if (bitscreen) {
            resolve(bitscreen)
        } else {
            reject("error getting contract")
        }

    })
}

function pollContract() {
    var currDest;
    var currLargest;
    var currHolder;
    return new Promise((resolve, reject) => {
        bitscreen.currPicHash((err, resp) => {
            if (err) {
                reject(err)
            } else {
                var newHash = hashFuncs.ipfsHashCompose(resp[0])
                bitscreen.screenstate((err, resp) => {
                    if (err) {
                        reject(err)
                    } else {
                        currDest = resp[0];
                        currLargest = web3js.fromWei(resp[1], 'ether');
                        currHolder = resp[2];
                        document.getElementById("currHashSolidity").innerHTML = "Current IPFS image hash (from smart contract): " + newHash;
                        document.getElementById("currDestination").innerHTML = "Current proposed destination of funds (from smart contract): " + currDest;
                        document.getElementById("currLargestAmount").innerHTML = "Current largest amount sent [ether] (from smart contract): " + currLargest;
                        document.getElementById("currScreenHolder").innerHTML = "Current holder of screen (from smart contract): " + currHolder;

                        //if hash actually changed, then get the new pic from server
                        if (newHash !== currHash) {
                            currHash = newHash
                            displayHashPic(currHash);
                        }

                        resolve({ currHash: currHash, currDest: currDest, currLargest: currLargest, currHolder: currHolder });
                    }
                })


            }
        })
    })
}

function displayHashPic(currHash) {
    //get curr img 
    fetch('/getIpfsObject', {
        body: JSON.stringify({ ipfsHash: currHash }),
        method: "POST",
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    }).then((resp) => {
        return resp.json()
    }).then(function (data) {
        if (data.error) {
            console.log("error getting ipfs object from the ipfs API")
            console.log(data.error)
        } else {
            var arrayBufferView = new Uint8Array(data.pic.data);
            //only works for png at the moment, since it is hard coded...
            var blob = new Blob([arrayBufferView], { type: "image/png" })
            var url = window.URL.createObjectURL(blob)
            document.getElementById("currimg").src = url
        }
    }).catch(function (error) {
        console.log('fetch failed', error);
    });
}

function sendnewpic() {
    console.log("change pic action")
    var file = document.getElementById('nextpic');
    var ethAmount = Number.parseFloat(document.getElementById('etherAmount').value);
    var ethDest = document.getElementById('etherDest').value;

    pollContract().then((data) => {
        document.getElementById("countdown").innerText = 0;
        if (ethAmount <= data.currLargest) {
            alert("More than " + data.currLargest + " eth needs to be sent to change the picture")
        } else {
            if (file.files.length) {
                var reader = new FileReader();
                reader.readAsArrayBuffer(file.files[0])
                reader.onload = function (e) {
                    var sendform = new FormData(picform);
                    sendform.append("buffer", e.target.result)
                    fetch("/changePicture", {
                        body: sendform,
                        method: "post",
                    }).then((resp) => {
                        return resp.json()
                    }).then(json => {
                        bitscreen.changeBid(
                            hashFuncs.ipfsHashDecompose(json.newhash),
                            18,
                            32,
                            ethDest,
                            { from: web3js.eth.defaultAccount, value: web3js.toWei(ethAmount, "ether"), gas: 1000000 },
                            function (err, result) {
                                if (err) {
                                    console.log("error doing tx")
                                    console.log(err)
                                } else {
                                    console.log(result)
                                }
                            });
                    }).catch(err => {
                        console.log(err)
                    })
                };
            }
        }
    })
    return false
}