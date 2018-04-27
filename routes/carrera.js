var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');


var app = express();

var Carrera = require('../models/carrera');

// ==========================================
// Obtener carrera por nombre o revoe
// ==========================================
app.get('/:tipo', (req, res) => {

    var tipo = req.params.tipo;

    Carrera.findOne({ 'nombre': tipo })
        .exec((err, carrera) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar carrera',
                    errors: err
                });
            }

            if (!carrera) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La carrera buscada con ' + id + ' no existe',
                    errors: { message: 'No existe una carrera con ese parametro de busqueda' }
                });
            }

            res.status(200).json({
                ok: true,
                carrera: carrera
            });

        })


});

// ==========================================
// Actualizar carrera {Alumnos en el carrera}
// ==========================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    update = {
        $set: {

        }
    };

    Carrera.findByIdAndUpdate(id, {
        $push: { alumnos: body.id }
    }, (err, carrera) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar carrera',
                errors: err
            });
        }

        if (!carrera) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La carrera con el id ' + id + ' no existe',
                errors: { message: 'No existe una carrera con ese ID' }
            });
        }

        res.status(200).json({
                ok: true,
                carrera: carrera
            });

    });

});


// ==========================================
// Crear una nueva carrera
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var carrera = new Carrera({
        nombre: body.nombre,
        tipo: body.tipo,
        year: body.year,
        img: body.img,
        alumnos: body.alumnos
    });

    carrera.save((err, carreraGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear carrera',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            carrera: carreraGuardado
        });


    });

});


// ============================================
//   Borrar una carrera por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Carrera.findByIdAndRemove(id, (err, carreraBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar carrera',
                errors: err
            });
        }

        if (!carreraBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una carrera con ese id',
                errors: { message: 'No existe una carrera con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            carrera: carreraBorrado
        });

    });

});


module.exports = app;