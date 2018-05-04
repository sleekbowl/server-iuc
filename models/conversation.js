var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema defines how chat messages will be stored in MongoDB
const ConversationSchema = new Schema({  
  participants: [{ type: Schema.Types.ObjectId, ref: 'Usuario'}],
});

module.exports = mongoose.model('Conversation', ConversationSchema);  