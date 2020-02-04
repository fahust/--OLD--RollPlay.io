
//const Items = require('./items.js');
const Action = require('./action.js');

function entierAleatoire(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Obj{
    //0 = me ,1 = user, 2 = pnj, 3 = enemy, 4 = build, 5 = forge, 6 = alchimie , 7 = door
  constructor(AllRooms,type,hp,hpmax,force,forcemax,dext,dextmax,chance,chancemax,charme,charmemax,reputation,level,name,id,room,password,agressivity) {
    this.AllRooms = AllRooms;
    this.type = type;
    this.name = name;
    this.id = id;
    this.password = password;
    this.agressivity = agressivity;

    this.hp = hp;
    this.hpmax = hpmax;
    this.force = force;
    this.forcemax = forcemax;
    this.dext = dext;
    this.dextmax = dextmax;
    this.chance = chance;
    this.chancemax = chancemax;
    this.charme = charme;
    this.charmemax = charmemax;
    this.reputation = reputation;
    
    this.level = level;
    
    this.timeaction = 3000;

    this.action = [];
    this.items = [];
    this.nbrItems = 0;//persistant
    this.timeConso = 0;
    this.dateLastConso = 0;
    this.dateLastAttack = Date.now();
    this.ressource;
    
    this.idcrea;
    this.socket = [];
    this.socket.connected =false;
    this.room = room;
    this.description;
    this.cible;
    this.itemEquip1;
    this.itemEquip2;
    this.itemEquip3;
    this.monsterAttack();
  }

  monsterAttack(){//console.log('test');
    var varRooms = this.AllRooms;
    if (this.type == 3 && Date.now()-this.dateLastAttack > this.timeaction){//eventuellement créer des gardes qui attaquerais les monstres
      var cachedCible = [];
      //console.log(varRooms);
      for (var i = 0, len = varRooms.roomArray.length; i < len; i++) {//varRooms.roomArray.foreach(function (room, i) {//console.log(cachedCible);
        if(this.room == varRooms.roomArray[i]){//if (this.room == room.name){
          for (var i2 = 0, len2 = varRooms.roomArray.length; i2 < len2; i2++) {//room.foreach(function (obj, i2) {
            if(varRooms.roomArray[i].object[i2].type == 1)
              cachedCible.push(varRooms.roomArray[i].object[i2]);
          }//);
        }
      }//);
      var cible = cachedCible[entierAleatoire(0,cachedCible.length)];
      var action = [];
      this.dateLastAttack = Date.now();
      action.action = 'attack';
      action.by = this;
      action.to = cible;
      action.byItems = [];
      action.toItems = [];
      action.room = this.room;//name room
      //var actionEvent = new Action(this.AllRooms,action);
    }
  }

  addItems(items){
    if (this.nbrItems < this.level){
      this.items.push(items);
      this.nbrItems += 1;
    }
  }
    

  actionPossible() {//action que l'ont peut executer vers cet objet
    if (this.type == 1) {//user
      this.action[1] = 'attack';
      this.action[2] = 'charm';
      this.action[3] = 'taunt';
      this.action[4] = 'skill';
      this.action[5] = 'give';
      this.action[6] = 'threaten';
      this.action[7] = 'glorified';
      this.action[8] = 'watch';
    }
        
    if (this.type == 2) {//pnj
      this.action[1] = 'trade';
      this.action[2] = 'attack';
      this.action[3] = 'charm';
      this.action[4] = 'taunt';
      this.action[5] = 'skill';
      this.action[6] = 'give';
      this.action[7] = 'threaten';
      this.action[8] = 'glorified';
      this.action[9] = 'watch';
    }
        
    if (this.type == 3) {//enemy
      this.action[1] = 'attack';
      this.action[2] = 'charm';
      this.action[3] = 'taunt';
      this.action[4] = 'skill';
      this.action[5] = 'give';
      this.action[6] = 'watch';
    }
        
    if (this.type == 4) {//build
      this.action[1] = 'build';
      this.action[2] = 'destroy';
      this.action[3] = 'describe';
      this.action[4] = 'watch';
    }
    return this.action;
  }

  goToRoom(room,user){//console.log(this.AllRooms.roomArray);
    //var cachedUser;
    for (var i = 0, len = this.AllRooms.roomArray.length; i < len; i++) {//this.AllRooms.roomArray.foreach(function (room, i) {
      if (this.room == this.AllRooms.roomArray[i].name){
        for (var i2 = 0, len2 = this.AllRooms.roomArray[i].object.length; i2 < len2; i2++) {//this.AllRooms.roomArray[i].foreach(function (obj, i2) {
          //console.log(this.AllRooms.roomArray[i].object[i2].name, user.name);
          if(this.AllRooms.roomArray[i].object[i2]){
            if(this.AllRooms.roomArray[i].object[i2].name == user.name){
              //cachedUser = Object.assign(new Obj(this),this.AllRooms.roomArray[i].object[i2]);
              delete this.AllRooms.roomArray[i].object[i2];
            }
          }
        }//);
      }
    }//);
    var cachedRoom = user.room;
    user.room = room.name;
    //console.log('gotoroom',cachedRoom,room.name)
    this.AllRooms.sendAllClientRoom(cachedRoom);
    for (var i3 = 0, len3 = this.AllRooms.roomArray.length; i3 < len3; i3++) {//this.AllRooms.roomArray.foreach(function (room, i) {
      if(room.name == this.AllRooms.roomArray[i3].name)
        this.AllRooms.roomArray[i3].object.push(this);
    }//);
    this.AllRooms.sendAllClientRoom(room.name);
  }

  die(){
    this.hp = this.hpmax;
    this.force = this.forcemax;
    this.dext = this.dextmax;
    this.chance = this.chancemax;
    this.charme = this.charmemax;
    //var roomDead = this.room;
    this.goToRoom(this.AllRooms.roomArray[0].name,this);
    //this.AllRooms.sendAllClientRoom(roomDead);
  }

}


module.exports = Obj;