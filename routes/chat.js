var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();


"use strict"
const Conversation = require('../models/conversation'),  
      Message = require('../models/message'),
      User = require('../models/usuario');


app.get('/found/:busqueda', (req, res) => {  
  // Only return one message from each conversation to display as snippet
  Conversation.find({ participants: req.params.busqueda })
    .exec(function(err, conversations) {
      if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Se encontro un error interno',
                        conversations: null,
                        errors: err
                    });
                }
      if(conversations = []){
        return res.status(200).json({
                        ok: false,
                        mensaje: 'No se ha iniciado ninguna conversacion con ese id',
                        conversations: null
                    });
      }

      // Set up empty array to hold conversations + most recent message
      let fullConversations = [];
      conversations.forEach(function(conversation) {
        Message.find({ 'conversationId': conversation._id })
          .sort('-createdAt')
          .limit(1)
          .populate({
            path: "author",
            select: "profile.firstName profile.lastName"
          })
          .exec(function(err, message) {
            if (err) {
              return res.status(500).json({
                        ok: false,
                        mensaje: 'Error buscar conversacion',
                        errors: err
                    });
            }
            fullConversations.push(message);
            if(fullConversations.length === conversations.length) {
              return res.status(200).json({ conversations: fullConversations });
            }
          });
      });
  });

});

app.get('/conversation/:conversationId', (req, res, next) => {  
  Message.find({ conversationId: req.params.conversationId })
    .select('createdAt body author')
    .sort('-createdAt')
    .populate({
      path: 'author',
      select: 'profile.firstName profile.lastName'
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

app.post('/new/:recipient', (req, res, next) => {  
  if(!req.params.recipient) {
    res.status(422).send({ error: 'Please choose a valid recipient for your message.' });
    return next();
  }

  if(!req.body.composedMessage) {
    res.status(422).send({ error: 'Please enter a message.' });
    return next();
  }

  const conversation = new Conversation({
    participants: [req.user._id, req.params.recipient]
  });

  conversation.save(function(err, newConversation) {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

    const message = new Message({
      conversationId: newConversation._id,
      body: req.body.composedMessage,
      author: req.user._id
    });

    message.save(function(err, newMessage) {
      if (err) {
        res.send({ error: err });
        return next(err);
      }

      res.status(200).json({ message: 'Conversation started!', conversationId: conversation._id });
      return next();
    });
  });
});

app.post('/:conversationId', (req, res, next) => {  
  const reply = new Message({
    conversationId: req.params.conversationId,
    body: req.body.composedMessage,
    author: req.user._id
  });

  reply.save(function(err, sentReply) {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

    res.status(200).json({ message: 'Reply successfully sent!' });
    return(next);
  });
});
module.exports = app;