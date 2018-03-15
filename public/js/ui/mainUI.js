
function showTechInfo() {
    toggleMain();
    toggleInfo(document.getElementById("techinfo"))
}

function showAboutInfo(){
    toggleMain();
    toggleInfo(document.getElementById("aboutinfo"))
}

function showBuyInfo() {
    toggleMain();
    toggleInfo(document.getElementById("buyinfo"));
    hide(document.getElementById("submitmsg"));
    //document.getElementById("submitButton").removeAttribute("disabled")
}


function resetBuy(){
    
}

function hide(element){
    if (!element.getAttribute("class").includes("hide")) {
        element.setAttribute("class", element.getAttribute("class")+" hide")
    }
}

function show(element){
    if (element.getAttribute("class").includes("hide")) {
        element.setAttribute("class",element.getAttribute("class").replace("hide",""))
    }
}

function toggleMain() {
    var footer = document.getElementsByTagName("footer")[0];
    if (footer.getAttribute("class") !== "hide") {
        footer.setAttribute("class", "hide")
    } else {
        footer.setAttribute("class", "")
    }
    var main = document.getElementsByTagName("main")[0];
    if (main.getAttribute("class") !== "hide") {
        main.setAttribute("class", "hide")
    } else {
        main.setAttribute("class", "")
    }
}

function toggleInfo(infoElement){
    if (!infoElement.getAttribute("class").includes("hide")) {
        infoElement.setAttribute("class", "moreinfocontainer hide")
    } else {
        infoElement.setAttribute("class", "moreinfocontainer")
    }
}

function changepic(item) {
    document.getElementById("filename").innerHTML = item.files[0].name;
    var submitButtonContainer = document.getElementById("submitButtonContainer");
    if (submitButtonContainer.getAttribute("class").includes("hide")) {
        submitButtonContainer.setAttribute("class", "formSlotWrapper")
    }
}
