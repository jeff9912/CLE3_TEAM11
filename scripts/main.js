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

    // Start the application with loading the API data
    ajaxRequest(apiUrl, formSubmitHandler);
}

function ajaxRequest(url, successHandler) {
    fetch(url, {
        method: 'GET',
        // Request headers
        headers: {
            'Cache-Control': 'no-cache',
            'Ocp-Apim-Subscription-Key': '51db8c2ac13b4ab59e961160d585b23d',}
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
    console.log(data)
    // //Prevent sending to a server
    // e.preventDefault();
    // console.log(e);
}