
/**
 * Module dependencies.
 */

var express = require('express')
  , io = require('socket.io')
  , stylus = require('stylus')
  , nib = require('nib');

var app = module.exports = express.createServer();

// Configuration. created with `express --sessions --css stylus`
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  function compile(str, path) {
    return stylus(str)
      .set('filename', path)
      .set('compress', true)
      .use(nib())
      .import('nib');
  }
  
  app.use(stylus.middleware({
      src: __dirname + '/public'
    , compile: compile
  }));
  //app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function(){
  app.use(express.errorHandler());
});


// Routes
app.get('/', function(req, res){
  res.render('index');
}); //for now, index is one and only meta chat

/*
app.get('/chat', function(req, res){
  var topic = 'chirped.it-meta'; //replace with actual topic from url
  res.render('chat', {locals: {
    title: topic
  }});
});
*/

app.listen(14763); //vs 8080..? //14763

/*
//Setup Socket.IO
var io = io.listen(app);
io.sockets.on('connection', function(socket){
  console.log('Client Connected');
  socket.on('message', function(data){
    socket.broadcast.emit('server_message',data);
    socket.emit('server_message',data);
  });
  socket.on('disconnect', function(){
    console.log('Client Disconnected.');
  });
});
*/


//Setup NowJS
var nowjs = require("now");
var everyone = nowjs.initialize(app);

//pulled from the now npm module directory (node_modules/now/examples/multiroomchat_example)
nowjs.on('connect', function(){
  this.now.room = "room 1";
  nowjs.getGroup(this.now.room).addUser(this.user.clientId);
  console.log("Joined: " + this.now.name);
});
nowjs.on('disconnect', function(){
  console.log("Left: " + this.now.name);
});
everyone.now.changeRoom = function(newRoom){
  nowjs.getGroup(this.now.room).removeUser(this.user.clientId);
  nowjs.getGroup(newRoom).addUser(this.user.clientId);
  this.now.room = newRoom;
  this.now.receiveMessage("SERVER", "You're now in " + this.now.room);
};
everyone.now.distributeMessage = function(message){
  nowjs.getGroup(this.now.room).now.receiveMessage(this.now.name, message);
};


console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
