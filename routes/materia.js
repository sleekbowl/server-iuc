var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Materia = require('../models/materia');

// ==========================================
// Obtener todos las materias
// ==========================================
app.get('/', (req, res, next) => {  
    Materia.find({})
    	.exec(
            (err, materias) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando materias',
                        errors: err
                    });
                }

                Carrera.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        materias: materias,
                        total: conteo
                    });
                })

            });

});


// ==========================================
// Obtener materia por ID
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Materia.findById( id )
        .exec((err, materia) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar materia',
                    errors: err
                });
            }

            if (!materia) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La materia buscada con ' + id + ' no existe',
                    errors: { message: 'No existe una materia con ese parametro de busqueda' }
                });
            }

            res.status(200).json({
                ok: true,
                materia: materia
            });

        })


});

// ==========================================
// Actualizar carrera
// ==========================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Carrera.findById(id, (err, materia) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar materia',
                errors: err
            });
        }

        if (!materia) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La materia con el id ' + id + ' no existe',
                errors: { message: 'No existe una materia con ese ID' }
            });
        }

        materia.grupo = body.grupo;
		materia.materia = body.materia;
		materia.calificaciones = body.calificaciones;
		materia.year = body.year;
		materia.catedratico = body.catedratico;
		materia.promedio = body.promedio;
		materia.complementario = body.complementario;
		materia.recursamiento = body.recursamiento;


        materia.save((err, materiaGuardada) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar materia',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                materia: materiaGuardada
            });

        });

    });

});


// ==========================================
// Crear una nueva carrera
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var materia = new Materia({

        grupo: body.grupo,
		materia: body.materia,
		calificaciones: body.calificaciones,
		year: body.year,
		catedratico: body.catedratico,
		promedio: body.promedio,
		complementario: body.complementario,
		recursamiento: body.recursamiento
    });

    materia.save((err, materiaGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear materia',
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

    Materia.findByIdAndRemove(id, (err, materiaBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar materia',
                errors: err
            });
        }

        if (!materiaBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una materia con ese id',
                errors: { message: 'No existe una materia con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            materia: materiaBorrada
        });

    });

});


module.exports = app;