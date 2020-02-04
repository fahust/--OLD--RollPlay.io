
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
    if (this.type == 3 && Date.now()-this.dateLastAttack > this.timeaction){//monster attack
      var cachedCible = [];
      for (var i = 0, len = varRooms.roomArray.length; i < len; i++) {
        if(this.room == varRooms.roomArray[i]){
          for (var i2 = 0, len2 = varRooms.roomArray.length; i2 < len2; i2++) {
            if(varRooms.roomArray[i].object[i2].type == 1 /*&& this.cible != varRooms.roomArray[i].object[i2]*/)
              cachedCible.push(varRooms.roomArray[i].object[i2]);
          }
        }
      }
    }else if (this.type == 2 && Date.now()-this.dateLastAttack > this.timeaction){//pnj attack
      var cachedCible = [];
      for (var i = 0, len = varRooms.roomArray.length; i < len; i++) {
        if(this.room == varRooms.roomArray[i]){
          for (var i2 = 0, len2 = varRooms.roomArray.length; i2 < len2; i2++) {
            if(varRooms.roomArray[i].object[i2].type == 3 /*&& this.cible != varRooms.roomArray[i].object[i2]*/)
              cachedCible.push(varRooms.roomArray[i].object[i2]);
            if(varRooms.roomArray[i].object[i2].type == 1 && varRooms.roomArray[i].object[i2].reputation <= 10)
              cachedCible.push(varRooms.roomArray[i].object[i2]);
          }
        }
      }
    }
    if ((this.type == 2 || this.type == 3) && Date.now()-this.dateLastAttack > this.timeaction){
    this.cible = cachedCible[entierAleatoire(0,cachedCible.length)];
    var action = [];
    this.dateLastAttack = Date.now();
    action.action = 'attack';
    action.by = this;
    action.to = this.cible;
    action.byItems = [];
    action.toItems = [];
    action.room = this.room;//name room
    var actionEvent = new Action(this.AllRooms,action);
    }
    
  }

  addItems(items){
    if (this.nbrItems <= 10/*this.level*/){
      this.items.push(items);
      this.nbrItems += 1;
    }
  }
    

  goToRoom(room,user){//console.log(this.AllRooms.roomArray);
    //var cachedUser;
    for (var i = 0, len = this.AllRooms.roomArray.length; i < len; i++) {
      if (this.room == this.AllRooms.roomArray[i].name){
        for (var i2 = 0, len2 = this.AllRooms.roomArray[i].object.length; i2 < len2; i2++) {
          //console.log(this.AllRooms.roomArray[i].object[i2].name, user.name);
          if(this.AllRooms.roomArray[i].object[i2]){
            if(this.AllRooms.roomArray[i].object[i2].name == user.name){
              delete this.AllRooms.roomArray[i].object[i2];
            }
          }
        }
      }
    }
    if (user.room){
      var cachedRoom = user.room;
      user.room = room.name;
      this.AllRooms.sendAllClientRoom(cachedRoom);
      for (var i3 = 0, len3 = this.AllRooms.roomArray.length; i3 < len3; i3++) {
        if(room.name == this.AllRooms.roomArray[i3].name)
          this.AllRooms.roomArray[i3].object.push(this);
      }
      this.AllRooms.sendAllClientRoom(room.name);
    }
  }

  die(){
    this.hp = this.hpmax;
    this.force = this.forcemax;
    this.dext = this.dextmax;
    this.chance = this.chancemax;
    this.charme = this.charmemax;
    this.goToRoom(this.AllRooms.roomArray[0].name,this);
  }

}


module.exports = Obj;