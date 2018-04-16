var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');


var app = express();

var Materia = require('../models/calfMateria');

// ==========================================
// Obtener todas las materias
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Materia.find({})
        .skip(desde)
        .limit(5)
        .populate('alumno', 'usuario matricula')
        .populate('catedratico', 'usuario matricula')
        .exec(
            (err, materias) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando materias',
                        errors: err
                    });
                }

                Materia.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        materias: materias,
                        total: conteo
                    });

                })

            });
});

// ==========================================
// Obtener materia
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Materia.findById(id)
        .populate('alumno', 'usuario matricula')
        .populate('catedratico', 'usuario matricula')
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
                    mensaje: 'La materia con el id ' + id + ' no existe',
                    errors: { message: 'No existe una materia con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                materia: materia
            });

        })


});

// ==========================================
// Actualizar Matricula
// ==========================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Materia.findById(id, (err, materia) => {


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
        materia.calificacion = body.calificacion;
        materia.anio = body.anio;
        materia.catedratico = body.catedratico;
        materia.alumno = body.alumno;
        materia.aprobado = body.aprobado;
        materia.usuario = body.usuario;
        materia.carrera = body.carrera;
        materia.recursamiento = body.recursamiennto;

        materia.save((err, materiaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar materia',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                materia: materiaGuardado
            });

        });

    });

});

// ==========================================
// Crear una nueva materia
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var materia = new Materia({
        grupo: body.grupo,
        materia: body.materia,
        carrera: body.carrera
    });

    materia.save((err, materiaGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear materia',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            materia: materiaGuardado
        });


    });

});


// ============================================
//   Borrar una materia por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Matricula.findByIdAndRemove(id, (err, materiaBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar materia',
                errors: err
            });
        }

        if (!materiaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una materia con ese id',
                errors: { message: 'No existe una materia con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            materia: materiaBorrado
        });

    });

});



module.exports = app;