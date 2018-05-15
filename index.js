//export GOOGLE_APPLICATION_CREDENTIALS = PATH_TO_KEY_FILE
// Imports the Google Cloud client library and other library
const vision = require('@google-cloud/vision');
const pdf2pic = require('pdf2pic');
const googleUrl = require('google-url-helper');
const fs = require('fs');

const efrei = require('./JSfile/efrei.js');
const esiea = require("./JSfile/esiea.js");
const esilv = require("./JSfile/esilv.js");
const ece = require("./JSfile/ece.js");
const ectei = require("./JSfile/ectei.js");
const hetic = require("./JSfile/hetic.js");

// Creates a client
const client = new vision.ImageAnnotatorClient({
  keyFilename: '/Users/joffrey/Desktop/OCRPROJECT-2ccc1ef067f8.json'
});
// Create a converter
let converter = new pdf2pic({
  density: 100,
  savename: "FDP",
  savedir: "./Images",
  format: "jpeg",
  size: 600
});

const id = 'output';
const fileToConvert = '/Users/joffrey/Desktop/PST/fiche/ECE.pdf'; //image a convertir
const jsonOutput = `/Users/joffrey/Desktop/PST/JSON/${id}.json`; //fichier JSON de sortie

 // fichier a etudier

function convertToJpeg(fileToConvert){
  var file;
  if (fileToConvert.endsWith(".pdf")) {
    converter.convert(fileToConvert).then(resolve => {
      console.log(`Conversion done and save at ${file}`);
    })
    return file = './Images/FDP_1.jpeg';
  } else {
    return file = fileToConvert;
  }
}



function detectSchool(fileName){
  var school;
  if (fileToConvert.toLowerCase().match("efrei")) {
    school = efrei;
    console.log("efrei");
  } else if (fileToConvert.toLowerCase().match("esiea")) {
    school = esiea;
    console.log("esiea");
  } else if (fileToConvert.toLowerCase().match("esilv")) {
    school = esilv;
    console.log("esilv");
  } else if (fileToConvert.toLowerCase().match("ece")) {
    school = ece;
    console.log("ece");
  } else if (fileToConvert.toLowerCase().match("ectei")) {
    school = ectei;
    console.log("ectei");
  } else if (fileToConvert.toLowerCase().match("hetic")) {
    school = hetic;
    console.log("hetic");
  } else {
    console.log("L'école n'as pas été trouvé");
  }
  return school;
}


var fileName = convertToJpeg(fileToConvert);
var selectedSchool = detectSchool(fileName);

client
  .documentTextDetection(fileName)
  .then(results => {
    var detect = results[0].fullTextAnnotation
    var detectArray = detect.text.split("\n");
    var compteur = 0;
    fs.appendFileSync(jsonOutput, '{ "header" : {');
    for (var i = 0; i < detectArray.length; i++) {
      if (selectedSchool.writeHeader(detectArray[i].toLowerCase(), compteur, jsonOutput)) {
        compteur += 1;
      }
    }
    fs.appendFileSync(jsonOutput, '}, "students" : [');
    for (var i = 0; i < detectArray.length; i++) {
      selectedSchool.writeStudent(detectArray[i], jsonOutput);
    }
    fs.appendFileSync(jsonOutput, `{"name" : null}`); //pour indiquer la fin de la liste des etudiants
    fs.appendFileSync(jsonOutput, ']}');
    console.log(`Conversion done JSON file save at ${jsonOutput}`);
    //removeJPEG();
  })
  .catch(err => {
    console.error('ERROR:', err);
  });



function removeJPEG() {
  try {
    fs.unlinkSync(fileName);
    console.log("file at " + fileName + "delete");
  } catch (err) {
    console.log(err);
  }
}
