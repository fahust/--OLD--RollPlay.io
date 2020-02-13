const express = require('express'); 
const app = express();
const server = app.listen(3001,console.log('Socket.io Hello Wolrd server started!'));
const io = require('socket.io')(server);
const fs = require('fs');
require('jsonminify');
//screen//node test/socketserver.js//ctrl a +d//screen -r
/*
echo "# RollPlay.io" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/fahust/RollPlay.io.git
git push -u origin master

La save fais buguer si ont fais autre choses en même temps donc la mêttre en fin de serveur a la deco de tout le monde pour relancer le serveur ensuite tout les 24 h

*/


var AllRoom = require('./classObj/rooms.js'); 
var AllRoomLoaded = new AllRoom();
var disconnection = 0;

//READ

setTimeout(() => {
  fs.readFile('savedAllRooms.json', (err, savedAllRooms) => {
    if (err) throw err;
    savedAllRooms = JSON.parse(savedAllRooms);
    AllRoomLoaded.loadRoomByFile(savedAllRooms.users,savedAllRooms.roomArray,savedAllRooms.guilds,savedAllRooms.savedItems,savedAllRooms.savedNameItems);
  //console.log(AllRoomLoaded.roomArray);
  });
}, 2000);


/*
fs.readFile('name.json', (err, data) => {
  if (err) throw err;
  var student = JSON.parse(data);
  student.forEach(name => {
    AllRoomLoaded.addNammeAtLoad(name.name);
  });
  var arrayDoor = [];
  arrayDoor.push('tavern');
  arrayDoor.push('adventurer\'s road');
  AllRoomLoaded.createNewRoomDev(5,0,3,0,1,1,0,'port',arrayDoor);
  arrayDoor = [];
  arrayDoor.push('port');
  AllRoomLoaded.createNewRoomDev(5,0,4,0,1,1,0,'tavern',arrayDoor);
  arrayDoor = [];
  arrayDoor.push('port');
  arrayDoor.push('adventurer\'s cemetery');
  arrayDoor.push('adventurer\'s mountain');
  AllRoomLoaded.createNewRoomDev(5,0,4,0,1,1,0,'adventurer\'s road',arrayDoor);
  arrayDoor = [];
  arrayDoor.push('adventurer\'s road');
  AllRoomLoaded.createNewRoomDev(5,0,4,0,1,1,0,'adventurer\'s cemetery',arrayDoor);
  arrayDoor = [];
  arrayDoor.push('adventurer\'s road');
  arrayDoor.push('adventurer\'s waterfall');
  arrayDoor.push('mountain\'s pic');
  AllRoomLoaded.createNewRoomDev(5,0,3,0,1,1,0,'adventurer\'s mountain',arrayDoor);
  arrayDoor = [];
  arrayDoor.push('adventurer\'s mountain');
  arrayDoor.push('waterfall\'s cave');
  AllRoomLoaded.createNewRoomDev(5,0,3,0,1,1,0,'adventurer\'s waterfall',arrayDoor);
  arrayDoor = [];
  arrayDoor.push('adventurer\'s waterfall');
  AllRoomLoaded.createNewRoomDev(5,0,3,0,1,1,0,'waterfall\'s cave',arrayDoor);
  arrayDoor = [];
  arrayDoor.push('adventurer\'s mountain');
  arrayDoor.push('mountain\'s cave');
  AllRoomLoaded.createNewRoomDev(5,0,3,0,1,1,0,'mountain\'s pic',arrayDoor);
}); */

//setTimeout(() => {
//}, 1000);
//var prettyJs = nb.beautifyJs(AllRoomLoaded);
//student = JSON.stringify(AllRoom) 

  
function saveAndQuit(){
  //Faire une save de la save
  //fs.readFile('savedAllRooms.json', (err, savedLastAllRooms) => {
  //  if (err) throw err;
    //fs.writeFile('savedLastAllRooms.json', savedLastAllRooms, (err) => {
    //  if (err) throw err;
  disconnection = 1;
  var savedAllRooms = AllRoomLoaded.prepareToStringify();
  try {
    AllRoomLoaded.roomArray.forEach(room => {
      room.object.forEach(obj => {
        obj.AllRooms = [];
        obj.items.forEach(item => {
          item.AllRooms = [];
        });//console.log(typeof obj.AllRooms );
      });
    });
    var savedAllRoomsStringified = JSON.stringify(savedAllRooms, null, 2);
    fs.writeFile('savedAllRooms.json', JSON.minify(savedAllRoomsStringified), (err) => {
      if (err) throw err;
      console.log('Saved !');
      setTimeout(() => {
        process.exit();
      }, 300);
    });
  } catch (error) {
    console.log(error);
  }
    //});
  //});
}



if(disconnection == 0){
  io.on('connection', (socket) => {console.log('client connected')
    
    socket.on('action', (msg) => {
      AllRoomLoaded.action(JSON.parse(msg),socket.user);
    });

    socket.on('message', (msg) => {
      if (socket.user)
        AllRoomLoaded.sendAllClientInfoRoom(socket.user.room,socket.user.name+' say '+msg);
    });

    socket.on('connection', (msg) => {
      AllRoomLoaded.connectUser(JSON.parse(msg),socket);
    });
    
  });
}

setTimeout(() => {
  saveAndQuit();
}, 50000);
