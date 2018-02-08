//export GOOGLE_APPLICATION_CREDENTIALS=PATH_TO_KEY_FILE
// Imports the Google Cloud client library and other library
const vision = require('@google-cloud/vision');
const jsonfile = require('jsonfile');
const pdf2pic = require('pdf2pic');
const googleUrl = require('google-url-helper');
const fs = require('fs')


// Creates a client
const client = new vision.ImageAnnotatorClient();


// Create a converter
let converter = new pdf2pic({
  density: 100,
  savename: "FDP",
  savedir: "./Images",
  format: "jpeg",
  size: 600
});


//file indexing
//var url = 'https://drive.google.com/file/d/0B7mNn544KuPGSkp3dW8zc01mdW8/view';
//const id = googleUrl.parseId(url);

const id = 'output';

const fileToConvert = '/Users/joffrey/Desktop/PST/fiche/EFREI.pdf';
const jsonOutput = `/Users/joffrey/Desktop/PST/JSON/${id}.json`;
var fileName;

//Do the convertion only if is a PDF
if (fileToConvert.endsWith(".pdf")) {
  converter.convert(fileToConvert).then(resolve => {
    console.log(`Conversion done and save at ${fileName}`);
  })
  fileName = './Images/FDP_1.jpeg';
} else {
  fileName = fileToConvert;
}

function writeInFormatJsonContent(text, compteur,array,i) {
  //TODO all case need to be implements
  if (compteur < 3) {
    if (text.match("lundi") || text.match("mardi") ||  text.match("mercredi") || text.match("jeudi") || text.match("vendredi") || text.match("samedi")) {
      fs.appendFileSync(jsonOutput, `"date" : "${text}",`);
      array.splice(i,1);
      return true;
    } else if (text.match("lepoivre") || text.match("benmessaoud") || text.match("marshall")) {
      fs.appendFileSync(jsonOutput, `"teacher" : "${text}",`);
      array.splice(i,1);
      return true;
    } else if (text.match("td")) {
      fs.appendFileSync(jsonOutput, `"lesson" : "${text}",`);
      array.splice(i,1);
      return true;
    } else if (text.match("efrei") ||  text.match("esiea") || text.match("esilv")) {
      fs.appendFileSync(jsonOutput, `"school" : "${text}",`);
      array.splice(i,1);
      return true;
    }
  } else {
    if (text.match("lundi") || text.match("mardi") ||  text.match("mercredi") || text.match("jeudi") || text.match("vendredi") || text.match("samedi")) {
      fs.appendFileSync(jsonOutput, `"date" : "${text}"`);
      array.splice(i,1);
    } else if (text.match("lepoivre") || text.match("benmessaoud") || text.match("marshall")) {
      fs.appendFileSync(jsonOutput, `"teacher" : "${text}"`);
      array.splice(i,1);
    } else if (text.match("td")) {
      fs.appendFileSync(jsonOutput, `"lesson" : "${text}"`);
      array.splice(i,1);
    } else if (text.match("efrei") ||  text.match("esiea") || text.match("esilv")) {
      fs.appendFileSync(jsonOutput, `"school" : "${text}"`);
      array.splice(i,1);
    }
  }

}

function remove(array, element) {
  const index = array.indexOf(element);
  array.splice(index, 1)
}
//First Detection with GOOGLE VISION
client
  .documentTextDetection(fileName)
  .then(results => {
    var detect = results[0].fullTextAnnotation
    var detectTable = detect.text.split("\n");
    var i = 0;
    var compteur = 0;
    fs.appendFileSync(jsonOutput, "{ \"content\" : {");
    while (i < detectTable.length) {
      if (writeInFormatJsonContent(detectTable[i].toLowerCase(), compteur, detectTable,i)) {
        compteur += 1;
      }
      console.log(detectTable[i]);
      i++;
    }
    console.log(detectTable);
    fs.appendFileSync(jsonOutput, '}}')
    console.log(`Conversion done JSON file save at ${jsonOutput}`)
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
