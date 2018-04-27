var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');


var app = express();

var Carrera = require('../models/carrera');

// ==========================================
// Obtener todas las carreras
// ==========================================
app.get('/', (req, res, next) => {

    Carrera.find({})
        .exec(
            (err, carreras) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando carreras',
                        errors: err
                    });
                }

                Carrera.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        carreras: carreras,
                        total: conteo
                    });
                })

            });
});


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
// Actualizar carrera
// ==========================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Carrera.findById(id, (err, carrera) => {


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

        carrera.nombre = body.nombre;
        carrera.revor = body.revoe;
        carrera.year = carrera.year;


        carrera.save((err, carreraGuardada) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar carrera',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                carrera: carreraGuardada
            });

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
        revoe: body.revoe,
        year: body.year
    });

    carrera.save((err, carreraGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear carrera',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            carrera: carreraGuardada
        });


    });

});


// ============================================
//   Borrar una carrera por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Carrera.findByIdAndRemove(id, (err, carreraBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar carrera',
                errors: err
            });
        }

        if (!carreraBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una carrera con ese id',
                errors: { message: 'No existe una carrera con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            carrera: carreraBorrada
        });

    });

});


module.exports = app;