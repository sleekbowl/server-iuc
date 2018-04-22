var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');


var app = express();

var Matricula = require('../models/matricula');

// ==========================================
// Obtener todas las matriculas
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Matricula.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, matriculas) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando matriculas',
                        errors: err
                    });
                }

                Matricula.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        matriculas: matriculas,
                        total: conteo
                    });

                })

            });
});

// ==========================================
// Obtener matricula
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Matricula.findById(id)
        .populate('usuario', 'nombre email img calle colonia sexo cp fechaNacimiento tipoSangre telefonoPersonal telefonoTutor seguro')
        .exec((err, matricula) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar matricula',
                    errors: err
                });
            }

            if (!matricula) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La matricula con el id ' + id + ' no existe',
                    errors: { message: 'No existe una matricula con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                matricula: matricula
            });

        })


});

// ==========================================
// Actualizar Matricula
// ==========================================
app.put('/:id',(req, res) => {

    var id = req.params.id;
    var body = req.body;

    Matricula.findById(id, (err, matricula) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar matricula',
                errors: err
            });
        }

        if (!matricula) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La matricula con el id ' + id + ' no existe',
                errors: { message: 'No existe una matricula con ese ID' }
            });
        }


        matricula.matricula = body.matricula;
        matricula.tipo = body.tipo;
        matricula.titulo = body.titulo;
        matricula.role = body.role;
        matricula.usuario = body.usuario;
        matricula.vinculada = body.vinculada;

        matricula.save((err, matriculaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar matricula',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                matricula: matriculaGuardado
            });

        });

    });

});


// ==========================================
// Crear una nueva matricula
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var matricula = new Matricula({
        matricula: body.matricula,
        tipo: body.tipo,
        titulo: body.titulo,
        role: body.role,
        usuario: body.usuario
    });

    matricula.save((err, matriculaGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear matricula',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            matricula: matriculaGuardado
        });


    });

});


// ============================================
//   Borrar una matricula por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Matricula.findByIdAndRemove(id, (err, matriculaBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar matricula',
                errors: err
            });
        }

        if (!matriculaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una matricula con ese id',
                errors: { message: 'No existe una matricula con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            matricula: matriculaBorrado
        });

    });

});


module.exports = app;