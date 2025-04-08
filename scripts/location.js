// pseudocode
// 1. haal locatie op van jou
//     1.1 realtime update?
// 2. haal locatie op van station eindbestemming
//     2.2 haal locaties op van de laatste 3 eindbestemmingen
// 3. als locaties in de buurt komen maak een melding

window.addEventListener("load", init)


departure = localStorage.getItem('departure')
arrival = localStorage.getItem('arrival')
let messageTTS500Meter = 'binnen 500 meter ben je bij' + arrival;
let messageTTS200Meter = 'binnen 200 meter ben je bij' + arrival;
let messageTTSAankomst = 'je bent nu aangekomen bij' + arrival;

// trigger de flash aan of uit, moeten global omdat meerdere functies gebruiken
let flashInterval
let body


function init() {
    getLocation()


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
    setTimeout(() => {
        let myCurrentLat = data.coords.latitude;
        let myCurrentLong = data.coords.longitude;
        let latitude = window.latitude;
        let longitude = window.longitude;
        haversine(myCurrentLat, myCurrentLong, latitude, longitude);
        //^^ belangrijk, dit rekent uit verschil latitude/longitude
    }, 4000);

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

    distanceCheck(distance)
}

//werkt soms niet idk??
function speak(messageTTS) {
    // msg = is het spraakbericht
    const msg = new SpeechSynthesisUtterance(messageTTS);
    msg.lang = "nl-NL";
    window.speechSynthesis.speak(msg);
}


function flashScreen() {
    body = document.querySelector('body')
    let colors = ['#FF0000', '#006EFF', '#FFFFFF', '#000000']
    let colorIndex = 0;
    flashInterval = setInterval(function () {
        body.style.backgroundColor = colors[colorIndex]
        colorIndex++
        colorIndex = colorIndex % colors.length
    }, 200)
}

function distanceCheck(distance) {
    //afstand aanpassen en meer if's toevoegen
    console.log('afstand is:' + distance)

    if (distance < 500) {
        speak(messageTTS500Meter)
    }

    if (distance < 200) {
        speak(messageTTS200Meter)
    }

    if (distance <= 50) {
        speak(messageTTSAankomst)
        flashScreen()

    }

    if (distance > 50) {
        body.style.backgroundColor = 'white'
        clearInterval(flashInterval)
    }
}