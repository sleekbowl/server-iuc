var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var alumnoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    carrera: { type: String, required: [true, 'La carrera en necesaria'] },
});


module.exports = mongoose.model('Alumno', alumnoSchema);