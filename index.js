const vision = require('@google-cloud/vision');
const fs = require('fs');
const idFile = require('./JSON/files.json');
const efrei = require('./JSfile/efrei.js');
const esiea = require("./JSfile/esiea.js");
const esilv = require("./JSfile/esilv.js");
const ece = require("./JSfile/ece.js");
const ectei = require("./JSfile/ectei.js");
const hetic = require("./JSfile/hetic.js");
const client = new vision.ImageAnnotatorClient({
  keyFilename: '/Users/joffrey/Desktop/OCRPROJECT-2ccc1ef067f8.json'
});

idFile.files.forEach(element => {
  var file = `./Images/${element.id}_1.jpeg`;
  var selectedSchool = detectSchool(file);
  var jsonOutput = `/Users/joffrey/Desktop/PST/JSON/${element.id}.json`;
  OCR(file, jsonOutput, selectedSchool);
  console.log("OK for " + file);
});

function detectSchool(fileName){
  var school;
  if (fileName.toLowerCase().match("efrei")) {
    school = efrei;
    console.log("efrei");
  } else if (fileName.toLowerCase().match("esiea")) {
    school = esiea;
    console.log("esiea");
  } else if (fileName.toLowerCase().match("esilv")) {
    school = esilv;
    console.log("esilv");
  } else if (fileName.toLowerCase().match("ece")) {
    school = ece;
    console.log("ece");
  } else if (fileName.toLowerCase().match("ectei")) {
    school = ectei;
    console.log("ectei");
  } else if (fileName.toLowerCase().match("hetic")) {
    school = hetic;
    console.log("hetic");
  } else {
    console.log("L'école n'as pas été trouvé");
  }
  return school;
}

function OCR(fileName, jsonOutput, selectedSchool){
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
      removeJPEG(fileName);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

function removeJPEG(fileName) {
  try {
    fs.unlinkSync(fileName);
    console.log("FILE AT " + fileName + " DELETE");
  } catch (err) {
    console.log(err);
  }
}
