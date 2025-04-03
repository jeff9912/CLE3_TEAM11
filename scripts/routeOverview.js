window.addEventListener("load", init)


let url;
let infoUrl;
let optionsContainer;
let header;

/**
 * Initialize after the DOM is ready
 *
 */
function init() {

    //om de stations op te halen uit de NS API
    url = "https://gateway.apiportal.ns.nl/nsapp-stations/v2"
    ajaxRequest(url, stationCheck)
    
    window.lastStationCoords = "Hello from file1.js!";
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
}

function stationCheck(data) {
    //stations en tijd die ingevuld zijn ophalen uit local storage
    let departure = localStorage.getItem("departure");
    let arrival = localStorage.getItem("arrival");
    let dateTime = localStorage.getItem("datetime");
    //alvast variabele aanmakan
    let departureName;
    let arrivalName;
    for (let place of data.payload) {
        //als het station gelijk is aan de plaats dan in de variabele zetten
        if (place.namen.lang === departure) {
            departureName = place
        } else if (place.namen.lang === arrival) {
            arrivalName = place
        }
    }
    //vertrek, aankomst en tijd mee geven aan de laad functie
    tripsLoading(departureName, arrivalName, dateTime)
}

function tripsLoading(departure, arrival, datetime) {
    //het vertrek en aankomst station + de tijd mee geven aan de ajax request
    let departureCode = departure.UICCode
    let arrivalCode = arrival.UICCode
    let formattedTime = `${datetime.slice(0, -5)}Z`
    infoUrl =
        `https://gateway.apiportal.ns.nl/reisinformatie-api/api/v3/trips?originUicCode=${departureCode}&destinationUicCode=${arrivalCode}&dateTime=${formattedTime}`
    ajaxRequest(infoUrl, html)
}

function html(data) {
    console.log(data)
    //reis weergeven in de header
    let trip = document.createElement("h3")
    let departure = localStorage.getItem("departure");
    let arrival = localStorage.getItem("arrival");
    trip.innerText = `${departure} ➞ ${arrival}`
    //toevoegen aan de header
    header = document.querySelector("header")
    header.append(trip)

    optionsContainer = document.querySelector("#travelOptions")
    for (let trip of data.trips) {
        //voor elke optie een div maken
        let card = document.createElement("div")
        card.classList.add("optie")
        card.addEventListener("click", redirect)

        //tijd div waar de tijdsweergaven in zit
        let timeDiv = document.createElement("div")
        timeDiv.classList.add("time")
        //tijds weergaven toevoegen
        let number = trip.legs.length - 1
        let timeH2 = document.createElement("h2")
        let departure = trip.legs[0].origin.plannedDateTime
        let time1 = new Date(departure)
        let departureTime = time1.toLocaleTimeString('nl-NL', {hour: '2-digit', minute: '2-digit'})
        let arrival = trip.legs[number].destination.plannedDateTime
        let time2 = new Date(arrival)
        let arrivalTime = time2.toLocaleTimeString('nl-NL', {hour: '2-digit', minute: '2-digit'})
        timeH2.innerText = `${departureTime} ➞ ${arrivalTime}`
        //soort trein weergaven
        let trainDiv = document.createElement("div")
        trainDiv.classList.add("train_div")
        let trainImg = document.createElement("img")
        trainImg.src = 'images/trein_icon.png'
        let trainP = document.createElement("p")
        trainP.classList.add("trein")
        trainP.innerText = trip.legs[0].product.displayName

        //info div met de tijd, overstappen en drukte
        let info = document.createElement("div")
        info.classList.add("info")
        //hoelang duurt de reis weergaven
        let durationDiv = document.createElement("div")
        let durationImg = document.createElement("img")
        durationImg.src = 'images/klok_icon.png'
        let durationP = document.createElement("p")
        durationP.classList.add("duratie")
        durationP.innerText = `${trip.actualDurationInMinutes} minuten`
        //hoeveelheid overstappen weergaven
        let transerDiv = document.createElement("div")
        let transferImg = document.createElement("img")
        transferImg.src = 'images/overstap_icon.png'
        let transferP = document.createElement("p")
        transferP.innerText = trip.legs.length - 1
        //drukte weergaven
        let crowdImg = document.createElement("img")
        crowdImg.classList.add("crowd")
        if (trip.crowdForecast === "LOW") {
            crowdImg.src = 'images/rustig_icon1.png'
        } else if (trip.crowdForecast === "MEDIUM") {
            crowdImg.src = 'images/normaal_icon1.png'
        } else if (trip.crowdForecast === "UNKNOWN") {
            crowdImg.src = 'images/onbekend_icon.png'
        } else {
            crowdImg.src = 'images/druk_icon1.png'
        }

        //alles toevoegen
        optionsContainer.append(card)
        card.append(timeDiv)
        card.append(info)
        timeDiv.append(timeH2)
        timeDiv.append(trainDiv)
        trainDiv.append(trainImg)
        trainDiv.append(trainP)
        info.append(durationDiv)
        info.append(transerDiv)
        info.append(crowdImg)
        durationDiv.append(durationImg)
        durationDiv.append(durationP)
        transerDiv.append(transferImg)
        transerDiv.append(transferP)
    }
}

function redirect() {
    window.location.href = "route.html";
}
