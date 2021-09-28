// Imports the Google Cloud client library
//export GOOGLE_APPLICATION_CREDENTIALS="/Users/david/Desktop/Uni/Teamprojekt2021/text-to-speach/teamprojekt-318215-85bb2cc97608.json"
const textToSpeech = require('@google-cloud/text-to-speech');

// Import other required libraries
const fs = require('fs');
const util = require('util');
// Creates a client
const client = new textToSpeech.TextToSpeechClient();
async function quickStart() {
  // The text to synthesize
  const text = 'Corona has shifted priorities in our day-to-day lives. Much more time is now spent at home, be it for leisure or work reasons, new problems, as well as pre-existing problems became apparent. These issues need to be dealt with. Bad air at home causes mold,  headaches, and poor sleep. Suddenly, you have to take care of your working conditions yourself. So far, these issues have not been addressed properly. Changing that is difficult, as this requires a lot of expertise and effort. We want to solve these problems by measuring the quality of your air with a compact and user-friendly device. Temperature, CO2, and much more ... It is our goal to allow you to measure all relevant aspects of the air at your home and help you to improve your living conditions. We want to make our product both easy to use and customizable at the same time. Be it to know how to improve your focus at work, ease your sleep at night, prevent mold in your room or just in your fridge. By just checking your smartphone, you will know what you have to do. There\'s no need to worry about your attention either, you will be notified, whether on a schedule or under conditions that you choose, it is your decision. Not only is our product user-friendly, but also accessible. You can easily connect to your smart home via your smartphone and the internet. This makes it easy to monitor your home from wherever you are. And so you will improve your health and have the best home environment you can achieve. We are Team 17. We are five students from the University of Tübingen. Luca, Sean, Leandro, David and Leon. We are Quinternity.';


  // Construct the request
  const request = {
    input: {text: text},
    // Select the language and SSML voice gender (optional)
    voice: {languageCode: 'en-US', name: 'en-US-Wavenet-D', ssmlGender: 'NEUTRAL'},
    // select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);
  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  await writeFile('output.mp3', response.audioContent, 'binary');
  console.log('Audio content written to file: output.mp3');
}
quickStart();