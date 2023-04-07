class Group {
    constructor() {
        this.groups = [];
    }

    addGroup(name) {
        this.groups.push(name)
    };

    groupList() {
        return this.groups;
    }
    groupExists(name) {
        return this.groups.find((group) => group === name);
    }
}
module.exports = Group; 