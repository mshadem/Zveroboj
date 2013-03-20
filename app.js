var
    gameport        = process.env.PORT || 4004,

    io              = require('socket.io'),
    express         = require('express'),
    UUID            = require('node-uuid'),

    verbose         = false,
    app             = express.createServer();

/* Express server set up. */
app.listen( gameport );

console.log('\t express:: Listening on port ' + gameport );

app.get( '/', function( req, res ){
    //console.log('\t :: Express :: file requested : index.html');
    res.sendfile( __dirname + '/index.html' );
});

app.get( '/*' , function( req, res, next ) {

    var file = req.params[0];
    //console.log('\t :: Express :: file requested : ' + file );
    res.sendfile( __dirname + '/' + file );

}); //app.get *


/* Socket.IO server set up. */

var sio = io.listen(app);
    
sio.configure(function (){
    sio.set('log level', 0);
    sio.set('authorization', function (handshakeData, callback) {
      callback(null, true); // error first callback style
    });
});

gameServer = require('./game_server.js');

sio.sockets.on('connection', function (client) {       
    client.userid = UUID();
    client.emit('onconnected', { id: client.userid } );
    //console.log('\t socket.io:: client ' + client.userid + ' connected');
    gameServer.addClient(client);    
    client.on('message', function(m) {
        gameServer.onMessage(client, m);
    });
    client.on('disconnect', function () {
        //console.log('\t socket.io:: client ' + client.userid + ' disconnected');           
        gameServer.removeClient(client.userid);
    });    
});
