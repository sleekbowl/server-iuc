var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var materiaSchema = new Schema({
	grupo: {type: Schema.Types.ObjectId, ref: 'Grupo', required: true},
	materia: {type: String, required: [true, 'Materia Requerida'] },
	calificaciones: [{type: Number, required: false}],
	year: {type: Number, required:true },
	catedratico: {type: Schema.Types.ObjectId, ref: 'Matricula', required: true},
	promedio: {type: Boolean, required: false, default: false},
	complementario: [{type: Number, required: false}],
	recursamiento: {type: Boolean, required:false, default: false}
});


module.exports = mongoose.model('Materia', materiaSchema);