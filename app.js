// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// Inicializar variables
var app = express();

var server = app.listen(3000);

// Socket Io
var io = require('socket.io').listen(server);


// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});


// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');
var matriculaRoutes = require('./routes/matricula');
var calfMateriaRoutes = require('./routes/calfMateria');
var carreraRoutes = require('./routes/carrera');
var grupoRoutes = require('./routes/grupo');
var chatRoutes = require('./routes/chat');



// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/escuelaDB', (err, res) => {

    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

});

// Server index config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));



// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/matricula', matriculaRoutes);
app.use('/calfMaterias', calfMateriaRoutes);
app.use('/carrera', carreraRoutes);
app.use('/grupo', grupoRoutes);
app.use('/chat', chatRoutes);



app.use('/', appRoutes);

var userId = "";

io.on('connection', (socket) => {

    console.log('Se realizo la coneccion de Sockets exitosamente');


    socket.on('join', function(data) {
        //joining
        socket.join('all');
        userId = data.user;

        socket.broadcast.to('all').emit('joined', { user: data.user, leave: false });
    });


    socket.on('leave', function(data) {
      socket.leave('all');
      socket.broadcast.to('all').emit('leave all', { user: data.user , leave: true });
    });

    socket.on('entrar', function(data) {
        socket.join(data.conversationId);
    });

    socket.on('message', function(data) {
        io.in(data.sala).emit('new message', { user: data.nombre, img: data.img, mensaje: data.mensaje, hora: data.hora });
        // socket.broadcast.to(data.sala).emit('nuevoMensaje', { user: data.nombre, img: data.img, mensaje: data.mensaje, hora: data.hora });
    })

    socket.on('disconnect', function(data) {
        socket.broadcast.to('all').emit('left', { user: userId, leave: false });
        socket.leave('all');
    });
});


// Escuchar peticiones
// app.listen(3000, () => {
//     console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
// });
// var server = http.listen(3000, () => {
//     console.log("Express con htpp, se esta escuchando en puerto:", server.address().port);
// });