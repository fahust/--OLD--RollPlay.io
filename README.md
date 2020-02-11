# Rollplay.io
Multiplayer game with server in node.js and front in javascript/html5

[![Build Status](https://travis-ci.org/twisterghost/patchwire.svg?branch=master)](https://travis-ci.org/twisterghost/patchwire)

## Install
`npm install Rollplay.io`

## Create Room
```JavaScript
  var arrayDoor = [];
  arrayDoor.push('tavern');
  arrayDoor.push('adventurer\'s road');
  AllRoomLoaded.createNewRoomDev(5,0,3,0,1,1,0,'port',arrayDoor);
```


## About

Patchwire is a server framework designed for multiplayer games. Originally built to work with GameMaker: Studio's networking code, it has been standardized to be unassuming about the client end framework.

Patchwire uses a paradigm of sending "commands" to clients, and in turn, listening for commands from the client. A command is nothing more than a string identifier, and some data. A command looks like this:

```JavaScript
{
  command: 'updatePosition',
  x: 200,
  y: 120
}
```

## Clients

Patchwire is unassuming about the client side as it speaks primarily through JSON strings encoded over the wire. If you do not see your preferred client side below, creating your own client package is strongly encouraged, as Patchwire is built to be as easy as possible to implement. More client packages will come over time.


