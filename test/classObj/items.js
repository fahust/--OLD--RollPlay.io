


function entierAleatoire(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Items{
  constructor(AllRooms,name,hp,force,dext,chance,charme,time,type,owner){
    this.AllRooms = AllRooms;
    this.name = name;
    this.hp = hp;
    this.force = force;
    this.dext = dext;
    this.chance = chance;
    this.charme = charme;
    this.time = time;
    this.type = type;//1 = consomable,2 = constant
    this.owner = owner;
    this.level = this.getLevelItems();
    this.savedItems();
    this.AllRooms.addNameItems(name);
  }
  /** check if ressource is bigger than level items forged */
  static forgeItems(by,items){
    if (by.ressource >= items.level){
      by.ressource -= items.level;
      by.items.push(items);
    }
  }
  /** get the level of items as characteristics */
  getLevelItems(){
    this.level = 0;
    this.level += this.hp;
    this.level += this.force;
    this.level += this.dext;
    this.level += this.chance;
    this.level += this.charme;
    this.level += this.time/100;
  }
  /** Check if items exist, And add them if not exist */
  savedItems(){
    var exist = false;
    this.AllRooms.savedItems.forEach(element => {
      if (element.name == this.name /*&& element.hp == this.hp && element.force == this.force && element.dext == this.dext && element.chance == this.chance && element.charme == this.charme && element.time == this.time && element.type == this.type*/){
        exist = true;
      }
    });
    if (exist == false){
      var cachedAllRooms = this.AllRooms;
      var cachedOwner = this.owner;
      this.AllRooms = [];
      this.owner = [];
      cachedAllRooms.savedItems.push(this);
      this.AllRooms = cachedAllRooms;
      this.owner = cachedOwner;
    }
  }
  /** give name to object created by player */
  namedObject(name){
    if (name.length > 2 && name.length < 20)
      return true;
    return false;
    //minimum maximum character
  }
  /** send info on object created by player for player judge and give name after */
  sendInfoOnItem(){
      
  }


  equipItems(){//équipe l'objet constant
        
  }

  unequipItems(){//remet dans le sac l'objet constant
        
  }
  


}

module.exports = Items;