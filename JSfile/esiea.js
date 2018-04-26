const fs = require('fs');

exports.writeHeader = function(text, compteur, teacherName, jsonOutput) {
  //if (compteur <= 1) {
    if (text.match("lundi") ||  text.match("mardi") ||  text.match("mercredi") || text.match("jeudi") || text.match("vendredi")) {
      fs.appendFileSync(jsonOutput, `"date" : "${text}",`);
    } else if (text.match("lepoivre") || text.match("benmessaoud") || text.match("marshall")) {
      fs.appendFileSync(jsonOutput, `"teacher" : "${text}"`);
      teacherName = text;
      return true;
    } else if (text.match("esiea")) {
      fs.appendFileSync(jsonOutput, `"school" : "${text}",`);
      return true;
    }
  // } else {
  //   writeHeaderEnd(text, teacherName, jsonOutput);
  // }
};

// writeHeaderEnd = function(text, teacherName, jsonOutput) {
//   console.log(text);
//   if (text.match("lundi") ||  text.match("mardi") ||  text.match("mercredi") || text.match("jeudi") || text.match("vendredi")) {
//     fs.appendFileSync(jsonOutput, `"date" : "${text}"`);
//   } else if (text.match("lepoivre") || text.match("benmessaoud") || text.match("marshall")) {
//     fs.appendFileSync(jsonOutput, `"teacher" : "${text}"`);
//     teacherName = text;
//   } else if (text.match("esiea")) {
//     fs.appendFileSync(jsonOutput, `"school" : "${text}"`);
//   }
// };

exports.writeStudent = function(text, teacherName, jsonOutput) {
  // body...
  console.log(text)
};

exports.writeMetaData = function(id, title) {
  // body...
  console.log(text)
};
