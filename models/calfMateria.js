var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var calfMateriaSchema = new Schema({
    grupo: { type: String, required: [true, 'Grupo Requerido'] },
    materia: { type: String, required: true },
    calificacion: { type: Object, required: false },
    anio: { type: String, required: false },
    catedratico: { type: Schema.Types.ObjectId, ref: 'Matricula', required: false },
    alumno: { type: Schema.Types.ObjectId, ref: 'Matricula', required: false },
    aprobado: { type: Boolean, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    carrera: { type: String, required: [true, 'La carrera en necesaria'] },
    recursamiento: { type: Boolean, required: false },
});


module.exports = mongoose.model('Materia', calfMateriaSchema);