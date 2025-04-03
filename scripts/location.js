// pseudocode
// 1. haal locatie op van jou
//     1.1 realtime update?
// 2. haal locatie op van station eindbestemming
//     2.2 haal locaties op van de laatste 3 eindbestemmingen
// 3. als locaties in de buurt komen maak een melding

window.addEventListener("load", init)
let voorbeeldLang = 51.91808260037158;
let voorbeeldLong = 4.480989201855333;

// metro beurs ^^


function init() {

    getLocation()

    // window.sharedMessage       //2 javascript bestanden laten communiceren
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
    let myCurrentLat = data.coords.latitude
    let myCurrentLong = data.coords.longitude
    haversine(myCurrentLat, myCurrentLong, voorbeeldLang, voorbeeldLong)
}


function errorHandler() {
    console.log('error')
    //error meesturen in html
}

//haversine formula, rekent uit de kortste ruimte russen 2 punten met een longtitude en latitude
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;  // Radius van de aarde
    const rad = Math.PI / 180;  // getal van radiaal van 180 graden

    // getallen graden naar radialen
    lat1 = lat1 * rad;
    lon1 = lon1 * rad;
    lat2 = lat2 * rad;
    lon2 = lon2 * rad;

    // verschil coordinaten
    const dLat = lat2 - lat1;  // Difference in latitude
    const dLon = lon2 - lon1;  // Difference in longitude

    // Haversine formule
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // verschil in meter
    const distance = R * c * 1000;
    console.log(distance)
    distanceCheck(distance)
}

function distanceCheck(distance) {
    if (distance > 50) {
        //audio miles
    }
}