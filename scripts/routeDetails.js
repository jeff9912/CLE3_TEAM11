window.addEventListener('load', init);

// Globals
let url;
let selectedTrip;

/**
 * Initialize after the DOM is ready
 */
function init() {
    url = 'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/stations?limit=10';

    ajaxRequest(url);

    const trip = loadTripFromStorage();
    displayTripDetails(trip);
}

/**
 * Fetch data from NS API
 */
function ajaxRequest(url, successHandler) {
    fetch(url, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache',
            'Ocp-Apim-Subscription-Key': '51db8c2ac13b4ab59e961160d585b23d'
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
}

function loadTripFromStorage() {
    const tripData = localStorage.getItem("selectedTrip");

    if (tripData && tripData.startsWith("{")) {
        const parsedTrip = JSON.parse(tripData);
        console.log("Geselecteerde trip:", parsedTrip);
        return parsedTrip;
    } else {
        ajaxErrorHandler("Geen geldige reisgegevens gevonden in localStorage.");
        return null;
    }
}


function ajaxErrorHandler(error) {
    console.error(error);

    const message = document.createElement('div');
    message.classList.add('error');
    message.innerHTML = 'Er is iets fout gegaan bij het ophalen van gegevens.';
}