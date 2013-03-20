var gameServer = module.exports = { clients: [], games: []};
var UUID = require('node-uuid');

gameServer.name = '\t GAME SERVER:: ';

gameServer.log = function() {
    console.log.apply(this, arguments);
};

gameServer.onMessage = function(client, message) {
    var messageParts = message.split('.');
    var messageType = messageParts[0];
    if (messageType == 'CG') { //create game
        this.createGame(client, messageParts[1]);
    };
    if (messageType == 'DG') { //delete game
        for (i in this.games) {
            if (this.games[i].playerHost == client) {
                this.removeGame(this.games[i].id);
            };            
        };
    };    
    if (messageType == 'JG') { //join game
        this.joinGame(client, messageParts[1]);
    };  
    if (messageType == 'SR') { //select race
        if (this.games[client.gameId].playerHost == client) {
            otherClient = this.games[client.gameId].playerClient;    
        } else {
            otherClient = this.games[client.gameId].playerHost;  
        };    
        client.race = messageParts[1];
        otherClient.send('s.er.' + messageParts[1]);
        if ((this.games[client.gameId].playerHost.race != null) && (this.games[client.gameId].playerClient.race != null)) {
            client.send('s.r.' + this.games[client.gameId].playerHost.race + '.' + this.games[client.gameId].playerClient.race);
            otherClient.send('s.r.' + this.games[client.gameId].playerHost.race + '.' + this.games[client.gameId].playerClient.race);
        };
    };    
    
    if (messageType == 'AU') { //select race
        if (this.games[client.gameId].playerHost == client) {
            otherClient = this.games[client.gameId].playerClient;    
        } else {
            otherClient = this.games[client.gameId].playerHost;  
        };    
    
        otherClient.send('s.au.' + messageParts[1] + '.' + messageParts[2]);
    };    
    
    if (messageType == 'MU') { //select race
        if (this.games[client.gameId].playerHost == client) {
            otherClient = this.games[client.gameId].playerClient;    
        } else {
            otherClient = this.games[client.gameId].playerHost;  
        };    
    
        otherClient.send('s.mu.' + messageParts[1] + '.' + messageParts[2]);
    }; 

    if (messageType == 'ATU') { //select race
        if (this.games[client.gameId].playerHost == client) {
            otherClient = this.games[client.gameId].playerClient;    
        } else {
            otherClient = this.games[client.gameId].playerHost;  
        };    
    
        otherClient.send('s.atu.' + messageParts[1] + '.' + messageParts[2]);
    };     
}; 

gameServer.createGame = function(client, name) {
    var newGame = {
            id: UUID(),       
            playerHost: client,   
            playerClient: null,
            playerCount: 1       
        };
    this.log(this.name + 'game created by ' + client.userid);    
    this.games[newGame.id] = newGame; 
    client.gameId = newGame.id;   
    client.send('s.h');  

    this.sendGameList();
};

gameServer.joinGame = function(client, id) {
    this.log(this.name + 'game joined ' + client.userid);    
    this.games[id].playerClient = client; 
    this.games[id].playerHost.send('s.pj'); 
    client.gameId = id;    
    client.send('s.j');       
};

gameServer.sendGameList = function () {
    for (i in this.clients) {   
        this.clients[i].send('s.dg');   
    };  
    for (i in this.clients) {   
        for (j in this.games) {       
            if (this.games[j].playerHost != this.clients[i])
            this.clients[i].send('s.ag.' + this.games[j].id);   
        };
    };    
};

gameServer.removeGame = function(gameId) {
    for (i in this.games) {
        if (this.games[i].id == gameId) {
            if (this.games[i].playerHost) {
                this.games[i].playerHost.send('s.e');    
                this.games[i].playerHost.gameId = -1;
            };
            if (this.games[i].playerClient) {
                this.games[i].playerClient.send('s.e');         
                this.games[i].playerClient.gameId = -1;                
            };
        };
    };      
    delete this.games[gameId];   
    this.log(this.name + 'game ' + gameId + ' deleted');    
    this.sendGameList();    
};

gameServer.removeClient = function(userid) {
    for (var i in this.clients) {
        if (this.clients[i].userid == userid) {     
            this.log(this.name + 'client ' + userid + ' deleted');
            this.removeGame(this.clients[i].gameId );                
            this.clients.splice(i, 1);           
        };
    };
};

gameServer.addClient = function(client) {
    this.log(this.name + 'client ' + client.userid + ' added');
    for (i in this.games) {
        client.send('s.ag.' + this.games[i].id); 
    };
    this.clients.push(client);
};