
const Action = require('./action.js');
const Jobs = require('./job.js');

function entierAleatoire(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Obj{
    //0 = me ,1 = user, 2 = pnj, 3 = enemy, 4 = build, 5 = forge, 6 = alchimie , 7 = door
  constructor(AllRooms,type,hp,hpmax,force,forcemax,dext,dextmax,chance,chancemax,charme,charmemax,reputation,level,name,id,room,password,agressivity,image = 1,exp = 0) {
    this.AllRooms = AllRooms;
    this.type = type;//type
    this.name = name;//name
    this.id = id;
    this.password = password;//password
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
    this.reputation = reputation;//reputation
    
    this.level = level;
    this.exp = exp;
    this.connectLatence = 0;
    setTimeout(() => {
      this.connectLatence = 1;
    }, 2000);
    
    this.timeaction = 3000;

    this.action = [];
    this.items = [];
    this.nbrItems = 0;//persistant
    this.timeConso = 0;
    this.dateLastConso = 0;
    this.dateLastAttack = Date.now();
    this.po;
    this.guild = '';
    this.guildInvit = '';
    if(this.type == 1){
      this.job = new Jobs();
    }else{
      this.job = [];
    }
    this.jobNow = '';

    this.image = image;
    this.goTo = 0;
    
    this.idcrea;
    this.socket = [];
    this.socket.connected =false;
    this.room = room;
    this.description;
    this.cible;
    this.itemEquip1;
    this.itemEquip2;
    this.itemEquip3;
    //this.monsterAttack();
  }

  addExp(exp){
    this.exp += exp;
    if(this.exp > (10*(this.level*this.level))){
      this.exp = 0;
      this.level += 1;
      var gainHp = entierAleatoire(1,this.level);
      var gainForce = entierAleatoire(1,this.level);
      var gainDext = entierAleatoire(1,this.level);
      var gainChance = entierAleatoire(1,this.level);
      var gainCharme = entierAleatoire(1,this.level);
      this.hpmax += gainHp;
      this.hp = this.hpmax;
      this.forcemax += gainForce;
      this.force = this.forcemax;
      this.dextmax += gainDext;
      this.dext = this.dextmax;
      this.chancemax += gainChance;
      this.chance = this.chancemax;
      this.charmemax += gainCharme;
      this.charme = this.charmemax;
      this.timeConso = 0;
      this.dateLastConso = 0;
      this.AllRooms.sendOneClientInfoRoom(this.room,'<p>You level up</p><p>Life Gain : +</p>'+gainHp+'<p>Strength Gain : +</p>'+gainForce+'<p>Dexterity Gain : +</p>'+gainDext+'<p>Lucky Gain : +</p>'+gainChance+'<p>Charm Gain : +</p>'+gainCharme,this.by);
    }
  }

  addLevelJob(nameJob){
      if(this.job.jobNow == nameJob){
        if(this.job.jobs[nameJob] === undefined){
          this.job.jobs[nameJob] = 1;
        }else{
          this.job.jobs[nameJob] += 1;
        }
        this.job.jobLvlNow = this.job.jobs[nameJob]
        return 1+(this.job.jobLvlNow/10);
      }
    return 1;
  }

  monsterAttack(){//if(this.type == 3)console.log(this.AllRooms)
    
    if(this.AllRooms){
      var dontAttack = false;
      if(this.AllRooms.roomArray){
        var varRooms = this.AllRooms;
        if (this.type == 3 && Date.now()-this.dateLastAttack > this.timeaction){//monster attack
          var cachedCible = [];//console.log(3)
          for (var i = 0, len = varRooms.roomArray.length; i < len; i++) {
            if(this.room == varRooms.roomArray[i].name){
              for (var i2 = 0, len2 = varRooms.roomArray[i].object.length; i2 < len2; i2++) {
                if(varRooms.roomArray[i].object[i2].connectLatence == 0)
                  dontAttack = true;
                if(varRooms.roomArray[i].object[i2]){
                  if(varRooms.roomArray[i].object[i2].type == 1 /*&& this.cible != varRooms.roomArray[i].object[i2]*/)
                    cachedCible.push(varRooms.roomArray[i].object[i2]);
                }
              }
            }
          }
        }else if (this.type == 2 && Date.now()-this.dateLastAttack > this.timeaction){//pnj attack
          var cachedCible = [];
          for (var i = 0, len = varRooms.roomArray.length; i < len; i++) {
            if(this.room == varRooms.roomArray[i].name){
              for (var i2 = 0, len2 = varRooms.roomArray[i].object.length; i2 < len2; i2++) {
                if(varRooms.roomArray[i].object[i2]){
                  if(varRooms.roomArray[i].object[i2].connectLatence == 0)
                    dontAttack = true;
                  if(varRooms.roomArray[i].object[i2].type == 3 /*&& this.cible != varRooms.roomArray[i].object[i2]*/)
                    cachedCible.push(varRooms.roomArray[i].object[i2]);
                  if(varRooms.roomArray[i].object[i2].type == 1 && varRooms.roomArray[i].object[i2].reputation <= -10)
                    cachedCible.push(varRooms.roomArray[i].object[i2]);
                }
              }
            }
          }
        }
        if ((this.type == 2 || this.type == 3) && Date.now()-this.dateLastAttack > this.timeaction && dontAttack == false){
          this.cible = cachedCible[entierAleatoire(0,cachedCible.length)];
          //console.log(cachedCible);
          if(this.cible){
            var action = [];
            this.dateLastAttack = Date.now();
            action.action = 'attack';
            action.to = this.cible.name;
            action.byItems = [];
            action.toItems = [];
            action.room = this.room;//name room
            var actionEvent = new Action(this.AllRooms,action,this);
          }
        }
      }
    }
  }

  addItems(items){
    if (this.nbrItems <= 10/*this.level*/){
      this.items.push(items);
      this.nbrItems += 1;
    }
  }
    

  goToRoom(room,user){
    for (var i = 0, len = this.AllRooms.roomArray.length; i < len; i++) {
      if (this.room == this.AllRooms.roomArray[i].name){
        for (var i2 = 0, len2 = this.AllRooms.roomArray[i].object.length; i2 < len2; i2++) {
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
        if(room.name == this.AllRooms.roomArray[i3].name){
          this.AllRooms.roomArray[i3].object.push(this);
          if(this.guild != this.AllRooms.roomArray[i3].owner){
            this.po -= 1;
            this.AllRooms.sendOneClientInfoRoom(this.AllRooms.roomArray[i3].name,'You pay tax to '+this.AllRooms.roomArray[i3].owner,this);
          }
        }
      }
      this.goTo = 0;
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