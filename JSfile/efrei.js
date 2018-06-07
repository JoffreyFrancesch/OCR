const fs = require('fs');

var teacher;

exports.writeHeader = function (text, compteur, jsonOutput) {
  if (compteur < 3) {
    if (text.match("lundi") || text.match("mardi") || text.match("mercredi") || text.match("jeudi") || text.match("vendredi") || text.match("samedi")) {
      fs.appendFileSync(jsonOutput, `"date" : "${text}",`);
      return true;
    } else if (text.match("lepoivre") || text.match("benmessaoud") || text.match("marshall")) {
      fs.appendFileSync(jsonOutput, `"teacher" : "${text}",`);
      teacher = text;
      return true;
    } else if (text.match("td")) {
      fs.appendFileSync(jsonOutput, `"lesson" : "${text}",`);
      return true;
    } else if (text.match("efrei")) {
      fs.appendFileSync(jsonOutput, `"school" : "${text}",`);
      return true;
    }
  } else {
    writeHeaderEnd(text, jsonOutput);
  }
};

writeHeaderEnd = function (text, jsonOutput) {
  if (text.match("lundi") || text.match("mardi") || text.match("mercredi") || text.match("jeudi") || text.match("vendredi") || text.match("samedi")) {
    fs.appendFileSync(jsonOutput, `"date" : "${text}"`);
  } else if (text.match("lepoivre") || text.match("benmessaoud") || text.match("marshall")) {
    fs.appendFileSync(jsonOutput, `"teacher" : "${text}"`);
    teacher = text;
  } else if (text.match("td")) {
    fs.appendFileSync(jsonOutput, `"lesson" : "${text}"`);
  } else if (text.match("efrei") || text.match("esiea") || text.match("esilv")) {
    fs.appendFileSync(jsonOutput, `"school" : "${text}"`);
  }
};

exports.writeStudent = function (text, jsonOutput) {
  if(text.match(",")){
    if (text.toLowerCase() == teacher) {
      return true;
    } else {
      fs.appendFileSync(jsonOutput, `{"name" : "${text}"},`);
    }
  }
};

exports.writeMetaData = function (id, title) {

};
