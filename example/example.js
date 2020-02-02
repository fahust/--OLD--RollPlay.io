var GMServer = require('../index.js').Server;
var ClientManager = require('../index.js').ClientManager;

var commandHandlers = {

  register: function(socket) {
    var playerId = Date.now().toString();
    socket.set('playerId', playerId);

    socket.send('register', {
      playerId: playerId
    });

    /*socket.on('end', () => {
      console.info('client disconnected');
      c.destroy();
    });*/
  }

};

var gameManager = new ClientManager();

gameManager.addCommandListener('register', commandHandlers.register);
var server = new GMServer(function(client) {
  gameManager.addClient(client);

  /*jsonO = {id: 2, square:2};
  jsonO = JSON.stringify(jsonO);
  gameManager.broadcast('data',Buffer.from(jsonO))
  gameManager.on('data', (d) => {
    console.log(JSON.parse(d.toString()).id,c.idClient);
  });*/
});

server.listen(3001, function() {
  console.info('Server is running');
});
