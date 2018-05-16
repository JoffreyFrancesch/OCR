const fs = require('fs');

var teacher;

exports.writeHeader = function (text, compteur, jsonOutput) {
  if(compteur < 3){
    if(text.match("cours")){
      fs.appendFileSync(jsonOutput, `"lesson" : "${text}",`);
      return true;
    } else if (text.match("date")) {
      fs.appendFileSync(jsonOutput, `"date" : "${text}",`);
      return true;
    } else if (text.match("lepoivre") || text.match("benmessaoud") || text.match("marshall")) {
      fs.appendFileSync(jsonOutput, `"teacher" : "${text}",`);
      teacher = text;
      return true;
    } else if (text.match("hétic") || text.match("hetic")){
      fs.appendFileSync(jsonOutput, `"school" : "${text}",`);
      return true; 
    }
  } else{
    writeHeaderEnd(text,jsonOutput);
  }
};

writeHeaderEnd = function (text, jsonOutput) {
  if (text.match("cours")) {
    fs.appendFileSync(jsonOutput, `"lesson" : "${text}"`);
  } else if (text.match("date")) {
    fs.appendFileSync(jsonOutput, `"date" : "${text}"`);
  } else if (text.match("lepoivre") || text.match("benmessaoud") || text.match("marshall")) {
    fs.appendFileSync(jsonOutput, `"teacher" : "${text}"`);
    teacher = text;
  } else if (text.match("hétic") ||  text.match("hetic")) {
    fs.appendFileSync(jsonOutput, `"school" : "${text}"`);
  }
};

exports.writeStudent = function (text, jsonOutput) {
  var regex = /^[a-zA-Z]+$/;
  var testName = text.split(/[\s-]+/);
  if(teacher != text.toLowerCase()){
    if(isUpperCase(testName[0])){
      if(testName[0].match(regex)){
        fs.appendFileSync(jsonOutput, `{"name" : "${text}"},`);
      }
    }
  }
};

exports.writeMetaData = function (id, title) {
  // body...
  //console.log(text)
};

function isUpperCase(myString) {
  return (myString == myString.toUpperCase());
}