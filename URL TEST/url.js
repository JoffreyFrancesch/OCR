const url = require('google-url-helper');
const jsonfile = require('jsonfile');
var adr = 'https://drive.google.com/file/d/0B7mNn544KuPGSkp3dW8zc01mdW8/view';

const id_file = "id.json"

var ID = function(id){
  this.id = id;
}

var getID = url.parseId(adr);
var save = new ID(getID);

console.log("Id : " + save.id);
jsonfile.writeFileSync(id_file,save);
