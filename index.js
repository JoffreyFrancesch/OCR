//export GOOGLE_APPLICATION_CREDENTIALS = PATH_TO_KEY_FILE
// Imports the Google Cloud client library and other library
const vision = require('@google-cloud/vision');
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
const fileToConvert = '/Users/joffrey/Desktop/PST/fiche/EFREI.pdf'; //image a convertir
const jsonOutput = `/Users/joffrey/Desktop/PST/JSON/${id}.json`; //fichier JSON de sortie
var fileName; // fichier a etudier
var teacherName; //sauvegarde nom du professeur pour le supprimer de la liste des etudiants

//Do the convertion only if is a PDF
if (fileToConvert.endsWith(".pdf")) {
  converter.convert(fileToConvert).then(resolve => {
    console.log(`Conversion done and save at ${fileName}`);
  })
  fileName = './Images/FDP_1.jpeg';
} else {
  fileName = fileToConvert;
}

//pour la derniere ligne de la parti content
function writeHeaderEnd(text) {
  if (text.match("lundi") || text.match("mardi") || text.match("mercredi") || text.match("jeudi") || text.match("vendredi") || text.match("samedi")) {
    fs.appendFileSync(jsonOutput, `"date" : "${text}"`);
  } else if (text.match("lepoivre") || text.match("benmessaoud") || text.match("marshall")) {
    fs.appendFileSync(jsonOutput, `"teacher" : "${text}"`);
    teacherName = text;
  } else if (text.match("td")) {
    fs.appendFileSync(jsonOutput, `"lesson" : "${text}"`);
  } else if (text.match("efrei") || text.match("esiea") || text.match("esilv")) {
    fs.appendFileSync(jsonOutput, `"school" : "${text}"`);
  }
}
//pour les premiere lignes de la parti content
function writeHeader(text, compteur) {
  if (compteur < 3) {
    if (text.match("lundi") || text.match("mardi") || text.match("mercredi") || text.match("jeudi") || text.match("vendredi") || text.match("samedi")) {
      fs.appendFileSync(jsonOutput, `"date" : "${text}",`);
      return true;
    } else if (text.match("lepoivre") || text.match("benmessaoud") || text.match("marshall")) {
      fs.appendFileSync(jsonOutput, `"teacher" : "${text}",`);
      teacherName = text;
      return true;
    } else if (text.match("td")) {
      fs.appendFileSync(jsonOutput, `"lesson" : "${text}",`);
      return true;
    } else if (text.match("efrei") || text.match("esiea") || text.match("esilv")) {
      fs.appendFileSync(jsonOutput, `"school" : "${text}",`);
      return true;
    }
  } else {
    writeHeaderEnd(text);
  }
}

//pour la liste des etudiants
function writeStudents(text, array, i) {
  if (text == teacherName) {
    return;
  } else {
    fs.appendFileSync(jsonOutput, `{"name" : "${text}"},`);
  }
}

// pour les meta-donnees
function writeMetaData(id, title) {

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
      if (writeHeader(detectArray[i].toLowerCase(), compteur, detectArray, i)) {
        compteur += 1;
      }
    }
    fs.appendFileSync(jsonOutput, '}, "students" : [');
    //boucle pour les etudiants
    for (var i = 0; i < detectArray.length; i++) {
      if (detectArray[i].match(",")) {
        writeStudent(detectArray[i].toLowerCase(), detectArray, i);
      }
    }
    fs.appendFileSync(jsonOutput, `{"name" : null}`); //pour indiquer la fin de la liste des etudiants
    fs.appendFileSync(jsonOutput, ']}');
    console.log(`Conversion done JSON file save at ${jsonOutput}`)
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
