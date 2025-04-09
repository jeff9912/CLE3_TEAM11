window.addEventListener("load", init);

let url;
let infoUrl;
let allTrips = [];
let currentTripIndex = 0;


/**
 * Initialize after the DOM is ready
 */
function init() {
    url = 'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/stations?limit=10';
    ajaxRequest(url, stationCheck);

    // EventListeners voor knoppen
    let nextButton = document.getElementById("nextButton");
    let prevButton = document.getElementById("prevButton");

    nextButton.addEventListener("click", function () {
        if (currentTripIndex < allTrips.length - 1) {
            currentTripIndex++;
        } else {
            currentTripIndex = 0;
        }
        showCurrentTrip();
    });

    prevButton.addEventListener("click", function () {
        if (currentTripIndex > 0) {
            currentTripIndex--;
        } else {
            currentTripIndex = allTrips.length - 1;
        }
        showCurrentTrip();
    });
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

    ajaxRequest(infoUrl, displayTrips);
}

/**
 * Laat alle reisinformatie zien (één tegelijk).
 */
function displayTrips(data) {
    console.log(data);
    localStorage.setItem('latitude', data.trips[0].fareLegs[0].destination.lat)
    localStorage.setItem('longitude', data.trips[0].fareLegs[0].destination.lng)
    console.log(data.trips[0].fareLegs[0].destination)
    const header = document.querySelector("header");
    const optionsContainer = document.querySelector("#travelOptions");
    const navButtons = document.getElementById("navigationButtons");

    header.innerHTML = "";
    optionsContainer.innerHTML = "";

    // Reiskop tonen

    const departure = localStorage.getItem("departure");
    const arrival = localStorage.getItem("arrival");
    const tripHeader = document.createElement("h2");
// Zet de bestemming op een nieuwe regel
    tripHeader.innerHTML = `${departure} <span class="arrow">➞ ${arrival}</span>`;
    header.appendChild(tripHeader);

    allTrips = data.trips;
    currentTripIndex = 0;

    showCurrentTrip();

    if (allTrips.length > 1) {
        navButtons.style.display = "flex";
    } else {
        navButtons.style.display = "none";
    }
}

/**
 * Toont de huidige route.
 */
function showCurrentTrip() {
    let optionsContainer = document.querySelector("#travelOptions");
    optionsContainer.innerHTML = "";

    let transferContainer = document.querySelector("#transfer");
    transferContainer.innerHTML = "";

    let trip = allTrips[currentTripIndex];
    let card = createTripCard(trip);
    optionsContainer.appendChild(card);

    let transferCard = createTransferCard(trip);
    transferContainer.appendChild(transferCard);

    updateTripCounter();
}

function createTransferCard(trip) {
    const transferCard = document.createElement("div");

    const transferStation = trip.legs[1].direction;
    const arrStation = trip.legs[trip.legs.length - 1].destination.name;

    const transfers = document.createElement("div");
    transfers.classList.add("transferLook")
    transfers.innerHTML = `
        <h3>Volgende</h3>
        <p>${transferStation} naar ${arrStation}</p>
    `;

    transferCard.appendChild(transfers);

    return transferCard;
}


function createTripCard(trip) {
    const card = document.createElement("div");
    card.classList.add("optie");
    card.addEventListener("click", redirect);
    card.dataset.id = currentTripIndex;
    console.log(currentTripIndex);

    // Eerste en laatste leg bepalen
    const firstLeg = trip.legs[0];
    const lastLeg = trip.legs[trip.legs.length - 1];

    const departureTime = formatTime(firstLeg.origin.plannedDateTime);
    const arrivalTime = formatTime(lastLeg.destination.plannedDateTime);

    // Perroninformatie ophalen (indien beschikbaar)
    const departurePlatform = firstLeg.origin.plannedTrack ?? "Onbekend";
    const arrivalPlatform = lastLeg.destination.plannedTrack ?? "Onbekend";

    // Tijd weergave
    const timeDiv = document.createElement("div");
    timeDiv.classList.add("time");
    timeDiv.innerHTML = `
        <h2>${departureTime} ➞ ${arrivalTime}</h2>
        <p>Vertrek perron: <b>${departurePlatform}</b> </p>
        <p>Aankomst perron: <b>${arrivalPlatform}</b></p>
    `;

    // Soort trein
    const trainDiv = document.createElement("div");
    trainDiv.classList.add("train_div");
    trainDiv.innerHTML = `<p class="trein">${firstLeg.product.displayName}</p>`;

    // Reisinformatie
    const info = document.createElement("div");
    info.classList.add("info");
    info.innerHTML = `
        <div>
            <p class="duratie"><b>${trip.actualDurationInMinutes}</b> minuten</p>
        </div>
        <div>
            <p><b>${trip.legs.length - 1} </b> overstap(pen)</p>
        </div>
    `;

    // Elementen toevoegen
    timeDiv.appendChild(trainDiv);
    card.appendChild(timeDiv);
    card.appendChild(info);

    return card;
}

/**
 * Update de teller onder de reis (bijvoorbeeld: Route 2 van 4)
 */
function updateTripCounter() {
    let counter = document.getElementById("tripCounter");
    if (!counter) {
        counter = document.createElement("p");
        counter.id = "tripCounter";
        document.getElementById("navigationButtons").appendChild(counter);
    }
    counter.innerText = "Route " + (currentTripIndex + 1) + " van " + allTrips.length;
}

function formatTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString("nl-NL", {hour: "2-digit", minute: "2-digit"});
}


/**
 * Redirect de gebruiker naar de routepagina.
 */
function redirect(e) {
    let clickedCard = e.currentTarget;
    let tripId = clickedCard.dataset.id;

    let selectedTrip = allTrips[tripId];
    localStorage.setItem("selectedTrip", JSON.stringify(selectedTrip));
    window.location.href = "routeDetails.html";
    console.log(selectedTrip)
}

function ajaxErrorHandler(error) {
    console.error(error);

    const message = document.createElement('div');
    message.classList.add('error');
    message.innerHTML = 'Er is iets fout gegaan bij het ophalen van gegevens.';
}



