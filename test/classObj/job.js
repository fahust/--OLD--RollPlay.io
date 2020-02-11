class Jobs{
  constructor() {
    this.jobs;
    this.possibleJob();
    this.jobNow;
    this.jobLvlNow;
  }

  possibleJob(){
    this.jobs['Trader'];//
    this.jobs['Farmer'];//bonus de farm
    this.jobs['Armurier'];
    this.jobs['Bounty hunter'];//gagne de la réputation quand il tue des des joueur a reputation negative
    this.jobs['Explorer'];
    this.jobs['Bouffon'];
    this.jobs['Cartographe'];
    this.jobs['Charpentier'];//Bonus de construction de batiment
    this.jobs['Diplomate'];//
    this.jobs['Blacksmith'];//bonus de forge d'arme
    this.jobs['Locksmith'];//vitale pour ouvrir certaines zone et les fermer
    this.jobs['Alchemist'];//bonus de fabrication de potion
    this.jobs['Thief'];//rajouter action vol
    this.jobs['Wizard'];//créer des skill et les apprend au autres joueur

    this.jobs['Scribe'];//créer des skill et les apprend au autres joueur

    this.jobs['Vilain'];//
    this.jobs['Dark Knight'];//
    this.jobs['Master of Vilain'];//fais apparaitre des démons//avoir monter les échellon pour en arriver si haut

    this.jobs['Guardians'];//protège les pnj et joueur
    this.jobs['Knight'];//
    this.jobs['Master of guardians'];//fais apparaitre des démons//avoir monter les échellon pour en arriver si haut

  }
}


module.exports = Jobs;