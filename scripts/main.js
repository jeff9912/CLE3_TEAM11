window.addEventListener('load', init);

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
}


/**
 * Handler for retrieved station data
 */
function handleStationData(data) {
    nsData = data.payload; // Payload containing stations
    console.log('Stations geladen:', nsData);

    vulAlleStationsInDatalist(data)

    // starts autocomplete function
    setupAutocomplete();
}

/**
 * Setup for autocomplete
 */
function setupAutocomplete() {
    const stationNames = nsData.map(station => station.namen.lang);

    const inputs = [document.getElementById('startpoint'), document.getElementById('endpoint')];
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const value = input.value.toLowerCase();
            const suggestions = stationNames.filter(name =>
                name.toLowerCase().startsWith(value)
            );

            // Show suggestion in a dropdown
            console.log(`Suggesties voor "${value}":`, suggestions.slice(0, 5));
        });
    });
}

/**
 * Handler for form
 */
function formSubmitHandler(e) {
    //Prevent sending to a server
    e.preventDefault();

    const from = document.getElementById('startpoint').value;
    const to = document.getElementById('endpoint').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    console.log('Reis zoeken van:', from, 'naar:', to, 'op:', date, time);

    loadTrip(from, to, date, time); // Later implementeren
}

/**
 * Load trips
 */
function loadTrip(from, to, date, time) {
    // Bouw je NS reisadvies request hier
    // Bijvoorbeeld: `https://api.ns.nl/reisinformatie-api/api/v2/trips?fromStation=${from}&toStation=${to}&dateTime=${date}T${time}`
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



function vulAlleStationsInDatalist(data) {
    let datalistVanStations = [document.getElementById('startpoint'), document.getElementById('endpoint')];

    for (station in data.payload) {
        let stations = document.createElement('option');
        stations.value = data.payload[station].namen.lang
        stations.innerText = data.payload[station].namen.lang
        datalistVanStations.appendChild(stations)
    }
}

