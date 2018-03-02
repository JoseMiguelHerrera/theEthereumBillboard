

var web3js;

function checkMetamask() {
    return new Promise((resolve, reject) => {
        if (typeof web3 !== 'undefined') {
            console.log("injected web3 detected from something like metamask")
            console.log("running "+ web3.version.api)
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
            alert("bitscreen only works properly with MetaMask installed, please install before using! Entering read only mode");
            web3js = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/UiFZYgJw80AI7LbKtG7o:8545"));
            console.log("running "+ web3js.version.api)
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

function getLargestBid() {
    return new Promise((resolve, reject) => {
        bitscreen.screenstate((err, resp) => {
            if (err) {
                reject(err)
            } else {
                resolve({ currLargest: web3js.fromWei(resp[0], 'ether') })
            }
        })
    })
}

function initialize() {
    //this function gets EVERYTHING from the smart contract to initialize the page
    //screen state
    var newHash;
    var currLargest;
    var totalRaised;
    var currHolder;
    var heightRatio;
    var widthRatio;
    var countryCode;
    //content rules
    var sexual;
    var violent;
    var political;
    var controversial;
    var illegal;
    return new Promise((resolve, reject) => {

        bitscreen.rules((err, resp) => {
            if (err) {
                console.log("error getting screen rules");
                reject(err)
            } else {
                sexual=resp[0]
                violent=resp[1]
                political=resp[2]
                controversial=resp[3]
                illegal=resp[4]
                updateRuleState(sexual,violent,political,controversial,illegal)
            }
        })

        bitscreen.currPicHash((err, resp) => {
            if (err) {
                reject(err)
            } else {
                newHash = hashFuncs.ipfsHashCompose(resp[0])
                bitscreen.screenstate((err, resp) => {
                    if (err) {
                        reject(err)
                    } else {
                        currLargest = web3js.fromWei(resp[0], 'ether');
                        totalRaised = web3js.fromWei(resp[1], 'ether');
                        currHolder = resp[2];
                        heightRatio = resp[3];
                        widthRatio = resp[4];
                        countryCode = resp[5];
                        updateScreenState(newHash, currLargest, totalRaised, currHolder, widthRatio + ":" + heightRatio, countryCode);
                        resolve({ currHash: newHash, currLargest: currLargest, totalRaised: totalRaised, currHolder: currHolder, aspectRatio: widthRatio + ":" + heightRatio, countryCode: countryCode });
                    }
                })
            }
        })
    })
}

function picChangeEventHandler(rawNewhash) {
    //function to handle the change of pic event. The screenstate should be updated
    var newHash = hashFuncs.ipfsHashCompose(rawNewhash)
    var currLargest;
    var totalRaised;
    var currHolder;
    var heightRatio;
    var widthRatio;
    var countryCode;
    return new Promise((resolve, reject) => {
        bitscreen.screenstate((err, resp) => {
            if (err) {
                reject(err)
            } else {
                currLargest = web3js.fromWei(resp[0], 'ether');
                totalRaised = web3js.fromWei(resp[1], 'ether');
                currHolder = resp[2];
                heightRatio = resp[3];
                widthRatio = resp[4];
                countryCode = resp[5];
                updateScreenState(newHash, currLargest, totalRaised, currHolder, widthRatio + ":" + heightRatio, countryCode);
                resolve({ currHash: newHash, currLargest: currLargest, totalRaised: totalRaised, currHolder: currHolder, aspectRatio: widthRatio + ":" + heightRatio, countryCode: countryCode });
            }
        })
    })
}


function updateScreenState(newHash, currLargest, totalRaised, currHolder, aspectRatio, countryCode) {
    document.getElementById("currHashSolidity").innerHTML = "Current IPFS image hash: " + newHash;
    document.getElementById("currLargestAmount").innerHTML = "Ad slot price: " + currLargest + " ETH";
    document.getElementById("totalValue").innerHTML = "Total lifetime value of ad slot: " + totalRaised + " ETH";
    document.getElementById("currScreenHolder").innerHTML = "Address of current ad owner: " + currHolder;
    document.getElementById("aspectRatio").innerHTML = "Aspect ratio of screen: " + aspectRatio;
    document.getElementById("jurisdiction").innerHTML = "Jurisdiction of screen: " + countryCode;
    displayHashPic(newHash);
}

function updateRuleState(sexual,violent,political,controversial,illegal){
    document.getElementById("sexualContent").innerHTML = "Sexual content allowed: "+sexual;
    document.getElementById("violentContent").innerHTML = "Violent content allowed: "+violent;
    document.getElementById("politicalContent").innerHTML = "Political content allowed: "+political;
    document.getElementById("controversialContent").innerHTML = "Controversial content allowed: "+controversial;
    document.getElementById("illegalContent").innerHTML ="Illegal (in the screen's jurisdiction) content allowed: "+illegal;
    console.log("content rules have been changed")
}


//get raw object array from ipfs hash 
function getIpfsobject(hash) {
    console.log("attempting to get object. This can be a very slow process for new images")
    return new Promise((resolve, reject) => {
        node.files.cat(hash, function (err, data) {
            if (err) {
                console.log("error getting obj")
                reject(err)
            } else {
                console.log("got object!")
                resolve(data);
            }
        })
    })
}

function displayHashPic(currHash) {
    getIpfsobject(currHash)
        .then(data => {
            var arrayBufferView = new Uint8Array(data);
            var blob = new Blob([arrayBufferView], { type: ["image/jpeg", "image/png"] })
            var url = window.URL.createObjectURL(blob)
            document.getElementById("currimg").src = url
        }).catch(function (error) {
            console.log('getting the image from ipfs failed failed', error);
        });
}


function sendnewpic() {
    var file = document.getElementById('nextpic');
    var ethAmount = Number.parseFloat(document.getElementById('etherAmount').value);
    getLargestBid().then((data) => {
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
                        if (json.err) {
                            console.log("error adding picture to ipfs")
                            console.log(json.err)
                            alert(json.err)
                        } else {
                            bitscreen.changeBid(
                                hashFuncs.ipfsHashDecompose(json.newhash),
                                18,
                                32,
                                { from: web3js.eth.defaultAccount, value: web3js.toWei(ethAmount, "ether"), gas: 1000000 },
                                function (err, result) {
                                    if (err) {
                                        console.log("error doing tx")
                                        console.log(err)
                                    } else {
                                        console.log(result)
                                    }
                                });
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }
            }

        }
    })
    return false
}

function toggletech() {
    var techsec = document.getElementById("techinfo");
    if (techsec.getAttribute("style") === null) {
        techsec.setAttribute("style", "display: none;")
    } else {
        techsec.removeAttribute("style")
    }
}

function togglerules() {
    var rulesec = document.getElementById("contentrules");
    if (rulesec.getAttribute("style") === null) {
        rulesec.setAttribute("style", "display: none;")
    } else {
        rulesec.removeAttribute("style")
    }
}


//this function is a work in progress because the IPFS team has not yet finished the
//IPFS pin feature for the JS-IPFS API.
/*
function sendnewpic_ipfs() {
    console.log("change pic action")
    var file = document.getElementById('nextpic');
    var ethAmount = Number.parseFloat(document.getElementById('etherAmount').value);

    pollContract().then((data) => {
        if (ethAmount <= data.currLargest) {
            alert("More than " + data.currLargest + " eth needs to be sent to change the picture")
        } else {
            if (file.files.length) {
                var reader = new FileReader();
                reader.readAsArrayBuffer(file.files[0])
                reader.onload = function (e) {
                    var sendform = new FormData(picform);
                    sendform.append("buffer", e.target.result)

                    node.files.add(buffer.Buffer.from(e.target.result), (err, res) => {
                        if (err) {
                            console.log("error adding to IPFS")
                            console.log(err)
                        } else {
                            fetch("/pin", {
                                body: JSON.stringify(res),
                                method: "post",
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).then((resp) => {
                                return resp.json()
                            }).then(json => {
                                if(!json.err){
                                    bitscreen.changeBid(
                                        hashFuncs.ipfsHashDecompose(json.newhash),
                                        18,
                                        32,
                                        "", //todo, remove this once this feature is changed in the smart cotnract
                                        { from: web3js.eth.defaultAccount, value: web3js.toWei(ethAmount, "ether"), gas: 1000000 },
                                        function (err, result) {
                                            if (err) {
                                                console.log("error doing tx")
                                                console.log(err)
                                            } else {
                                                console.log(result)
                                            }
                                        });
                                }else{
                                    alert("pinning the new hash failed")
                                }
                            }).catch(err => {
                                console.log(err)
                            })
                        }
                    })
                };
            }
        }
    })
    return false
}
*/