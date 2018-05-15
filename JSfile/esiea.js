const fs = require('fs');

var teacher;

exports.writeHeader = function(text, compteur, jsonOutput) {
    if (text.match("lundi") ||  text.match("mardi") ||  text.match("mercredi") || text.match("jeudi") || text.match("vendredi")) {
      fs.appendFileSync(jsonOutput, `"date" : "${text}",`);
    } else if (text.match("lepoivre") || text.match("benmessaoud") || text.match("marshall")) {
      fs.appendFileSync(jsonOutput, `"teacher" : "${text}"`);
      teacher = text;
      return true;
    } else if (text.match("esiea")) {
      fs.appendFileSync(jsonOutput, `"school" : "${text}",`);
      return true;
    }
};


exports.writeStudent = function(text, jsonOutput) {
  var regex = /^[a-zA-Z]+$/;
  var testName = text.split(" ");
  if(teacher != text.toLowerCase()){
    if (isUpperCase(testName[0])) {
      if (testName[0].match(regex)){
        fs.appendFileSync(jsonOutput, `{"name" : "${text}"},`);
      }
    }
  }
};

exports.writeMetaData = function(id, title) {
  // body...
};

function isUpperCase(myString){
  return (myString == myString.toUpperCase());
}
