const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');

const client = new textToSpeech.TextToSpeechClient({
    keyFilename: './webservice/includes/credentials.json',
});

async function speak(text = "Testbericht vanuit tts.js!") {
    const request = {
        input: { text },
        voice: { languageCode: 'nl-NL', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await client.synthesizeSpeech(request);
    const writeFile = util.promisify(fs.writeFile);
    await writeFile('output.mp3', response.audioContent, 'binary');
    console.log('✅ output.mp3 opgeslagen!');
}

speak();
