// Imports the Google Cloud client library and other library
const Storage = require('@google-cloud/storage');
const vision = require('@google-cloud/vision');
const jsonfile = require('jsonfile');
// Creates a client
const storage = new Storage();
const client = new vision.ImageAnnotatorClient();
//file indexing
const bucketName = 'ocr_project';
const filename = '/Users/joffrey/Desktop/PST/fiche/ESILV.jpeg';
const json_description = '/Users/joffrey/Desktop/PST/JSON/out_description.json';
const json_full = '/Users/joffrey/Desktop/PST/JSON/out_full.json';

// Uploads a local file to the bucket
storage
  .bucket(bucketName)
  .upload(filename)
  .then(() => {
    console.log(`${filename} uploaded to ${bucketName}.`);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });

//First Detection with GOOGLE VISION
  client
  .textDetection(filename)
  .then(results => {
    const detect = results[0].textAnnotations;
    console.log('Text:');
    detect.forEach(function(text){
      jsonfile.writeFileSync(json_description,text.description,{flag : 'a'});
      jsonfile.writeFileSync(json_full,text,{flag : 'a'});
    })
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
