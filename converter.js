const pdf2pic = require('pdf2pic');
const idFile = require('./JSON/files.json');
const fs = require('fs');


idFile.files.forEach(element => {
    let converter = new pdf2pic({
        density: 100,
        savename: `${element.id}`,
        savedir: "./Images",
        format: "jpeg",
        size: 600
    });

    var fileToConvert = `./fiche/${element.id}.pdf`;
    if(fileToConvert.endsWith("pdf")){
        converter.convert(fileToConvert);
        console.log(element.id + " DONE");
    } else {
        fs.copyFileSync(fileToConvert, `./Images/${element.id}.jpeg`);
        console.log(element.id + " DONE");
    }
});



