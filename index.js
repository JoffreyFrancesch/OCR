/**
 * @Author: Joffrey Francechini <joffrey>
 * @Date:   01-Dec-2017
 * @Email:  franceschini@et.esiea.fr
 * @Filename: index.js
 * @Last modified by:   joffrey
 * @Last modified time: 11-Jan-2018
 */
// Imports the Google Cloud client library
const Storage = require('@google-cloud/storage');
const vision = require('@google-cloud/vision');
const jsonfile = require('jsonfile');

// Creates a client
const storage = new Storage();
const client = new vision.ImageAnnotatorClient();

const bucketName = 'ocr_project';
const filename = '/Users/joffrey/Desktop/PST/fiche/ESILV.jpeg';
const json = 'out.json';

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

  client
  .textDetection(filename)
  .then(results => {
    const detect = results[0].textAnnotations;

    console.log('Text:');
    detect.forEach(function(text){
      jsonfile.writeFileSync(json,text);
      console.log(text);
    })
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
