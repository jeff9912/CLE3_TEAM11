const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');

// Gebruik hier het juiste pad voor je credentials
const client = new textToSpeech.TextToSpeechClient({
    keyFilename: '../webservice/includes/credentials.json',

});

// Array met de teksten die TTS moeten uitvoeren
const texts = [
    "Den haag centraal, Zo meteen moet u overstappen op de intercity richting Amsterdam Centraal. De intercity vertrekt om 18:03 vanaf perron 5. U heeft 16 minuten om over te stappen.",
    "De intercity richting Amsterdam Centraal vertrekt over 5 minuten vanaf perron 5. De intercity heeft 5 haltes.",
    "Amsterdam Bijlmer ArenA.",
    "Amsterdam Amstel.",
    "Amsterdam Muiderpoort, U bent op uw bestemming aangekomen",
    "Uw volgende overstap, de trein richting Amsterdam is vertraagd met 30 minuten.",
    "Uw tweede overstap, de trein richting Amsterdam Centraal is uitgevallen open de app om een nieuwe route in te plannen.",
];

// Functie die één tekst omzet en wegschrijft als audio-bestand
async function speak(text, index) {
    const request = {
        input: { text },
        voice: { languageCode: 'nl-NL', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await client.synthesizeSpeech(request);
    const writeFile = util.promisify(fs.writeFile);
    const filename = `audio${index + 1}.mp3`;
    await writeFile(filename, response.audioContent, 'binary');
    console.log(`✅ ${filename} opgeslagen!`);
}

// Loop door alle teksten heen en voer de TTS-aanroep uit
async function processAll() {
    for (let i = 0; i < texts.length; i++) {
        await speak(texts[i], i);
    }
}

processAll();
