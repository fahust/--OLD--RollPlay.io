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
var Obj = require('./classObj/obj.js'); 
var AllRoomLoaded = new AllRoom();
var disconnection = 0;
var readyServer = 0;
var socketArray = [];

//READ

setTimeout(() => {
  fs.readFile('savedAllRooms.json', (err, savedAllRooms) => {
    if (err) throw err;
    savedAllRooms = JSON.parse(savedAllRooms);
    AllRoomLoaded.loadRoomByFile(savedAllRooms.users,savedAllRooms.roomArray,savedAllRooms.guilds,savedAllRooms.savedItems,savedAllRooms.savedNameItems);
  //console.log(AllRoomLoaded.roomArray);

  });
}, 30);

fs.readFile('name.json', (err, data) => {
  if (err) throw err;
  var student = JSON.parse(data);
  if( AllRoomLoaded.savedNamePnjs.length < 2) {
    student.forEach(name => {
      AllRoomLoaded.addNammeAtLoad(name.name);
    });
  }
});



io.on('connection', (socket) => {console.log('client connected')
  socketArray.push(socket);
  if(disconnection == 0){
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
    try {
      socket.on('disconnect', () => { // moved here from io.on('connection', socket => {...}) for test purposes
        if(socket.user){
          //AllRoomLoaded.users.push(socket.user);
          var userDisconnect = socket.user;
          fs.readFile('users.json', (err, users) => {
            if (err) throw err;
            var usersSave = JSON.parse(users);

            userDisconnect.AllRooms = [];
            userDisconnect.socket = [];
            userDisconnect.cible = [];
            userDisconnect.items.forEach(item => {
              if(item)
                item.AllRooms = [];
            });

            var existInAllRoom = false;
            usersSave.forEach(userSave => {
              if(userDisconnect.name == userSave.name){
                existInAllRoom = true;
                userSave = userDisconnect;
              }
            });
            if(existInAllRoom == false){
              usersSave.push(userDisconnect);
            }
            //console.log(userDisconnect);
            var usersStringified = JSON.stringify(usersSave, null, 2);
            fs.writeFile('users.json', JSON.minify(usersStringified), (err) => {
              if (err) throw err;
              console.log('Saved Users!');
            });
          });

          
        }
      });
    } catch (error) {
    
    }
  }
});
/*
fs.readFile('name.json', (err, data) => {
  if (err) throw err;
  var student = JSON.parse(data);
  student.forEach(name => {
    //AllRoomLoaded.addNammeAtLoad(name.name);
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

function saveUser(){
  saveAndQuit();
  //END USERS
}
function saveAndQuit(){
  //Faire une save de la save
  //fs.readFile('savedAllRooms.json', (err, savedLastAllRooms) => {
  //  if (err) throw err;
    //fs.writeFile('savedLastAllRooms.json', savedLastAllRooms, (err) => {
    //  if (err) throw err;
  disconnection = 1;
  try {
    AllRoomLoaded.roomArray.forEach(room => {
      room.object.forEach(obj => {
        obj.AllRooms = [];
        obj.socket = [];
        obj.cible = [];
        obj.items.forEach(item => {
          if(item)
            item.AllRooms = [];
        });
        if(obj.type == 1){
          obj = [];
        }
      });
    });

    AllRoomLoaded.savedItems.forEach(savedItem => {
      if(savedItem)
        savedItem.AllRooms = [];
    });

    AllRoomLoaded.savedNameMonsters = [];
    AllRoomLoaded.users = [];

    var savedAllRoomsStringified = JSON.stringify(AllRoomLoaded, null, 2);
    fs.writeFile('savedAllRooms.json', JSON.minify(savedAllRoomsStringified), (err) => {
      if (err) throw err;
      console.log('Saved !');
      process.exit();
    });
  } catch (error) {
    console.log(error);
  }
    //});
  //});
}


setTimeout(() => {
  socketArray.forEach(socketDisconnect => {
    if(socketDisconnect.connected == true)
      socketDisconnect.disconnect();
  });
}, 22000);

setTimeout(() => {
  saveUser();
}, 25000);

