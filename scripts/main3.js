// tijdelijke javascript voor routeOverview om merge conflicts te voorkomen
// duplucate error komt omdat er meerdere bestanden met dezelde code zijn

window.addEventListener('load', init);

//Globals
const apiUrl = 'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/stations?limit=10';
let nsData = {};
let route;

// // Store data for later use
// monsterData[getMonsters.id] = {
//     id: getMonsters.id,
//     name: getMonsters.name,
//     description: getMonsters.description
// };

/**
 * Initialize after the DOM is ready
 */
function init() {

    // Start the applicatie met AI Data inladen
    ajaxRequest(apiUrl, formSubmitHandler);


    fetch("data.php")
        .then(response => {
            console.log()
        })
}

function ajaxRequest(url, successHandler) {
    fetch(url, {
        method: 'GET',
        // Request headers
        headers: {
            'Cache-Control': 'no-cache',
            'Ocp-Apim-Subscription-Key': '51db8c2ac13b4ab59e961160d585b23d',
        }
    })

        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error (${response.status}): ${response.statusText}`);

            }
            return response.json();
        })
        .then(successHandler)
        .catch(ajaxErrorHandler);


    fetch('https://gateway.apiportal.ns.nl/reisinformatie-api/api/v3/trips?originName=aaaa&destinationName=bbbbbbb&originWalk=false&originBike=false&originCar=false&destinationWalk=false&destinationBike=false&destinationCar=false&shorterChange=false&travelAssistance=false&searchForAccessibleTrip=false&localTrainsOnly=false&excludeHighSpeedTrains=false&excludeTrainsWithReservationRequired=false&discount=NO_DISCOUNT&travelClass=2&passing=false&travelRequestType=DEFAULT', {
        method: 'GET',
        // Request headers
        headers: {
            'Cache-Control': 'no-cache',
            'Ocp-Apim-Subscription-Key': 'f7a4cfc82a4f436f9e325370015e0890',
        }
    })
        .then(response => {
            console.log(response.status);
            console.log(response.text());
        })
        .catch(err => console.error(err));
}


function formSubmitHandler(data) {

    //console.log(data)
    // //Prevent sending to a server
    // e.preventDefault();
    // console.log(e);

    console.log(data.payload)
}

function successHandler() {
}

function ajaxErrorHandler() {

}