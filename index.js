// Imports the Google Cloud client library and other library
//const Storage = require('@google-cloud/storage');
const vision = require('@google-cloud/vision');
const jsonfile = require('jsonfile');
const pdf2pic = require('pdf2pic');


// Creates a client
//const storage = new Storage();
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
//const bucketName = 'ocr_project';
const fileToConvert = '/Users/joffrey/Desktop/PST/fiche/EFREI.pdf';
const jsonDescription = '/Users/joffrey/Desktop/PST/JSON/out_description.json';
const jsonFull = '/Users/joffrey/Desktop/PST/JSON/out_full.json';
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


// Uploads a local file to the bucket
// storage
//   .bucket(bucketName)
//   .upload(fileName)
//   .then(() => {
//     console.log(`${fileName} uploaded to ${bucketName}.`);
//   })
//   .catch(err => {
//     console.error('ERROR:', err);
//   });

//First Detection with GOOGLE VISION
  client
  .textDetection(fileName)
  .then(results => {
    const detect = results[0].textAnnotations
    detect.forEach(function(text){
      jsonfile.writeFileSync(jsonDescription,text.description,{flag : 'a'});
      jsonfile.writeFileSync(jsonFull,text,{flag : 'a'});
    })
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
