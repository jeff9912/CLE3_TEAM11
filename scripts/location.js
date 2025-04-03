// pseudocode
// 1. haal locatie op van jou
//     1.1 realtime update?
// 2. haal locatie op van station eindbestemming
//     2.2 haal locaties op van de laatste 3 eindbestemmingen
// 3. als locaties in de buurt komen maak een melding

window.addEventListener("load", init)

function init() {

    getLocation()

    console.log(window.sharedMessage);
}

function getLocation() {

    //check of navigator.geolocation werkt op browser
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(successHandler, errorHandler, {enableHighAccuracy: true});
    } else {
        // x.innerHTML = "Geolocation is not supported by this browser.";
        console.log('werkt niet :(')
    }
}

function successHandler(data) {
    console.log(data.coords)
}


function errorHandler() {
    console.log('error')
    //error meesturen in html
}