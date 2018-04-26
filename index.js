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

//file indexing
//var url = 'https://drive.google.com/file/d/0B7mNn544KuPGSkp3dW8zc01mdW8/view';
//const id = googleUrl.parseId(url);
const id = 'output';
const fileToConvert = '/Users/joffrey/Desktop/PST/fiche/EFREI.pdf'; //image a convertir
const jsonOutput = `/Users/joffrey/Desktop/PST/JSON/${id}.json`; //fichier JSON de sortie
var selectedSchool;
var fileName; // fichier a etudier
var teacherName = null; //sauvegarde nom du professeur pour le supprimer de la liste des etudiants

//Do the convertion only if is a PDF
if (fileToConvert.endsWith(".pdf")) {
  converter.convert(fileToConvert).then(resolve => {
    console.log(`Conversion done and save at ${fileName}`);
  })
  fileName = './Images/FDP_1.jpeg';
} else {
  fileName = fileToConvert;
}

if (fileToConvert.toLowerCase().match("efrei")) {
  selectedSchool = efrei;
  console.log("efrei" + selectedSchool);
} else if (fileToConvert.toLowerCase().match("esiea")) {
  selectedSchool = esiea;
  console.log("esiea");
} else if (fileToConvert.toLowerCase().match("esilv")) {
  selectedSchool = esilv;
  console.log("esilv");
} else if (fileToConvert.toLowerCase().match("ece")) {
  selectedSchool = ece;
  console.log("ece");
} else if (fileToConvert.toLowerCase().match("ectei")) {
  selectedSchool = ectei;
  console.log("ectei");
} else if (fileToConvert.toLowerCase().match("hetic")) {
  selectedSchool = hetic;
  console.log("hetic");
} else {
  console.log("L'école n'as pas été trouvé");
}

client
  .documentTextDetection(fileName)
  .then(results => {
    var detect = results[0].fullTextAnnotation
    var detectArray = detect.text.split("\n");
    var compteur = 0;
    //TODO ecrire les meta-donnees ici
    fs.appendFileSync(jsonOutput, '{ "header" : {');
    //boucle pour le header
    for (var i = 0; i < detectArray.length; i++) {
      if (selectedSchool.writeHeader(detectArray[i].toLowerCase(), compteur, teacherName, jsonOutput)) {
        compteur += 1;
      }
    }
    fs.appendFileSync(jsonOutput, '}, "students" : [');
    //boucle pour les etudiants
    for (var i = 0; i < detectArray.length; i++) {
      if (detectArray[i].match(",")) {
        selectedSchool.writeStudent(detectArray[i].toLowerCase(), teacherName, jsonOutput);
      }
    }
    fs.appendFileSync(jsonOutput, `{"name" : null}`); //pour indiquer la fin de la liste des etudiants
    fs.appendFileSync(jsonOutput, ']}');
    console.log(`Conversion done JSON file save at ${jsonOutput}`);
    removeJPEG();
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
