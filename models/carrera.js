var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var carreraSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    revoe: { type: String, required: [true, 'El revoe es necesario'] },
    year: { type: Number, required: [true, 'Es requerido el año'] },
});


module.exports = mongoose.model('Carrera', carreraSchema);