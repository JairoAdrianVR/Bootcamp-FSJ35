//simulamos un sv de backend en Node con EXPRESS

const express = require('express');
const app = express();

//Creando una ruta
app.get('/',(req,res) => {
    res.send('Holiwis desde nuestro backend en Node.js!');
})

app.listen(3050,() => {
    console.log('El servidor esta funcionando correctamente en el puerto 3050');
})