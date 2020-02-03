
const Items = require('./items.js');

function arrayRemove(arr, value) {

  return arr.filter(function(ele){
    return ele != value;
  });
 
}


class Action{
  constructor(AllRooms,msg,by) {
    this.AllRooms = AllRooms;
    this.action = msg.action;
    this.by = by;
    this.room = msg.room;//name room
    //console.log(msg.to);
    this.getTo(msg.to);
    this.getByItem(msg.byItems);
    this.getToItem(msg.toItems);
    this.to;
    this.byItems;
    this.toItems;
    //console.log(this);
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
      this.getItemCreate(msg.createItem);
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
          if (obj.name == msgTo){//console.log(obj.name)
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
    if (this.action == 'watch')
      this.watch();
    if (this.action == 'unequip all item')
      this.unequipItems();
    if (this.action == 'go')
      this.goAction();
  }

  goAction(){
    this.by.goToRoom(this.to,this.by);
  }
  taunt(taux){//like threaten
    if(this.to.type == 2)
      this.by.reputation -= taux;
    if(this.to.type == 3)
      this.by.agressivity += taux;
    this.AllRooms.sendOneClientInfoRoom(this.room,'You taunt '+this.to.name,this.by);
    if(this.to.type == 1)
      this.AllRooms.sendOneClientInfoRoom(this.room,this.to.name+' try to taunt you ',this.to);
  }

  charm(taux){//like threaten
    if(this.to.type == 2)
      this.by.reputation += taux;
    if(this.to.type == 3)
      this.by.agressivity -= taux;
    this.AllRooms.sendOneClientInfoRoom(this.room,'You charmed '+this.to.name,this.by);
    if(this.to.type == 1)
      this.AllRooms.sendOneClientInfoRoom(this.room,this.to.name+' try to charm you ',this.to);
  }

  trade(){
    if(this.to.type == 2){//pnj

      var toItems = this.AllRooms.getItemsAleatoire(this.byItems);
      toItems.owner = this.by;

      this.by.items.push(toItems);
      delete this.by.items[this.byItems];
      this.AllRooms.sendRoom(this.by.room);
      this.AllRooms.sendOneClientInfoRoom(this.room,'Vous avez échanger '+this.byItems+' à '+this.to.name+' en échange de '+toItems,this.by);
      this.AllRooms.sendAllClientRoom(this.room);
    }
  }

  give(){
    this.byItems = new Items(this.AllRooms,this.byItems);
    this.byItems.owner = this.to;

    this.to.items.push(this.byItems);
    delete this.by.items[this.byItems];
    this.by.nbrItems -= 1;
    this.AllRooms.sendOneClientInfoRoom(this.room,'Vous avez donnez '+this.byItems+' à '+this.to.name,this.by);
    if(this.to.type == 1)
      this.AllRooms.sendOneClientInfoRoom(this.room,'Vous avez reçu '+this.toItems+' de '+this.to.name,this.to);
    //penser a retirer l'objet côter client
  }
  byItemEquipedStats(){
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
  toItemEquipedStats(){
    if (this.by.itemEquip1){
      this.hpEquipedTo += this.by.itemEquip1.dext;
      this.forceEquipedTo += this.by.itemEquip1.force;
      this.dextEquipedTo += this.by.itemEquip1.dext;
      this.chanceEquipedTo += this.by.itemEquip1.chance;
      this.charmeEquipedTo += this.by.itemEquip1.charme;
    }
    if (this.by.itemEquip2){
      this.hpEquipedTo += this.by.itemEquip2.dext;
      this.forceEquipedTo += this.by.itemEquip2.force;
      this.dextEquipedTo += this.by.itemEquip2.dext;
      this.chanceEquipedTo += this.by.itemEquip2.chance;
      this.charmeEquipedTo += this.by.itemEquip2.charme;
    }
    if (this.by.itemEquip3){
      this.hpEquipedTo += this.by.itemEquip3.dext;
      this.forceEquipedTo += this.by.itemEquip3.force;
      this.dextEquipedTo += this.by.itemEquip3.dext;
      this.chanceEquipedTo += this.by.itemEquip3.chance;
      this.charmeEquipedTo += this.by.itemEquip3.charme;
    }
  }

  attack(){
    //var AllRooms = Object.assign(new room(),this.AllRooms);
    if (this.to){
      this.byItemEquipedStats();
      this.toItemEquipedStats();
      if ((this.by.dext+this.dextEquipedBy+this.chanceEquipedBy)*(Math.random()*10) > (this.to.dext+this.dextEquipedTo+this.chanceEquipedTo)*(Math.random()*10)){
        this.to.hp -= this.by.force+this.forceEquipedBy;
        if (this.to.hp <= 0){
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
          this.AllRooms.sendOneClientInfoRoom(this.room,'Réussite de l\'attaque, vous enlevé '+this.by.force+' à '+nameCible+' et votre cible a était vaincu',this.by);
          this.AllRooms.sendAllClientRoom(this.room);
          this.AllRooms.sendAllClientInfoRoom(this.room,this.by+' à éliminer '+nameCible);
        }else{
          if(this.to.type == 1){
            this.AllRooms.sendOneClientInfoRoom(this.room,this.by.name+' vous attaque et vous enlève '+this.by.force,this.to);
          }
          this.AllRooms.sendOneClientInfoRoom(this.room,'Réussite de l\'attaque, vous enlevé '+this.by.force+' à '+this.to.name,this.by) ;
        }
      }else{
        this.AllRooms.sendOneClientInfoRoom(this.room,'echec de l\'attaque',this.by);
        if(this.to.type == 1){
          this.AllRooms.sendOneClientInfoRoom(this.room,this.by.name+' vous attaque, mais vous esquivez ',this.by);
        }
      }
    }else{
      this.AllRooms.sendAllClientRoom(this.room);
    }
  }


  skill(skill){
    //var AllRooms = Object.assign(new room(),this.AllRooms);
    if (this.to){
      this.byItemEquipedStats();
      this.toItemEquipedStats();
      if ((this.by.dext+this.dextEquipedBy+this.chanceEquipedBy)*(Math.random()*10) > (this.to.dext+this.dextEquipedTo+this.chanceEquipedTo)*(Math.random()*10)){
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
          this.AllRooms.sendOneClientInfoRoom(this.room,'Réussite de la compétence, votre cible a était vaincu',this.by);
          this.AllRooms.sendAllClientRoom(this.room);
          this.AllRooms.sendAllClientInfoRoom(this.room,this.by+' à éliminer '+nameCible);
        }else{
          if(this.to.type == 1){
            this.AllRooms.sendOneClientInfoRoom(this.room,this.by.name+' vous attaque et vos statistiques ont était modifié : Points de vies {'+this.to.hp+' / '+this.to.hpmax+'} , force {'+this.to.hp+' / '+this.to.hpmax+'} , force {'+this.to.force+' / '+this.to.forcemax+'} , charme {'+this.to.charme+' / '+this.to.charmemax+'} , chance {'+this.to.chance+' / '+this.to.chancemax+'}',this.to);
          }
          this.AllRooms.sendOneClientInfoRoom(this.room,'Réussite de l\'attaque, les statistiques de '+this.to.name+' ont était modifié : Points de vies {'+this.to.hp+' / '+this.to.hpmax+'} , force {'+this.to.hp+' / '+this.to.hpmax+'} , force {'+this.to.force+' / '+this.to.forcemax+'} , charme {'+this.to.charme+' / '+this.to.charmemax+'} , chance {'+this.to.chance+' / '+this.to.chancemax+'}',this.by) ;
        }
      }else{
        this.AllRooms.sendOneClientInfoRoom(this.room,'echec de l\'attaque',this.by);
        if(this.to.type == 1){
          this.AllRooms.sendOneClientInfoRoom(this.room,this.by.name+' vous attaque, mais vous esquivez ',this.by);
        }
      }
    }else{
      this.AllRooms.sendAllClientRoom(this.room);
    }
  }

  watch(){
    if (this.to.description != ''){
      this.AllRooms.sendOneClientInfoRoom(this.room,this.to.description,this.by) ;
    }else{
      this.AllRooms.sendOneClientInfoRoom(this.room,'Nothing to watch',this.by);
    }
  }

  describe(){
    this.to.description = this.byItems;
    this.AllRooms.sendOneClientInfoRoom(this.room,this.to.description,this.by);
  }

  forge(){
    if (!this.AllRooms.savedNameItems.includes(this.itemName)){
      new Items(this.AllRooms,this.itemName,this.itemHp,this.itemForce,this.itemDext,this.itemChance,this.itemCharme,this.itemTime,this.itemType,this.by);
      this.AllRooms.sendOneClientInfoRoom(this.room,'You have created '+this.itemName,this.by);
      this.AllRooms.sendOneClientRoom(this.room,this.by);
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
    if(this.byItems.type == 1){
      this.to.hp += this.byItems.hp;
      this.to.force += this.byItems.force;
      this.to.dext += this.byItems.dext;
      this.to.chance += this.byItems.chance;
      this.to.charme += this.byItems.charme;
      this.to.timeConso += this.time;
      this.to.dateLastConso = Date.now();
      this.AllRooms.sendOneClientRoom(this.room,this.by);
    }
  }

  equipItems(){
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

  unequipItems(){
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


module.exports = Action;