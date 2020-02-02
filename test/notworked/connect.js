const net = require('net');

const client = net.createConnection({ port: 3001 }, () => {

  // 'connect' listener.
  console.log('connected to server!');

  //Event du client pour envoyer des data
  setInterval(() => {
      jsonO = {id: 2, square:2};
      jsonO = JSON.stringify(jsonO);
      client.write(Buffer.from(jsonO));
    }, 1000);

    const readline = require('readline');
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        process.exit();
    } else {
        console.log(`You pressed the "${str}" key`);
        console.log();
        console.log(key);
        console.log();
    }
    });
    console.log('Press any key...');
    });

    //Reception des data du client
    client.on('data', (data) => {
        console.log(data.toString());
    });
  

    //client.end();//stop la connexion

    client.on('end', () => {
    console.log('disconnected from server');
    });