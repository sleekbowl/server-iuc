var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');
var Matricula = require('../models/matricula');
var Grupo = require('../models/grupo');

// ==============================
// Busqueda por colección
// ==============================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'usuario':
            promesa = buscarUsuario(busqueda, regex);
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;

        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;

        case 'matricula':
            promesa = buscarMatricula(busqueda, regex);
            break;

        case 'matriculas':
            promesa = buscarMatriculas(busqueda, regex);
            break;

        case 'grupos':
            promesa = buscarGrupo(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: usuarios, matricula, medicos, hospitales y grupos',
                error: { message: 'Tipo de tabla/coleccion no válido' }
            });

    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    })

});


// ==============================
// Busqueda general
// ==============================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        })


});


function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales)
                }
            });
    });
}

function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos)
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email img matricula')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .populate('matricula', 'tipo titulo')
            .exec((err, usuarios) => {

                if (err) {
                    reject('Erro al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }


            })


    });
}
function buscarUsuario(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({ _id : busqueda })
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Erro al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }


            })


    });
}
function buscarMatriculas(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Matricula.find({ matricula: regex })
            .populate('usuario', 'nombre email img')
            .exec((err, matriculas) => {

                if (err) {
                    reject('Error al cargar matriculas', err);
                } else {
                    resolve(matriculas)
                }
            });
    });
}
function buscarMatricula(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Matricula.find({ matricula: busqueda })
            .populate('usuario', 'nombre email img')
            .exec((err, matricula) => {

                if (err) {
                    reject('Error al cargar matriculas', err);
                } else {
                    resolve(matricula)
                }
            });
    });
}
function buscarGrupo(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Grupo.find({ nombre: regex })
            .populate('carrera', 'nombre')
            .exec((err, grupo) => {

                if (err) {
                    reject('Error al buscar grupo', err);
                } else {
                    resolve(grupo)
                }
            });
    });
}



module.exports = app;