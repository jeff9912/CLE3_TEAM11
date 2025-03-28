// tijdelijke javascript voor index om merge conflicts te voorkomen
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


function formSubmitHandler(data) {

    //console.log(data)
    // //Prevent sending to a server
    // e.preventDefault();
    // console.log(e);

    vulAlleStationsInDatalist(data)
}

function successHandler() {
}

function ajaxErrorHandler() {

}

function vulAlleStationsInDatalist(data) {
    let datalistVanStations = document.getElementById('vertrek')

    for (station in data.payload) {
        let stations = document.createElement('option');
        stations.value = data.payload[station].namen.lang + ' ' + [station]

        stations.innerText = data.payload[station].namen.lang
        datalistVanStations.appendChild(stations)
    }

    datalistVanStations = document.getElementById('eindbestemming')
    for (station in data.payload) {
        let stations = document.createElement('option');
        stations.value = data.payload[station].namen.lang + ' ' + [station]
        stations.innerText = data.payload[station].namen.lang
        datalistVanStations.appendChild(stations)
    }
}
