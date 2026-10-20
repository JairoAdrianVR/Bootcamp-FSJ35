import fs from 'node:fs'
const FILE = './data/contador.txt'

let contador = 0;

if(!fs.existsSync('./data')){
    fs.mkdirSync('./data')
}

if( fs.existsSync(FILE)){
    contador = parseInt(fs.readFileSync(FILE,'utf-8'),10) || 0
}

contador++; // lo ponemos en 1
fs.writeFileSync(FILE,contador.toString());

console.log(`Visitas: ${contador}`);
