var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var uniqueValidator = require('mongoose-unique-validator');

var rolesValidos = {
    values: ['MAESTRO_ROLE', 'ALUMNO_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

var matriculaSchema = new Schema({
    matricula: { type: String, required: [true, 'La matricula es necesaria'], unique: true },
    tipo: { type: String, required: [true, 'El tipo es necesaria'] },
    titulo: { type: String, required: [true, 'El titulo es necesario'] },
    role: { type: String, required: false, enum: rolesValidos } , 
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    vinculada: { type: Boolean, required: true, default: false}
});

matriculaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Matricula', matriculaSchema);