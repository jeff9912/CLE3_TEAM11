window.addEventListener('load', init);

// Globals
let nsData = {};
let form;

/**
 * Initialize after the DOM is ready
 */

//mobile
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('Service Worker registered', reg))
            .catch(err => console.log('Service Worker registration failed', err));
    });
}

function init() {


    const apiUrl = 'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/stations?limit=10';

    form = document.querySelector('form');
    form.addEventListener('submit', formSubmitHandler);

    ajaxRequest(apiUrl, handleStationData);
    dateTimeHandler();

    // dit zorgt ervoor dat de pijlen werken van de station switch
    form.addEventListener('click', switchStations)

}

/**
 * Fetch data from NS API
 */
function ajaxRequest(url, successHandler) {
    fetch(url, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache',
            'Ocp-Apim-Subscription-Key': 'f7a4cfc82a4f436f9e325370015e0890'
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
    // console.log('Stations geladen:', nsData);

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

    // console.log('Datalist gevuld met stations:', stationNames.length);
}

function dateTimeHandler() {
    const dateFormInput = document.getElementById('datum');
    const timeFormInput = document.getElementById('tijd');

    const now = new Date();
    const today = now.toISOString().split('T')[0]; //Today in Year - month - day format
    const currentTime = now.toTimeString().split(':').slice(0, 2).join(':'); //Current time in Hours:Minutes format

    dateFormInput.value = today;
    timeFormInput.value = currentTime;


}

/**
 * Handler for form
 */
function formSubmitHandler(e) {
    const departure = document.getElementById("startpunt").value;
    const arrival = document.getElementById("eindpunt").value;
    const date = document.getElementById("datum").value;
    const time = document.getElementById("tijd").value;

    //validation
    const dateFormInput = document.getElementById('datum');
    const timeFormInput = document.getElementById('tijd');
    const startPuntInput = document.getElementById('startpunt');
    const eindPuntInput = document.getElementById('eindpunt')

    //tijd en datum nu ophalen
    const now = new Date();
    const today = now.toISOString().split('T')[0]; //Today in Year - month - day format
    const currentTime = now.toTimeString().split(':').slice(0, 2).join(':'); //Current time in Hours:Minutes format

    //check of datum in verleden is
    if (dateFormInput.value < today) {
        //als datum in het verleden, word datum en tijd vandaag
        dateFormInput.value = today
        timeFormInput.value = now
    }
    //check of tijd in het verleden is
    else if (timeFormInput.value < currentTime) {
        timeFormInput.value = now
    }
    if (departure === arrival) {
        e.preventDefault()
    }
    if (startPuntInput.value === '' || eindPuntInput.value === '') {
        return false;
    }
    if (startPuntInput.value !== '' || eindPuntInput.value !== '' || departure !== arrival) {
        window.location.href = "routeOverview.html";
    }

    //datum + tijd samen voegen
    const dateTimeString = `${date}T${time}:00`;
    const dateTime = new Date(dateTimeString);

    //alles meesturen in localstorage
    localStorage.setItem("departure", departure);
    localStorage.setItem("arrival", arrival);
    localStorage.setItem("datetime", dateTime.toISOString());

    console.log('Reis zoeken van:', departure, 'naar:', arrival, 'op:', date, time)

    // dit zorgt ervoor dat departure en arrival niet hetzelfde kunnen zijn,
    // wanneer dit wel zo is wordt de gebruiker niet doorverwezen

}

/**
 * error handler
 */
function ajaxErrorHandler(error) {
    const message = document.createElement('div');
    message.classList.add('error');
    message.innerHTML = 'Er is iets fout gegaan bij het ophalen van gegevens.';
    form.before(message);

    console.error(error);
}

//deze functie zorgt ervoor dat de stations kunnen wisselen als je op het icoontje klikt
function switchStations(event) {
    let departure = document.getElementById("startpunt");
    let arrival = document.getElementById("eindpunt");

    if (event.target.id === 'pijltjes_vertrek_eind') {
        let temp = departure.value;
        departure.value = arrival.value;
        arrival.value = temp;
    }
}