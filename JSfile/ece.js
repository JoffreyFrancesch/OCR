const fs = require('fs');

var teacher;

exports.writeHeader = function (text, compteur, jsonOutput) {
  if(compteur < 3){
    if(text.match("cours")){
      fs.appendFileSync(jsonOutput, `"lesson" : "${text}",`);
      return true;
    } else if (text.match("lepoivre") || text.match("benmessaoud") || text.match("marshall") || text.match("abroug") || text.match("imen")){
      fs.appendFileSync(jsonOutput, `"teacher" : "${text}",`);
      teacher = text;
      return true;
    } else if (text.match("groupe")){
      fs.appendFileSync(jsonOutput, `"school" : "ECE : ${text}",`);
      return true;
    } else if(text.match("date") || text.match("dato")){
      fs.appendFileSync(jsonOutput, `"date" : "${text}",`);
      return true; 
    }
  } else {
    writeHeaderEnd(text, jsonOutput);
  }
};

writeHeaderEnd = function (text, jsonOutput) {
  console.log(text);
  if (text.match("lepoivre") || text.match("benmessaoud") || text.match("marshall") || text.match("abroug") || text.match("imen")) {
    fs.appendFileSync(jsonOutput, `"teacher" : "${text}"`);
    teacher = text;
  } else if (text.match("groupe")) {
    fs.appendFileSync(jsonOutput, `"school" : "ECE : ${text}"`);
  } else if (text.match("date") || text.match("dato")) {
    fs.appendFileSync(jsonOutput, `"date" : "${text}"`);
  }
};

exports.writeStudent = function (text, jsonOutput) {
  var regex = /^[a-zA-Z]+$/;
  var regexNum = /^[0-9]+$/;
  var testName = text.split(" ");
  if(teacher != text){
    if(testName[1] != null && testName[1].match(regex) && testName[0].match(regexNum) && (testName.length < 5)){
      fs.appendFileSync(jsonOutput, `{"name" : "${text}"},`);
    }
  }
};

exports.writeMetaData = function (id, title) {
  // body...
  //console.log(text)
};
