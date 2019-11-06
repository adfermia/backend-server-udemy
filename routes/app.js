var express = require('express');

var app = express();

// Rutas
app.get('/', (req, res, next) => {

    res.status(200).json({ ok: true, mensaje: 'Peticion realizada correctamente'});
});

// Id de cliente
// 912787213017-um1htis38j7tog0k3juot839ousr73il.apps.googleusercontent.com


// Id secreto de cliente
// xZOnvqP8q4yMW8vGgpAlz7fS
module.exports = app;
