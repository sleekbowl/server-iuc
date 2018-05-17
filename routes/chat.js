var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var user = require('../models/usuario');

var Conversation = require('../models/conversation');  
var Message = require('../models/message');
var User = require('../models/usuario');
var Grupo = require('../models/grupo');


// ==========================================
// Obtener las conversaciones del usuario
// ==========================================
app.post('/user', (req, res, next) => {

  var serv = req.body.identificacion;
  Conversation.find({participantsId:{ $in: [serv] }})
  .populate('participantsId','nombre img')
  .exec( (err, conversations, next) => {
      if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Se encontro un error interno',
                        conversations: [],
                        errors: err
                    });
                }
      return res.status(200).json({
                        ok: true,
                        mensaje: 'Conversaciones del usuario',
                        conversations: conversations
                    });

      // Set up empty array to hold conversations + most recent message
      // let conversation1 = conversations;
      // let fullConversations = [];
      // conversations.forEach(function(conversation) {
      //   Message.find({ 'conversationId': conversation._id })
      //     .sort('-createdAt')
      //     .limit(1)
      //     .populate({
      //       path: "author",
      //       select: "nombre img"
      //     })
      //     .exec(function(err, message) {
      //       if (err) {
      //         return res.status(500).json({
      //                   ok: false,
      //                   mensaje: 'Error buscar conversacion',
      //                   errors: err
      //               });
      //       }
      //       fullConversations.push(message);
      //       if(fullConversations.length === conversations.length) {

      //         return res.status(200).json({ conversationGeneral:conversation1 , conversationsMensaje: fullConversations });
      //       }
      //     });
      // });
  });

});

// ==========================================
// Obtener la charla de una conversacion
// ==========================================
app.get('/conversation/:conversationId', (req, res, next) => {  
  Message.find({ conversationId: req.params.conversationId })
    .select('createdAt body author')
    // .sort('-createdAt')
    .populate({
      path: 'author',
      select: 'nombre img'
    })
    .exec(function(err, messages) {
      if (err) {
        return res.status(500).json({
                        ok: false,
                        mensaje: 'Error buscar conversacion',
                        errors: err
                    });
      }

      res.status(200).json({ conversation: messages });
    });
  });

// ==========================================
// Crear una nueva conversacion
// ==========================================
app.post('/conversation/:receptor', (req, res, next) => {  
  if(!req.params.receptor) {
    res.status(422).send({ error: 'Please choose a valid recipient for your message.' });
    return next();
  }

  if(!req.body.mensaje) {
    return res.status(500).json({
                        ok: false,
                        mensaje: 'No se envio ningun mensaje!',
                        errors: err
                    });
    return next();
  }
  var conversation = new Conversation({
    participantsId: [req.body.user, req.params.receptor]
  });

  conversation.save(function(err, newConversation) {
    if (err) {
      return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al crear la conversacion',
                        errors: err
                    });
    }

    const message = new Message({
      conversationId: newConversation._id,
      body: req.body.mensaje,
      author: req.body.user
    });

    message.save(function(err, newMessage) { 
      if (err) {
        return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al enviar el mensaje',
                        errors: err
                    });
      }

      res.status(200).json({ message: 'Conversation started!', conversationId: conversation._id });
      return next();
    });
  });
});

// ==========================================
// Enviar un mensaje a una conversacion
// ==========================================
app.post('/sendMensaje/', (req, res, next) => {
  var mensaje = req.body.mensaje;
  var nombre = req.body.mensaje.nombre;  
  const reply = new Message({
    conversationId: mensaje.conversationId,
    body: mensaje.body,
    author: mensaje.author
  });

  reply.save(function(err, sentReply) {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

    res.status(200).json({ mensaje: sentReply, nombre:nombre });
    return(next);
  });
});
module.exports = app;