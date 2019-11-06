var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

//Models
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');
// Default options
app.use(fileUpload());

// PUT para subir archivo, en este caso actualizar la imagen tanto de los hospitales, como los medicos y tambien los usuarios
app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos permitidos
    var tiposPermitidos = ['hospital', 'medico', 'usuario'];

    // Validamos que el tipo de coleccion sea de los permitidos
    if(tiposPermitidos.indexOf(tipo) < 0){
        return res.status(400).json({ 
            ok: false, 
            mensaje: 'Error en el tipo de coleccion', 
            errors: { message: 'Los tipos permitidos son ' + tiposPermitidos.join(', ')}
        });
    }

    // Comprobamos que estamos recibiendo un archivo

    if(!req.files){

        return res.status(400).json({ 
            ok: false, 
            mensaje: 'Failed to upload files', 
            errors: { message: 'Debe de seleccionar una imagen'}
        });
        
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var archivoSlice = archivo.name.split('.')
    var extensionArchivo = archivoSlice[archivoSlice.length -1]

    // Solo se aceptan estas extensiones
    var extensionesPermitidas = ['png', 'jpg', 'gif', 'jpeg'];

    // Comprobamos que la extension del archivo se encuentra entre las permitidas
    if(extensionesPermitidas.indexOf(extensionArchivo) < 0){
        return res.status(400).json({ 
            ok: false, 
            mensaje: 'Extension no valida', 
            errors: { message: 'Las extensiones validas son ' + extensionesPermitidas.join(', ')}
        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extensionArchivo}`;
    
    
    var path = `./uploads/${tipo}/${nombreArchivo}`;
    
    // Movemos el archivo al path que creamos anteriormente
    archivo.mv(path, err => {
        // En caso de error nos da error al mover el archivo
        if(err){
            return res.status(400).json({ 
                ok: false, 
                mensaje: 'Error al mover el archivo', 
                errors: err
            });

        }
        //En caso de poderlo mover llamamos a la funcion subirportipo para subirlo
        subirPorTipo(tipo, id, nombreArchivo, res);
        
    })

});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    // Si el tipo de coleccion es usuario
    if( tipo === 'usuario'){
        Usuario.findById(id , (err, usuario) => {
            var pathViejo = './uploads/usuario/' + usuario.img;

            var existe =fs.existsSync(pathViejo);
            // Si el usuario ya tenia una imagen, ((pathViejo)) entonces la borra
            if( fs.existsSync(pathViejo) ) {
                fs.unlinkSync(pathViejo);
            }
            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {
                    return res.status(200).json({
                         ok: true,
                         mensaje: 'Imagen de usuario modificada',
                         usuario: usuarioActualizado,
                         path: nombreArchivo,
                         pathViejo: pathViejo,
                         existe: existe
                     });
            })
        })

    }
    // Si el tipo de coleccion es medico
    if( tipo === 'medico'){
        Medico.findById(id , (err, medico) => {
            var pathViejo = './uploads/medico/' + medico.img;

            var existe =fs.existsSync(pathViejo);
            // Si el medico ya tenia una imagen, ((pathViejo)) entonces la borra
            if( fs.existsSync(pathViejo) ) {
                fs.unlinkSync(pathViejo);
            }
            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {
                    return res.status(200).json({
                         ok: true,
                         mensaje: 'Imagen de medico modificada',
                         medico: medicoActualizado,
                         path: nombreArchivo,
                         pathViejo: pathViejo,
                         existe: existe
                     });
            })
        })

    }
    // Si el tipo de coleccion es hospital
    if( tipo === 'hospital'){

        Hospital.findById(id , (err, hospital) => {
            var pathViejo = './uploads/hospital/' + hospital.img;

            var existe =fs.existsSync(pathViejo);
            // Si el hospital ya tenia una imagen, ((pathViejo)) entonces la borra
            if( fs.existsSync(pathViejo) ) {
                fs.unlinkSync(pathViejo);
            }
            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {
                    return res.status(200).json({
                         ok: true,
                         mensaje: 'Imagen de hospital modificada',
                         hospital: hospitalActualizado,
                         path: nombreArchivo,
                         pathViejo: pathViejo,
                         existe: existe
                     });
            })
        })
        

    }
}

module.exports = app;
