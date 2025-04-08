window.addEventListener("load", init);

let url;
let infoUrl;
let selectedTrip;

/**
 * Initialize after the DOM is ready
 */
function init() {
    url = 'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/stations';
    ajaxRequest(url, stationCheck);

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
 * Controleert de stations en haalt relevante reisinformatie op.
 */
function stationCheck(data) {
    let departure = localStorage.getItem("departure");
    let arrival = localStorage.getItem("arrival");
    let dateTime = localStorage.getItem("datetime");
    selectedTrip = JSON.parse(localStorage.getItem("selectedTrip"));

    let departureName, arrivalName;
    for (let place of data.payload) {
        if (place.namen.lang === departure) {
            departureName = place;
        } else if (place.namen.lang === arrival) {
            arrivalName = place;
        }
    }

    if (departureName && arrivalName) {
        tripsLoading(departureName, arrivalName, dateTime);
    } else {
        console.error("Station niet gevonden. Controleer lokale opslag.");
    }
}

/**
 * Haalt de reisgegevens op van de NS API.
 */
function tripsLoading(departure, arrival, datetime) {
    let departureCode = departure.UICCode;
    let arrivalCode = arrival.UICCode;
    let formattedTime = `${datetime.slice(0, -5)}Z`;

    infoUrl = `https://gateway.apiportal.ns.nl/reisinformatie-api/api/v3/trips?originUicCode=${departureCode}&destinationUicCode=${arrivalCode}&dateTime=${formattedTime}`;

    ajaxRequest(infoUrl, displayTrip);
}

/**
 * Laat alle reisinformatie zien (één tegelijk).
 */
function displayTrip(data) {
    console.log(data);
    const header = document.querySelector("header");
    const optionsContainer = document.querySelector("#travelOptions");

    header.innerHTML = "";
    optionsContainer.innerHTML = "";

    // Reiskop tonen
    const departure = localStorage.getItem("departure");
    const arrival = localStorage.getItem("arrival");
    const tripHeader = document.createElement("h2");
    tripHeader.innerText = `${departure} ➞ ${arrival}`;
    header.appendChild(tripHeader);

    showDetailedTrip();
}

/**
 * Toont de gekozen route.
 */
function showDetailedTrip() {
    let optionsContainer = document.querySelector("#travelOptions");
    optionsContainer.innerHTML = "";

    let card = createTripCard(selectedTrip);
    optionsContainer.appendChild(card);
}


function createTripCard(trip) {
    const card = document.createElement("div");
    card.classList.add("optie");

    // Tijden ophalen
    const departureTime = formatTime(trip.legs[0].origin.plannedDateTime);
    const arrivalTime = formatTime(trip.legs[trip.legs.length - 1].destination.plannedDateTime);

    // Tijd weergave
    const timeDiv = document.createElement("div");
    timeDiv.classList.add("time");
    timeDiv.innerHTML = `<h3>${departureTime} ➞ ${arrivalTime}</h3>`;

    // Soort trein
    const trainDiv = document.createElement("div");
    trainDiv.classList.add("train_div");
    trainDiv.innerHTML = `<p class="trein">${trip.legs[0].product.displayName}</p>`;

    // Reisinformatie
    const info = document.createElement("div");
    info.classList.add("info");
    info.innerHTML = `
        <div>
            <p class="duratie">${trip.actualDurationInMinutes} minuten</p>
        </div>
        <div>
            <p>${trip.legs.length - 1}</p>
        </div>
    `;

    // Elementen toevoegen
    timeDiv.appendChild(trainDiv);
    card.appendChild(timeDiv);
    card.appendChild(info);

    return card;
}

function formatTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
}

function ajaxErrorHandler(error) {
    console.error(error);

    const message = document.createElement('div');
    message.classList.add('error');
    message.innerHTML = 'Er is iets fout gegaan bij het ophalen van gegevens.';
}