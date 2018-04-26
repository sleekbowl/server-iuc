var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var grupoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    tipo: { type: String, required: [true, 'El tipo es necesario'] },
    carrera: {type: String, required:true }
    year: { type: Schema.Types.ObjectId, ref: 'Carrera', required: true },
    img: { type: String, required: false },
    alumnos: [[{ type: Schema.Types.ObjectId, ref: 'Matricula', required: false }]],
});


module.exports = mongoose.model('Grupo', grupoSchema);