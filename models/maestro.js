var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var maestroSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    titulo: { type: String, required: [true, 'El nombre es necesario'] },
});


module.exports = mongoose.model('Maestro', maestroSchema);