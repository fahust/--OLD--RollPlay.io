class oneRoom{
    constructor(danger,name,description = '',owner = '') {
        this.danger = danger;
        this.name = name;
        this.description = description;
        this.owner = owner;
        this.object = [];
    }

}

module.exports = oneRoom;