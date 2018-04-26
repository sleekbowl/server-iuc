var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');


var app = express();

var Grupo = require('../models/grupo');

// ==========================================
// Obtener grupo por año
// ==========================================
app.get('/:year', (req, res) => {

    var year = req.params.year;

    Grupo.findById(year)
        .populate('usuario', 'nombre email img telefonoPersonal _id')
        .exec((err, grupo) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar grupo',
                    errors: err
                });
            }

            if (!grupo) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La grupo con el id ' + id + ' no existe',
                    errors: { message: 'No existe una grupo con ese año' }
                });
            }

            res.status(200).json({
                ok: true,
                grupo: grupo
            });

        })


});

// ==========================================
// Actualizar grupo {Alumnos en el grupo}
// ==========================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    update = {
        $set: {

        }
    };

    Grupo.findByIdAndUpdate(id, {
        $push: { alumnos: body.id }
    }, (err, grupo) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar grupo',
                errors: err
            });
        }

        if (!grupo) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La grupo con el id ' + id + ' no existe',
                errors: { message: 'No existe una grupo con ese ID' }
            });
        }

        res.status(200).json({
                ok: true,
                grupo: grupo
            });

    });

});


// ==========================================
// Crear una nueva grupo
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var grupo = new Grupo({
        nombre: body.nombre,
        tipo: body.tipo,
        year: body.year,
        img: body.img,
        alumnos: body.alumnos
    });

    grupo.save((err, grupoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear grupo',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            grupo: grupoGuardado
        });


    });

});


// ============================================
//   Borrar una grupo por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Grupo.findByIdAndRemove(id, (err, grupoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar grupo',
                errors: err
            });
        }

        if (!grupoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una grupo con ese id',
                errors: { message: 'No existe una grupo con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            grupo: grupoBorrado
        });

    });

});


module.exports = app;