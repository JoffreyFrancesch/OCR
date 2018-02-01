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
  savedir:"./Images",
  format: "jpeg",
  size: 600
});


//file indexing
//var url = 'https://drive.google.com/file/d/0B7mNn544KuPGSkp3dW8zc01mdW8/view';
//const id = googleUrl.parseId(url);

const id = 'output';

//const bucketName = 'ocr_project';
const fileToConvert = '/Users/joffrey/Desktop/PST/fiche/EFREI.pdf';
const jsonOutput = `/Users/joffrey/Desktop/PST/JSON/${id}.json`;
var fileName;

//Do the convertion only if is a PDF
if (fileToConvert.endsWith(".pdf")){
  converter.convert(fileToConvert).then(resolve => {
    console.log(`Conversion done and save at ${fileName}`);
  })
   fileName = './Images/FDP_1.jpeg';
} else {
   fileName = fileToConvert;
}

//First Detection with GOOGLE VISION
  client
  .documentTextDetection(fileName)
  .then(results => {
    const detect = results[0].fullTextAnnotation

    console.log(detect.text);
    jsonfile.writeFile(jsonOutput,detect.text)
    // extraire dans un fichier annexe et l'analyser apres ?
    // fs.unlink(fichierAnnexe, (err) =>{
    //   if (err) throw err;
    //   console.log("delete with sucess");
    // })


    // detect.forEach(function(text){
    //   //formatation du Json
    //   if (text.description.startsWith("TD")){
    //    jsonfile.writeFile(jsonOutput,JSON.stringify({lesson : text.description}),{flag : 'a'})
    //   }
    //   if (text.description.startsWith("Lundi") || text.description.startsWith("Mardi") || text.description.startsWith("Mercredi") || text.description.startsWith("Jeudi") || text.description.startsWith("Vendredi")){
    //     jsonfile.writeFile(jsonOutput,JSON.stringify({date : text.description}),{flag : 'a'})
    //   } else {
    //     jsonfile.writeFile(jsonOutput,text.description,{flag : 'a'});
    //   }
    // })
    console.log(`Conversion done JSON file save at ${jsonOutput}`)
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
