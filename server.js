
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
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



app.listen(14763); //vs 8080..? //14763

var nowjs = require("now");
console.log('Current nowjs var:');
console.log(nowjs);
nowjs.options.debug = true;

console.log('New nowjs var: ');
console.log(nowjs);

var everyone = nowjs.initialize(app);

everyone.connected(function(){
  console.log("Joined: " + this.now.name);
});

everyone.disconnected(function(){
  console.log("Left: " + this.now.name);
});

everyone.now.distributeMessage = function(message){
  everyone.now.receiveMessage(this.now.name, message);
};

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
