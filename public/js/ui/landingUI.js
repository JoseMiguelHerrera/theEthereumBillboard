
function installMetamaskWarning() {
    document.getElementsByClassName("warningTitle")[0].firstElementChild.innerHTML = "Install MetaMask"
    document.getElementsByClassName("warning")[0].innerHTML = "For the Ethereum Billboard to work properly, you need to have MetaMask installed. If you choose to continue without MetaMask, you will only be able to see the billboard, but not participate"

    var negativemsg = document.getElementById("negativemsg")
    negativemsg.innerHTML = "Install MetaMask";
    var negativebutton = document.getElementById("negativebutton")
    negativebutton.setAttribute("onclick", "getMetamask()")
    var negativeicon = document.getElementById("negativeicon")
    negativeicon.setAttribute("class", "fas fa-arrow-circle-down")

    var positivemsg = document.getElementById("positivemsg");
    positivemsg.innerHTML = "Enter";
    var positivebutton = document.getElementById("positivebutton");
    positivebutton.setAttribute("onclick", "enter()")
}

function unlockMetamaskWarning() {
    document.getElementsByClassName("warningTitle")[0].firstElementChild.innerHTML = "Unlock MetaMask"
    document.getElementsByClassName("warning")[0].innerHTML = "For the Ethereum Billboard to work properly, you need have an account unlocked. Please create an account if you don't have one and unlock it before using. If you choose to continue without an unlocked account, you will be able to see the billboard, but not participate."

    var negativebutton = document.getElementById("negativebutton")
    negativebutton.parentElement.removeChild(negativebutton)

    var positivemsg = document.getElementById("positivemsg");
    positivemsg.innerHTML = "Enter";
    var positivebutton = document.getElementById("positivebutton");
    positivebutton.setAttribute("onclick", "enter()")

}


function wrongNetworkWarning(){
    document.getElementsByClassName("warningTitle")[0].firstElementChild.innerHTML = "Wrong Network"
    document.getElementsByClassName("warning")[0].innerHTML = "For the Ethereum Billboard to work, you need to connect to the main Ethereum network, not a test net. Please set your Metamask accordingly."

    var negativebutton = document.getElementById("negativebutton")
    negativebutton.parentElement.removeChild(negativebutton)

    var positivemsg = document.getElementById("positivemsg");
    positivemsg.innerHTML = "Enter";
    var positivebutton = document.getElementById("positivebutton");
    positivebutton.setAttribute("onclick", "enter()")
}


function unhidewarning(){
    document.getElementById("warningBox").setAttribute("class","warningBox")
}

function bye() {
    var warningBox = document.getElementsByClassName("warningBox")[0];
    warningBox.parentElement.removeChild(warningBox)
    document.getElementById("bye").removeAttribute("hidden")
}

function enter() {
    window.location.replace("./main.html");
}

function getMetamask() {
    var win = window.open("https://metamask.io/", '_blank');
    win.focus();
    location.reload();
}


function showtip() {
    tippy('#sexualtip')
}

