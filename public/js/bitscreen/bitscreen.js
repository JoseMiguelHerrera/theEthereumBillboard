

var web3js;
var UIlargest;

function setupWeb3() {
    return new Promise((resolve, reject) => {
        if (typeof web3 !== 'undefined') {
            console.log("injected web3 detected from something like metamask")
            console.log("running " + web3.version.api)
            // Use Mist/MetaMask's provider
            //var provider = web3.currentProvider
            web3js = new Web3(web3.currentProvider);
            web3js.eth.getAccounts((err, accounts) => {
                if (accounts.length === 0) {
                    reject("no account detected. please unlock metamask");
                    alert("please unlock metamask with an account and refresh")
                } else {
                    web3js.eth.defaultAccount = accounts[0];
                    document.getElementById("buy").removeAttribute("disabled")
                    document.getElementById("cashButton").removeAttribute("disabled")

                    resolve();
                }
            });
        } else {
            console.log("no injected web3 detected, using local. Read only for now");
            console.log("bitscreen only works properly with MetaMask installed, please install before using! Entering read only mode");



            web3js = new Web3(ZeroProvider.ZeroClientProvider({
                static: {
                    eth_syncing: false,
                    web3_clientVersion: 'ZeroClientProvider',
                },
                pollingInterval: 99999999, // not interested in polling for new blocks
                rpcUrl: 'https://mainnet.infura.io/UiFZYgJw80AI7LbKtG7o:8545',
                getAccounts: (cb) => cb(null, [])
            }))


            //web3js = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/UiFZYgJw80AI7LbKtG7o:8545"));
            console.log("running " + web3js.version.api)
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
        bitscreen.calculateCurrDynamicPrice((err, resp) => {
            if (err) {
                reject(err)
            } else {
                dynamicPrice = web3js.fromWei(resp, 'ether');
                resolve({ currLargest: dynamicPrice })
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
    var currTopBidTimeStamp;
    var periodPercentagePriceDecrease;
    var PriceDecreasePeriodLengthSecs;

    //dynamic price
    var dynamicPrice;

    //content rules
    var sexual;
    var violent;
    var political;
    var controversial;
    var illegal;

    var contractAddressBox = document.getElementById("contractAddress")
    contractAddressBox.innerHTML = bitscreenAddress;
    contractAddressBox.parentElement.setAttribute("href", "https://etherscan.io/address/" + bitscreenAddress)

    return new Promise((resolve, reject) => {

        /*//we are not displaying the rules anymore
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
        */
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
                        currTopBidTimeStamp = resp[1];
                        totalRaised = web3js.fromWei(resp[2], 'ether');
                        periodPercentagePriceDecrease = resp[3];
                        PriceDecreasePeriodLengthSecs=resp[4];
                        currHolder = resp[5];
                        heightRatio = resp[6];
                        widthRatio = resp[7];
                        countryCode = resp[8];

                        bitscreen.calculateCurrDynamicPrice((err, resp) => {

                            dynamicPrice = web3js.fromWei(resp, 'ether');

                            updateScreenState(newHash, currLargest, dynamicPrice, totalRaised, currHolder, widthRatio + ":" + heightRatio, countryCode,currTopBidTimeStamp, periodPercentagePriceDecrease,PriceDecreasePeriodLengthSecs);
                            resolve({ currHash: newHash, currLargest: currLargest, totalRaised: totalRaised, currHolder: currHolder, aspectRatio: widthRatio + ":" + heightRatio, countryCode: countryCode, currTopBidTimeStamp: currTopBidTimeStamp, periodPercentagePriceDecrease: periodPercentagePriceDecrease, PriceDecreasePeriodLengthSecs: PriceDecreasePeriodLengthSecs });

                        })




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
    var currTopBidTimeStamp;
    var periodPercentagePriceDecrease;
    var PriceDecreasePeriodLengthSecs;

    return new Promise((resolve, reject) => {
        bitscreen.screenstate((err, resp) => {
            if (err) {
                reject(err)
            } else {
                currLargest = web3js.fromWei(resp[0], 'ether');
                currTopBidTimeStamp = resp[1];
                totalRaised = web3js.fromWei(resp[2], 'ether');
                periodPercentagePriceDecrease = resp[3];
                PriceDecreasePeriodLengthSecs=resp[4];
                currHolder = resp[5];
                heightRatio = resp[6];
                widthRatio = resp[7];
                countryCode = resp[8];

                bitscreen.calculateCurrDynamicPrice((err, resp) => {
                    dynamicPrice = web3js.fromWei(resp, 'ether');
                    updateScreenState(newHash, currLargest, dynamicPrice, totalRaised, currHolder, widthRatio + ":" + heightRatio, countryCode,currTopBidTimeStamp, periodPercentagePriceDecrease,PriceDecreasePeriodLengthSecs);
                    resolve({ currHash: newHash, currLargest: currLargest, totalRaised: totalRaised, currHolder: currHolder, aspectRatio: widthRatio + ":" + heightRatio, countryCode: countryCode });
                })

            }
        })
    })
}


function dynamicToMinPrice(dynamicPrice) {
    var minPrice = Number(dynamicPrice) + 0.001
    minPrice = Math.floor(minPrice * 1000) / 1000
    return minPrice
}

function updateScreenState(newHash, currLargest, dynamicPrice, totalRaised, currHolder, aspectRatio, countryCode,currTopBidTimeStamp, periodPercentagePriceDecrease,PriceDecreasePeriodLengthSecs) {

    //current ipfs hash
    var currIPFSHash = document.getElementById("currHashSolidity")
    currIPFSHash.innerHTML = newHash;
    currIPFSHash.parentElement.setAttribute("href", "https://gateway.ipfs.io/ipfs/" + newHash)

    //current largest amount
    var currLargestElements = document.getElementsByClassName("currLargestAmount");
    for (i = 0; i < currLargestElements.length; i++) {
        currLargestElements[i].innerHTML = currLargest;
    }

    //current dynamic price
    var dynamicPriceElements = document.getElementsByClassName("dynamicPrice");

    var minPrice = dynamicToMinPrice(dynamicPrice)

    for (i = 0; i < dynamicPriceElements.length; i++) {
        dynamicPriceElements[i].innerHTML = minPrice;
    }

    UIlargest = dynamicPrice;
    var ethbox = document.getElementById("etherAmount");
    ethbox.oninvalid = function (e) {
        e.target.setCustomValidity("");
        if (!e.target.validity.valid) {
            e.target.setCustomValidity("Enter an ETH amount to 3 decimal places.");
        }
    };
    ethbox.oninput = function (e) {
        e.target.setCustomValidity("");
        if (ethbox.value <= UIlargest || countDecimals(ethbox.value) > 3) {
            ethbox.setAttribute("class", "red")
        } else {
            ethbox.setAttribute("class", "green")
        }
    };

    //current total
    document.getElementById("totalValue").innerHTML = "Total Lifetime Value of Ad Slot: " + totalRaised + " ETH";

    //totalDividends
    document.getElementById("totalDividends").innerHTML = Math.ceil(totalRaised * 0.30 * 10000) / 10000+ " ETH";


    //address of current holder
    var currHolderAddress = document.getElementById("currScreenHolder");
    currHolderAddress.innerHTML = currHolder;
    currHolderAddress.parentElement.setAttribute("href", "https://etherscan.io/address/" + currHolder)

    //aspect ratio
    document.getElementById("aspectRatio").innerHTML = "Aspect Ratio Of Screen: " + aspectRatio;

    //last bid timestamp
    document.getElementById("lastBidTimeStamp").innerHTML = "Last Ad Change On: "+ new Date(currTopBidTimeStamp*1000);

    //period length
    document.getElementById("periodLength").innerHTML = "Price Decrease Period: "+PriceDecreasePeriodLengthSecs/3600 +" hours";

    //percentage decrease
    document.getElementById("periodDecreasePercent").innerHTML = "Per-period Price Decrease: "+periodPercentagePriceDecrease+"%";

    //jurisdiction no longer need to display
    //document.getElementById("jurisdiction").innerHTML = "Jurisdiction Of Screen: " + countryCode;
    displayHashPic(newHash);
}

function updateRuleState(sexual, violent, political, controversial, illegal) {
    document.getElementById("sexualContent").innerHTML = "Sexual content allowed: " + sexual;
    document.getElementById("violentContent").innerHTML = "Violent content allowed: " + violent;
    document.getElementById("politicalContent").innerHTML = "Political content allowed: " + political;
    document.getElementById("controversialContent").innerHTML = "Controversial content allowed: " + controversial;
    document.getElementById("illegalContent").innerHTML = "Illegal (in the screen's jurisdiction) content allowed: " + illegal;
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
            var currimg = document.getElementById("currimg")
            currimg.src = url;
            finishedLoading(currimg);
        }).catch(function (error) {
            console.log('getting the image from ipfs failed failed', error);
        });
}

function finishedLoading(imgNode) {
    var loadinganim = document.getElementById("loadingContainer")
    if (loadinganim) {
        document.getElementById("billboard").setAttribute("class", "")
        loadinganim.parentElement.removeChild(loadinganim)
        currimg.setAttribute("class", "")
    }
}


function sendnewpic() {
    var file = document.getElementById('nextpic');

    var ethAmount = Number.parseFloat(document.getElementById('etherAmount').value);
    var submitmsg = document.getElementById("submitmsg");
    getLargestBid().then((data) => {
        if (ethAmount <= data.currLargest) {
            show(submitmsg)
            submitmsg.innerHTML = "More than " + data.currLargest + " eth needs to be sent to change the ad.";
        } else {
            if (file.files.length) {
                submitmsg.setAttribute("class", submitmsg.getAttribute("class").replace("hide", ""))
                submitmsg.innerHTML = "MetaMask loading...";
                document.getElementById("submitButton").setAttribute("disabled", "true")
                var reader = new FileReader();
                reader.readAsArrayBuffer(file.files[0])
                reader.onload = function (e) {

                    let picform=document.getElementById("picform")
                    var sendform = new FormData(picform);
                    //var sendform = new FormData();
                    //sendform.append("buffer", e.target.result)
                    
                    fetch("/changePicture", {
                        body: sendform,
                        method: "post",
                    }).then((resp) => {
                        console.log(resp)
                        return resp.json()
                    }).then(json => {
                        if (json.err) {
                            console.log("error adding picture to ipfs")
                            console.log(json.err)
                            document.getElementById("submitButton").removeAttribute("disabled")
                            submitmsg.innerHTML = json.err;
                            hide(document.getElementById("submitButtonContainer"))
                            document.getElementById("filename").innerHTML = "No file chosen"
                        } else {
                            bitscreen.changeBid(
                                hashFuncs.ipfsHashDecompose(json.newhash),
                                18,
                                32,
                                { from: web3js.eth.defaultAccount, value: web3js.toWei(ethAmount, "ether") },
                                function (err, result) {
                                    if (err) {
                                        console.log("error doing tx")
                                        console.log(err)
                                    } else {
                                        console.log(result)
                                        document.getElementById("submitButton").removeAttribute("disabled")
                                        submitmsg.innerHTML = "You have replaced the current ad! It will change when the TX has confirmed"
                                        hide(document.getElementById("submitButtonContainer"))
                                        document.getElementById("filename").innerHTML = "No file chosen"
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

function updateViews(views) {
    var impressionCount = document.getElementById('impressions');
    impressionCount.innerHTML = "Total Views: " + views;
}

function inquireDividendInfo(){
    bitscreen.inquireDividentAmount((err, resp) => {
        if (err) {
            reject(err)
        } else {
            document.getElementById("dividendAmount").innerText=web3js.fromWei(resp, 'ether')+" ETH";
        }
    })
}


function cashDividend(){
    bitscreen.withdrawDividend((err, resp) => {
        if (err) {
            console.log(err)
            reject(err)
        } else {
            console.log(resp)
        }
        document.getElementById("dividendAmount").innerText="";
    })
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

function countDecimals(value) {
    if (!value.toString().split(".")[1]) {
        return 0;
    } else {
        return value.toString().split(".")[1].length || 0;
    }
}