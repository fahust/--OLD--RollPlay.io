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

*/


var AllRoom = require('./classObj/rooms.js'); 
var AllRoomLoaded = new AllRoom();

//READ

setTimeout(() => {
fs.readFile('savedAllRooms.json', (err, savedAllRooms) => {
  if (err) throw err;
  savedAllRooms = JSON.parse(savedAllRooms);
  AllRoomLoaded.loadRoomByFile(savedAllRooms.users,savedAllRooms.roomArray,savedAllRooms.guilds,savedAllRooms.savedItems,savedAllRooms.savedNameItems);
  //console.log(AllRoomLoaded);
});
}, 1000);


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
  AllRoomLoaded.createNewRoomDev(2,4,2,2,1,1,2,'adventurer\'s road',arrayDoor);
  arrayDoor = [];
  arrayDoor.push('adventurer\'s road');
  AllRoomLoaded.createNewRoomDev(2,6,1,3,1,1,3,'adventurer\'s cemetery',arrayDoor);
  arrayDoor = [];
  arrayDoor.push('adventurer\'s road');
  arrayDoor.push('adventurer\'s waterfall');
  arrayDoor.push('mountain\'s pic');
  AllRoomLoaded.createNewRoomDev(0,4,0,4,1,1,3,'adventurer\'s mountain',arrayDoor);
  arrayDoor = [];
  arrayDoor.push('adventurer\'s mountain');
  arrayDoor.push('waterfall\'s cave');
  AllRoomLoaded.createNewRoomDev(0,4,0,5,1,1,3,'adventurer\'s waterfall',arrayDoor);
  arrayDoor = [];
  arrayDoor.push('adventurer\'s waterfall');
  AllRoomLoaded.createNewRoomDev(0,4,0,4,1,1,3,'waterfall\'s cave',arrayDoor);
  arrayDoor = [];
  arrayDoor.push('adventurer\'s mountain');
  arrayDoor.push('mountain\'s cave');
  AllRoomLoaded.createNewRoomDev(0,4,0,6,1,1,3,'mountain\'s pic',arrayDoor);
}); */

//setTimeout(() => {
//}, 1000);
//var prettyJs = nb.beautifyJs(AllRoomLoaded);
//student = JSON.stringify(AllRoom) 

  
function save(){
  //Faire une save de la save
  fs.readFile('savedAllRooms.json', (err, savedLastAllRooms) => {
    if (err) throw err;
    fs.writeFile('savedLastAllRooms.json', savedLastAllRooms, (err) => {
      if (err) throw err;
      var savedAllRooms = AllRoomLoaded.prepareToStringify();
      var savedAllRoomsStringified = JSON.stringify(savedAllRooms, null, 2);
      fs.writeFile('savedAllRooms.json', JSON.minify(savedAllRoomsStringified), (err) => {
        if (err) throw err;
        console.log('Saved !');
      });

    });
  });

  
}

setInterval(() => {
  //save();
}, 100000);


io.on('connection', (socket) => {console.log('client connected')
  
  socket.on('action', (msg) => {//console.log(socket.user)
    AllRoomLoaded.action(JSON.parse(msg),socket.user);
  });

  socket.on('message', (msg) => {
    if (socket.user)
      AllRoomLoaded.sendAllClientInfoRoom(socket.user.room,socket.user.name+' say '+msg);
  });

  socket.on('connection', (msg) => {//console.log(AllRoomLoaded)
    var userexist;
    userexist = AllRoomLoaded.connectUser(JSON.parse(msg),socket);
    //console.log(userexist);
    //socket.user = user;
      /*if(userexist == 0){console.log('creation compte')
      var user = AllRoomLoaded.creationAccount(JSON.parse(msg),socket)
      socket.user = user
        AllRoomLoaded.sendAllClientInfoRoom(socket.user.room,socket.user.name+' is connected');
        AllRoomLoaded.sendAllClientRoom(socket.user.room);
      }*/
      //save()
  });
  
  /*socket.on('disconnect', (msg) => {//console.log(socket);
    socket.connected = false;
    var roomvar = socket.user.room;
    for (var i = 0, len = AllRoomLoaded.roomArray.length; i < len; i++) {
      if (this.room == AllRoomLoaded.roomArray[i].name){
        for (var i2 = 0, len2 = AllRoomLoaded.roomArray[i].object.length; i2 < len2; i2++) {
          if(AllRoomLoaded.roomArray[i].object[i2]){
            if(AllRoomLoaded.roomArray[i].object[i2].name == socket.user.name){
              delete AllRoomLoaded.roomArray[i].object[i2];
            }
          }
        }
      }
    }
    AllRoomLoaded.sendAllClientRoom(roomvar);
  });
    */
      
      
});
