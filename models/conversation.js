var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema defines how chat messages will be stored in MongoDB
var ConversationSchema = new Schema({  
  participantsId: [{ type: Schema.Types.ObjectId, ref: 'Usuario'}],
  private: { type: Boolean, required: true, default: true},
  online:{type: Boolean, required:true, default: false }
});

module.exports = mongoose.model('Conversation', ConversationSchema);