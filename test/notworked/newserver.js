var GMServer = require('../index.js').Server;
var ClientManager = require('../index.js').ClientManager;

//RECEPTION EVENT
var commandHandlers = {

  register: function(socket) {
    var playerId = Date.now().toString();
    socket.set('playerId', playerId);
    socket.set('place', 1);
    socket.send('register', {
      playerId: playerId,
      test: 'test'
    });
    
  //console.info(gameManager);
  },

  action: function(socket) { console.log('action');
    var playerId = socket.get('playerId');
    var listClient = gameManager.getClients();
    socket.send('action', {
        playerId: playerId,
        //socketId: socket.clientId,
        //listClient: listClient,
    });
  },

  actionToOther: function(socket) {
    var playerId = socket.get('playerId');
    var listClient = gameManager.getClients();
    socket.send('action', {
        playerId: playerId,
        //socketId: socket.clientId,
        //listClient: listClient,
    });
  },


};

//SEND WITHOUT EVENT
//Check des positions clients et envoi des info a ceux de la même pièce//
/*setInterval(() => {
gameManager.clients.forEach(function(socket) {
var inroom = Array();
    var place = socket.get('place');
    gameManager.clients.forEach(function(otherClient) {
        if (place == otherClient.get('place') && otherClient != socket)
            inroom.push(otherClient.get('place'));
    });
    if (inroom.length > 0){
      socket.send('infoRoom', {
        inroom: {"inroom":inroom},
      });
    }
  });
}, 1000);*/
    

//CLIENT MANAGER
var gameManager = new ClientManager();

gameManager.addCommandListener('register', commandHandlers.register);
gameManager.addCommandListener('action', commandHandlers.action);
gameManager.addCommandListener('actionToOther', commandHandlers.actionToOther);


//CREATE CLIENT
var server = new GMServer(function(client) {
  gameManager.addClient(client);
});

/*server.netServer.on('data', (d) => {console.log('test');
  console.log(JSON.parse(d.toString()),);
});*/

//LAUNCH SERVER
server.listen(3001, function() {
  console.info('Server is running');
});

