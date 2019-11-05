var express = require('express');

var app = express();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;


var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email}, (err, usuarioDB) => {
        if( err ){
            return res.status(500).json({ 
                ok: false, 
                mensaje: 'Error al buscar usuario', 
                errors: err
            });
        }
        if( !usuarioDB ) {
            return res.status(400).json({ 
                ok: false, 
                mensaje: 'No existe el usuario - email', 
                errors: err
            });
        }

        if( !bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({ 
                ok: false, 
                mensaje: 'No existe el usuario - password', 
                errors: err
            });
        }
        // Crear un token!
        usuarioDB.password= ':)';

        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 } ) // 4 horas

        res.status(200).json({ ok: true, 
            mensaje: 'Login true',
            usuario: usuarioDB,
            token: token,
            id: usuarioDB.id,
            body: body});
    });

});


module.exports = app;




// Peticiones al Server
//      1. Peticiones de Login. - idSocio correcto
//                              - passwordSocio correcto
//                              - En caso de Login entrar en la app como Socio
//                              - En caso de ser Admin entrar en la app como admin
//
//                  2. Entrar como socio.       - Al entrar el usuario tendrá las siguientes opciones:
//                                              - Opcion SETTINGS: - Modificar los datos del socio, excepto el id.
//                                              - Opcion Amarres: - Solicitar amarres. Se pasara al socio a rellenar un formulario con los datos necesarios 
//                                                    para solicitar un amarre.
//                                              - Opcion Grua:  - El usuario al igual que en los amarres llenara su solicitud en un formulario
//
//                  3. Entrar como ADMIN:   Al entrar como admin tendremos al inicio un tablón de anuncios. Este tablon solamente contendra anuncios hechos
//                                          por los trabajadores del club, indicando las incidencias o todo lo que pueda ser de interes general para los trabajadores del club.
//                              
//                                          .Bandeja de entrada: Aquí todos los admin recibiran notificaciones o mensajes informando de que peticion es la recibida y quien la hizo,
//                                                  En caso de ser amarres se le podra asignar un amarre de entre todos los disponibles.
//                                                    Mientras que en caso de ser la grua, se le podra asignar una cita.
//
//
//                                           Tanto la cita de la grua como la asignacion de un amarre generaran un certificado que se podra imprimir o guardar en formato pdf.
//      2. Consultas a la base de datos:

//                     1. Ahora 