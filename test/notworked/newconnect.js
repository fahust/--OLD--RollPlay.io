const net = require('net');
const Client = require('../lib/client.js');

//Connexion et creation de l'objet CLIENT
const client = net.createConnection({ port: 3001,host: '127.0.0.1' }, () => {
  console.log('connected to server!');
  const commandObject = {
    command: 'register',
    hello: 'world'
  };
  setTimeout(() => {
    jsonO = {id: 2, square:2};
      jsonO = JSON.stringify(jsonO);
      //client.write(Buffer.from(jsonO));
    clientO.send(commandObject);
}, 150);
    });
    
    clientO = new Client(client);

      //onData//A TESTER

      clientO.on('data', (data) => {
        dataParsed = JSON.parse(data.toString());
        if (dataParsed.command == 'register')
            clientO.set('idUser',dataParsed.playerId )
        if (dataParsed.command == 'infoRoom')
          clientO.set('inRoom',dataParsed.inroom )
        console.log(dataParsed);
    });


   

    
setInterval(() => {
  const commandObject = {
    command: 'action',
    hello: 'world'
  };
  clientO.send(commandObject);
}, 100);
     
