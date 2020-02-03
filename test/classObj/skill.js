class Skill{
    constructor(AllRooms,name,hp,force,dext,chance,charme,time,type,owner){
      this.AllRooms = AllRooms;
      this.name = name;
      this.hp = hp;
      this.force = force;
      this.dext = dext;
      this.chance = chance;
      this.charme = charme;
      this.time = time;
      //this.type = type;//1 = consomable,2 = constant
      this.owner = owner;
      //this.level = this.getLevelItems();
      this.savedSkill();
      this.AllRooms.addNameSkill(name);
    }

    
  }