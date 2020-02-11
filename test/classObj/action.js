
const Items = require('./items.js');
const Guild = require('./guild.js');
const fs = require('fs');

function arrayRemove(arr, value) {

  return arr.filter(function(ele){
    return ele != value;
  });
 
}

function entierAleatoire(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


class Action{
  constructor(AllRooms,msg,by) { console.log(msg)
    this.AllRooms = AllRooms;
    this.action = msg.action;
    this.by = by;
    this.room = msg.room;//name room
    this.getTo(msg.to);
    this.getByItem(msg.byItems);
    this.getToItem(msg.toItems);
    this.to;
    this.byItems;
    this.toItems;
    this.itemName;
    this.itemHp;
    this.itemForce;
    this.itemDext;
    this.itemChance;
    this.itemCharme;
    this.itemTime;
    this.itemType;

    this.hpEquipedBy = 0;
    this.forceEquipedBy = 0;
    this.dextEquipedBy = 0;
    this.chanceEquipedBy = 0;
    this.charmeEquipedBy = 0;
    this.hpEquipedTo = 0;
    this.forceEquipedTo = 0;
    this.dextEquipedTo = 0;
    this.chanceEquipedTo = 0;
    this.charmeEquipedTo = 0;
    if(msg.createItem)
      this.getItemCreate(msg.msgCreateItem);
    this.actionLoad();
  }

  getItemCreate(msgCreateItem){
    this.itemName = msgCreateItem.name;
    this.itemHp = msgCreateItem.hp;
    this.itemForce = msgCreateItem.force;
    this.itemDext = msgCreateItem.dext;
    this.itemChance = msgCreateItem.chance;
    this.itemCharme = msgCreateItem.charme;
    this.itemTime = msgCreateItem.time;
    this.itemType = msgCreateItem.type;
  }

  getTo(msgTo){
    this.AllRooms.roomArray.forEach(element => {
      if (element.name == this.room){//check room 
        element.object.forEach(obj => {//mise en cache des obj de la room
          if (obj.name == msgTo){
            this.to = obj;
            return obj;
          }
        });
      }
    });
  }

  getByItem(msgByItems){
    if(msgByItems != ''){
      this.AllRooms.savedItems.forEach(item => {
        if (item.name == msgByItems){//check room 
          this.byItems = item;
          return item;
        }
      });
    }
  }

  getToItem(msgToItems){
    if(msgToItems != ''){
      this.AllRooms.savedItems.forEach(item => {
        if (item.name == msgToItems){//check room 
          this.toItems = item;
          return item;
        }
      });
    }
  }

  actionLoad(){
    if (this.action == 'trade')
      this.trade();
    if (this.action == 'attack')
      this.attack();
    if (this.action == 'charm')
      this.charm(1);
    if (this.action == 'taunt')
      this.taunt(1);
    if (this.action == 'skill')
      this.skill();
    if (this.action == 'give')
      this.give();
    if (this.action == 'sell')
      this.sell();
    if (this.action == 'threaten')
      this.taunt(2);
    if (this.action == 'glorified')
      this.charm(2);
    if (this.action == 'watch')
      this.watch();
    if (this.action == 'describe')
      this.describe();
    if (this.action == 'forge')
      this.forge();
    if (this.action == 'unequip all item')
      this.unequipItems();
    if (this.action == 'goReady')
      this.goAction();
    if (this.action == 'go')
      this.prepareGoAction();
    if (this.action == 'Use item')
      this.useItems();
    if (this.action == 'Equip item')
      this.equipItems();
    if (this.action == 'Talk')
      this.talk();
    if (this.action == 'Steal')
      this.steal();
    if (this.action == 'Change job')
      this.changeJob();
    if (this.action == 'Revandic')
      this.revandic();
    if (this.action == 'Create guild')
      this.createGuild();
    if (this.action == 'Join guild')
      this.joinGuild();
    if (this.action == 'Quit guild')
      this.quitGuild();
      
      
  }

  prepareGoAction(){
    if(this.to && this.by){
      this.by.goTo = this.to;
      this.AllRooms.sendAllClientInfoRoom(this.room,this.by.name+' prepare to go to place "'+this.to.name+'"');
    }
  }

  goAction(){
    if(this.by){
      if(this.by.goTo != 0){
        this.by.goToRoom(this.by.goTo,this.by);
      }
    }
  }
  taunt(taux){//like threaten
    if(this.to && this.by){
      if(this.to.type == 2)
        this.by.reputation -= taux;
      if(this.to.type == 3)
        this.by.agressivity += taux;
      this.AllRooms.sendOneClientInfoRoom(this.room,'You taunt '+this.to.name,this.by);
      if(this.to.type == 1)
        this.AllRooms.sendOneClientInfoRoom(this.room,this.to.name+' try to taunt you ',this.to);
    }
  }

  charm(taux){//like threaten
    if(this.to && this.by){
      if(this.to.type == 2)
        this.by.reputation += taux;
      if(this.to.type == 3)
        this.by.agressivity -= taux;
      this.AllRooms.sendOneClientInfoRoom(this.room,'You charmed '+this.to.name,this.by);
      if(this.to.type == 1)
        this.AllRooms.sendOneClientInfoRoom(this.room,this.to.name+' try to charm you ',this.to);
    }
  }

  sell(){
    if(this.to && this.by){
      var price;
      this.by.items.forEach(item => {
        if(item.name == this.byItems.name){
          item = [];
          price = item.level;
        }
      });
      this.by.ressource += price;
      this.by.nbrItems -= 1;
      this.AllRooms.sendOneClientInfoRoom(this.room,'You have sell '+this.byItems.name+' to '+this.to.name,this.by);
      //penser a retirer l'objet côter client
    }
  }

  trade(){
    if(this.to && this.by){
      if(this.to.type == 2){//pnj
        var bonus = this.by.addLevelJob('Trader');

        var toItems = this.AllRooms.getItemsAleatoire(this.byItems+bonus);
        toItems.owner = this.by;

        this.by.items.push(toItems);
        this.by.items.forEach(item => {
          if(item.name == this.byItems.name)
            item = [];
        });
        //this.AllRooms.sendRoom(this.by.room);
        this.AllRooms.sendOneClientInfoRoom(this.room,'You have traded '+this.byItems+' to '+this.to.name+' in return for '+toItems.name,this.by);
        this.AllRooms.sendAllClientRoom(this.room);
      }
    }
  }

  give(){
    if(this.to && this.by){
      this.byItems = new Items(this.AllRooms,this.byItems);
      this.byItems.owner = this.to;

      this.to.items.push(this.byItems);
      this.by.items.forEach(item => {
        if(item.name == this.byItems.name)
          item = [];
      });
      this.by.nbrItems -= 1;
      this.AllRooms.sendOneClientInfoRoom(this.room,'You have gived '+this.byItems.name+' to '+this.to.name,this.by);
      if(this.to.type == 1)
        this.AllRooms.sendOneClientInfoRoom(this.room,'You have received '+this.toItems.name+' by '+this.to.name,this.to);
      //penser a retirer l'objet côter client
    }
  }

  steal(){
    /*if(this.to && this.by){
      this.byItems = new Items(this.AllRooms,this.byItems);
      this.byItems.owner = this.to;

      this.to.items.push(this.byItems);
      this.by.items.forEach(item => {
        if(item.name == this.byItems.name)
          item = [];
      });
      this.by.nbrItems -= 1;
      this.AllRooms.sendOneClientInfoRoom(this.room,'You have gived '+this.byItems.name+' to '+this.to.name,this.by);
      if(this.to.type == 1)
        this.AllRooms.sendOneClientInfoRoom(this.room,'You have received '+this.toItems.name+' by '+this.to.name,this.to);
      //penser a retirer l'objet côter client
    }*/
  }

  byItemEquipedStats(){
    if(this.by){
      if (this.by.itemEquip1){
        this.hpEquipedBy += this.by.itemEquip1.dext;
        this.forceEquipedBy += this.by.itemEquip1.force;
        this.dextEquipedBy += this.by.itemEquip1.dext;
        this.chanceEquipedBy += this.by.itemEquip1.chance;
        this.charmeEquipedBy += this.by.itemEquip1.charme;
      }
      if (this.by.itemEquip2){
        this.hpEquipedBy += this.by.itemEquip2.dext;
        this.forceEquipedBy += this.by.itemEquip2.force;
        this.dextEquipedBy += this.by.itemEquip2.dext;
        this.chanceEquipedBy += this.by.itemEquip2.chance;
        this.charmeEquipedBy += this.by.itemEquip2.charme;
      }
      if (this.by.itemEquip3){
        this.hpEquipedBy += this.by.itemEquip3.dext;
        this.forceEquipedBy += this.by.itemEquip3.force;
        this.dextEquipedBy += this.by.itemEquip3.dext;
        this.chanceEquipedBy += this.by.itemEquip3.chance;
        this.charmeEquipedBy += this.by.itemEquip3.charme;
      }
    }
    if (this.hpEquipedBy< 0 || isNaN(this.hpEquipedBy)) {this.hpEquipedBy=0;}
    if (this.forceEquipedBy< 0 || isNaN(this.forceEquipedBy)) {this.forceEquipedBy=0;}
    if (this.dextEquipedBy< 0 || isNaN(this.dextEquipedBy)) {this.dextEquipedBy=0;}
    if (this.chanceEquipedBy< 0 || isNaN(this.chanceEquipedBy)) {this.chanceEquipedBy=0;}
    if (this.charmeEquipedBy< 0 || isNaN(this.charmeEquipedBy)) {this.charmeEquipedBy=0;}
  }
  toItemEquipedStats(){
    if(this.to){
      if (this.to.itemEquip1){
        this.hpEquipedTo += this.to.itemEquip1.dext;
        this.forceEquipedTo += this.to.itemEquip1.force;
        this.dextEquipedTo += this.to.itemEquip1.dext;
        this.chanceEquipedTo += this.to.itemEquip1.chance;
        this.charmeEquipedTo += this.to.itemEquip1.charme;
      }
      if (this.to.itemEquip2){
        this.hpEquipedTo += this.to.itemEquip2.dext;
        this.forceEquipedTo += this.to.itemEquip2.force;
        this.dextEquipedTo += this.to.itemEquip2.dext;
        this.chanceEquipedTo += this.to.itemEquip2.chance;
        this.charmeEquipedTo += this.to.itemEquip2.charme;
      }
      if (this.to.itemEquip3){
        this.hpEquipedTo += this.to.itemEquip3.dext;
        this.forceEquipedTo += this.to.itemEquip3.force;
        this.dextEquipedTo += this.to.itemEquip3.dext;
        this.chanceEquipedTo += this.to.itemEquip3.chance;
        this.charmeEquipedTo += this.to.itemEquip3.charme;
      }
    }
    if (this.hpEquipedTo< 0 || isNaN(this.hpEquipedTo)) {this.hpEquipedTo=0;}
    if (this.forceEquipedTo< 0 || isNaN(this.forceEquipedTo)) {this.forceEquipedTo=0;}
    if (this.dextEquipedTo< 0 || isNaN(this.dextEquipedTo)) {this.dextEquipedTo=0;}
    if (this.chanceEquipedTo< 0 || isNaN(this.chanceEquipedTo)) {this.chanceEquipedTo=0;}
    if (this.charmeEquipedTo< 0 || isNaN(this.charmeEquipedTo)) {this.charmeEquipedTo=0;}
  }

  attack(){
    if (this.to && this.by){
      this.byItemEquipedStats();
      this.toItemEquipedStats();
      if ((this.by.dext+this.dextEquipedBy+this.chanceEquipedBy)*(Math.random()*100) > (this.to.dext+this.dextEquipedTo+this.chanceEquipedTo)*(Math.random()*100)){
        this.to.hp -= this.by.force+this.forceEquipedBy;
        if (this.to.type == 1 && this.to.goTo != 0){
          this.to.goTo = 0;
          this.AllRooms.sendOneClientInfoRoom(this.room,this.by.name+' forced you to stay in these place ',this.to);
        }
        if (this.to.hp <= 0){
          this.by.addLevelJob('Vilain');
          this.by.addLevelJob('Dark knight');
          this.by.addLevelJob('Master of vilain');
          this.by.addLevelJob('Guardian');
          this.by.addLevelJob('Knight');
          this.by.addLevelJob('Master of guardians');
          this.by.ressource += 1;
          this.by.addExp(this.to.level);
          this.by.addItems(this.AllRooms.getItemsAleatoire(this.to.level,this.by));
          if (this.to.type == 1){
            this.to.die();
          }
          if (this.to.type == 2 || this.to.type == 3 ){
            for (var i = 0, len = this.AllRooms.roomArray.length; i < len; i++) {
              if (this.AllRooms.roomArray[i]){
                if (this.room == this.AllRooms.roomArray[i].name){
                  for (var i2 = 0, len2 = this.AllRooms.roomArray[i].object.length; i2 < len2; i2++) {
                    if(this.AllRooms.roomArray[i].object[i2]){
                      if(this.AllRooms.roomArray[i].object[i2].name == this.to.name){
                        var nameCible = this.to.name;
                        delete this.AllRooms.roomArray[i].object[i2];
                      }
                    }
                  }
                  if (this.to.type == 2 ){this.AllRooms.roomArray[i].danger += 1;}else{this.AllRooms.roomArray[i].danger -= 1;}
                }
              }
            }
          }
          this.AllRooms.sendOneClientInfoRoom(this.room,'Successful attack, you subtracts '+this.by.force+this.forceEquipedBy+' at '+nameCible+' and your target was defeated',this.by);
          this.AllRooms.sendAllClientRoom(this.room);
          this.AllRooms.sendAllClientInfoRoom(this.room,this.by.name+' has eliminated '+nameCible);
        }else{
          if(this.to.type == 1){
            this.AllRooms.sendOneClientInfoRoom(this.room,this.by.name+' attacks you and subtracts you '+this.by.force+this.forceEquipedBy+' life points',this.to);
          }
          this.AllRooms.sendOneClientInfoRoom(this.room,'Successful attack, you subtracts '+this.by.force+this.forceEquipedBy+' life points at '+this.to.name,this.by) ;
        }
      }else{
        this.AllRooms.sendOneClientInfoRoom(this.room,'The attack failed.',this.by);
        if(this.to.type == 1){
          this.AllRooms.sendOneClientInfoRoom(this.room,this.by.name+' attack you, but you dodge ',this.to);
        }
      }
    }else{
      this.AllRooms.sendAllClientRoom(this.room);
    }
  }


  skill(skill){
    if (this.to && this.by && skill){
      this.byItemEquipedStats();
      this.toItemEquipedStats();
      if ((this.by.dext+this.dextEquipedBy+this.chanceEquipedBy)*(Math.random()*100) > (this.to.dext+this.dextEquipedTo+this.chanceEquipedTo)*(Math.random()*100)){
        this.to.hp += skill.hp;
        this.to.dext += skill.dext;
        this.to.force += skill.force;
        this.to.chance += skill.chance;
        this.to.charme += skill.charme;
        this.to.timeConso += this.time;
        this.to.dateLastConso = Date.now();
        if (this.to.hp < 0){
          this.by.addItems(this.AllRooms.getItemsAleatoire(this.to.level,this.by));
          if (this.to.type == 1){//console.log('test')
            this.to.die();
          }
          if (this.to.type == 2 || this.to.type == 3 ){
            for (var i = 0, len = this.AllRooms.roomArray.length; i < len; i++) {
              if (this.AllRooms.roomArray[i]){
                if (this.room == this.AllRooms.roomArray[i].name){
                  for (var i2 = 0, len2 = this.AllRooms.roomArray[i].object.length; i2 < len2; i2++) {
                    if(this.AllRooms.roomArray[i].object[i2]){
                      if(this.AllRooms.roomArray[i].object[i2].name == this.to.name){
                        var nameCible = this.to.name;
                        delete this.AllRooms.roomArray[i].object[i2];
                      }
                    }
                  }
                  if (this.to.type == 2 ){this.AllRooms.roomArray[i].danger += 1;}else{this.AllRooms.roomArray[i].danger -= 1;}
                }
              }
            }
          }
          this.AllRooms.sendOneClientInfoRoom(this.room,'Successful completion of the attack, your target was defeated',this.by);
          this.AllRooms.sendAllClientRoom(this.room);
          this.AllRooms.sendAllClientInfoRoom(this.room,this.by+' has eliminated '+nameCible);
        }else{
          if(this.to.type == 1){
            this.AllRooms.sendOneClientInfoRoom(this.room,this.by.name+' attacked you and your stats were altered : Life points {'+this.to.hp+' / '+this.to.hpmax+'} , dexterity {'+this.to.dext+' / '+this.to.dextmax+'} , strength {'+this.to.force+' / '+this.to.forcemax+'} , charm {'+this.to.charme+' / '+this.to.charmemax+'} , lucky {'+this.to.chance+' / '+this.to.chancemax+'}',this.to);
          }
          this.AllRooms.sendOneClientInfoRoom(this.room,'The success of the attack, the statistics from '+this.to.name+' were modified: Life points {'+this.to.hp+' / '+this.to.hpmax+'} , dexterity {'+this.to.dext+' / '+this.to.dextmax+'} , strength {'+this.to.force+' / '+this.to.forcemax+'} , charm {'+this.to.charme+' / '+this.to.charmemax+'} , lucky {'+this.to.chance+' / '+this.to.chancemax+'}',this.by) ;
        }
      }else{
        this.AllRooms.sendOneClientInfoRoom(this.room,'The attack failed.',this.by);
        if(this.to.type == 1){
          this.AllRooms.sendOneClientInfoRoom(this.room,this.by.name+' attack you, but you dodge ',this.by);
        }
      }
    }else{
      this.AllRooms.sendAllClientRoom(this.room);
    }
  }

  watch(){
    if(this.to && this.by){
      this.AllRooms.sendOneClientInfoRoom(this.room,this.to.name+' :<p> Strength : '+this.to.force+'</p><p> Dexterity : '+this.to.dext+'</p><p> Luck : '+this.to.chance+'</p><p> Charm : '+this.to.charme+'</p><p> Level : '+this.to.level+'</p><p> Job : '+this.to.job.jobNow+'</p>',this.by) ;
      /*if (this.to.description != ''){
        this.AllRooms.sendOneClientInfoRoom(this.room,this.to.description,this.by) ;
      }else{console.log('test');
        this.AllRooms.sendOneClientInfoRoom(this.room,'Nothing to watch',this.by);
      }*/
    }
  }

  describe(){
    if(this.to && this.by){
      this.AllRooms.roomArray.forEach(room => {
        if(room.name == this.to.name){
          room.description = this.byItems;
        }
      });
      this.to.description = this.byItems;
      var bonus = this.by.addLevelJob('Scribe');
      this.AllRooms.sendOneClientInfoRoom(this.room,this.to.description,this.by);
    }
  }

  revandic(){
    if(this.to && this.by){
      this.AllRooms.roomArray.forEach(room => {
        if(room.name == this.to.name){
          room.owner = this.byItems;
        }
      });
      this.AllRooms.sendAllClientInfoRoom(this.room,'Place now belongs to"'+this.to.byItems+'"');
      //this.AllRooms.sendOneClientInfoRoom(this.room,this.to.description,this.by);
    }
  }

  createGuild(guildName){
    var exist = false;
    this.AllRooms.guilds.forEach(guild => {
      if(guild.name == guildName)
        exist = true;
    });
    if(exist == false){
      var guild = new Guild(guildName);
      this.AllRooms.guilds.push(guild);
      this.AllRooms.sendOneClientInfoRoom(this.room,'You have created guild "'+guildName+'"',this.by);
    }else{
      this.AllRooms.sendOneClientInfoRoom(this.room,'Name guild already exist : "'+guildName+'"',this.by);
    }
  }

  joinGuild(guildName){
    if(this.by.guild == ''){
      this.by.guild = guildName;
      this.AllRooms.sendOneClientInfoRoom(this.room,'You have join guild "'+this.by.guild+'"',this.by);
    }else{
      this.AllRooms.sendOneClientInfoRoom(this.room,'You have already in guild "'+this.by.guild+'"',this.by);
    }
  }

  quitGuild(){
    if(this.by.guild != ''){
      this.AllRooms.sendOneClientInfoRoom(this.room,'You have quit guild "'+this.by.guild+'"',this.by);
      this.by.guild = '';
    }else{
      this.AllRooms.sendOneClientInfoRoom(this.room,'You haven\'t guild',this.by);
    }
  }

  changeJob(jobName){
    if(this.by.job.jobs[jobName]){
      this.by.job.jobNow = jobName;
      this.by.job.jobLvlNow = this.by.job.jobs[jobName];
    }
  }

  forge(){
    if(this.by){
      if (!this.AllRooms.savedNameItems.includes(this.itemName)){
        var bonus = this.by.addLevelJob('Blacksmith');
        new Items(this.AllRooms,this.itemName,this.itemHp*bonus,this.itemForce*bonus,this.itemDext*bonus,this.itemChance*bonus,this.itemCharme+bonus,this.itemTime*bonus,this.itemType,this.by);
        this.AllRooms.sendOneClientInfoRoom(this.room,'You have created '+this.itemName,this.by);
        this.AllRooms.sendOneClientRoom(this.room,this.by);
      }
    }
  }

  talk(){
    if(this.to && this.by){
      if(this.to.type == 2){
        fs.readFile('dialogue.json', (err, data) => {
          if (err) throw err;
          var student = JSON.parse(data);
          this.AllRooms.sendOneClientInfoRoom(this.room,student[entierAleatoire(0,student.length)],this.by);
        });
      }
    }
  }

  /*createSkill(){
    if (!this.AllRooms.savedNameItems.includes(this.itemName)){
      new Skill(this.AllRooms,this.itemName,this.itemHp,this.itemForce,this.itemDext,this.itemChance,this.itemCharme,this.itemTime,this.itemType,this.by);
      this.AllRooms.sendOneClientInfoRoom(this.room,'You have created '+this.itemName,this.by);
      this.AllRooms.sendOneClientRoom(this.room,this.by);
    }
  }*/

  useItems(){
    if(this.to && this.by){
      if(this.byItems.type == 1){
        this.to.hp += this.byItems.hp;
        this.to.force += this.byItems.force;
        this.to.dext += this.byItems.dext;
        this.to.chance += this.byItems.chance;
        this.to.charme += this.byItems.charme;
        this.to.timeConso += this.time;
        this.to.dateLastConso = Date.now();
        this.by.items.forEach(item => {
          if(item.hp == this.byItems.hp && item.force == this.byItems.force && item.dext == this.byItems.dext && item.chance == this.byItems.chance && item.charme == this.byItems.charme )
            item = [];
            //delete item;
        });
        this.AllRooms.sendOneClientRoom(this.room,this.by);
        this.AllRooms.sendOneClientInfoRoom(this.room,'You use '+this.byItems.name,this.by);
      }
    }
  }

  equipItems(){
    if(this.by){
      if(this.byItems.type == 2){
        if(this.by.itemEquip1){
          this.by.itemEquip1 = this.byItems;
        }else if(this.by.itemEquip2){
          this.by.itemEquip2 = this.byItems;
        }else if(this.by.itemEquip3){
          this.by.itemEquip3 = this.byItems;
        }
        this.AllRooms.sendOneClientRoom(this.room,this.by);
      }
    }
  }

  unequipItems(){
    if(this.by){
      if(this.byItems.type == 2){
        if(this.by.itemEquip1 && this.by.itemEquip1 == this.byItems){
          this.by.itemEquip1 = [];
        }
        if(this.by.itemEquip2 && this.by.itemEquip2 == this.byItems){
          this.by.itemEquip2 = [];
        }
        if(this.by.itemEquip3 && this.by.itemEquip3 == this.byItems){
          this.by.itemEquip3 = [];
        }
        this.AllRooms.sendOneClientRoom(this.room,this.by);
      }
    }
  }
}


module.exports = Action;