window.addEventListener('load', init);

// Globals
let nsData = {};
let form;

/**
 * Initialize after the DOM is ready
 */
function init() {
    const apiUrl = 'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/stations?limit=10';

    form = document.querySelector('form');
    form.addEventListener('submit', formSubmitHandler);

    ajaxRequest(apiUrl, handleStationData);
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

/**
 * Handler for retrieved station data
 */
function handleStationData(data) {
    nsData = data.payload; // Payload containing stations
    console.log('Stations geladen:', nsData);

    // starts autocomplete function
    setupTrainAutocompleteDatalist();
}

/**
 * Setup for autocomplete
 */

function setupTrainAutocompleteDatalist() {
    const datalist = document.getElementById('stations');
    const stationNames = nsData.map(station => station.namen.lang);

    stationNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        datalist.appendChild(option);
    });

    console.log('Datalist gevuld met stations:', stationNames.length);
}

/**
 * Handler for form
 */
function formSubmitHandler(e) {
    //Prevent sending to a server
    e.preventDefault();

    const from = document.getElementById('startpunt').value;
    const to = document.getElementById('eindpunt').value;
    const date = document.getElementById('datum').value;
    const time = document.getElementById('tijd').value;

    console.log('Reis zoeken van:', from, 'naar:', to, 'op:', date, time);

    loadTrip(from, to, date, time); // Add later
}

/**
 * Load trips
 */
function loadTrip(from, to, date, time) {
    // NS Trip request
    // `https://api.ns.nl/reisinformatie-api/api/v2/trips?fromStation=${from}&toStation=${to}&dateTime=${date}T${time}`
    console.log(`Reis ophalen van ${from} naar ${to} op ${date} om ${time}`);
}

/**
 * error handler
 */
function ajaxErrorHandler(error) {
    console.error(error);

    const message = document.createElement('div');
    message.classList.add('error');
    message.innerHTML = 'Er is iets fout gegaan bij het ophalen van gegevens.';
    form.before(message);
}