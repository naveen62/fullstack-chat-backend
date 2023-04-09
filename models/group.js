class Group {
    constructor() {
        this.groups = [];
        this.joinTrack = [];
        this.joinCount = {};
    }

    addGroup(name) {
        this.groups.push(name);
        this.joinCount[name] = 0;
    };

    groupList() {
        return this.groups;
    }
    groupExists(name) {
        return this.groups.find((group) => group === name);
    }
    joinUser(name,id) {
        this.joinTrack.push({
            groupName:name,
            userId:id
        })
        if(this.joinCount[name]) {
            this.joinCount[name] = this.joinCount[name] + 1;
        } else {
            this.joinCount[name] = 1;
        }
        return this.joinCount[name];
    }
    getJoinedCount() {
        return this.joinCount
    }
    leaveUser(name,id) {
        this.joinTrack = this.joinTrack.filter((item) => item.userId !== id);
        this.joinCount[name] = this.joinCount[name] - 1;
        return this.joinCount[name];
    }
    disconnectedUser(id) {
        let users = this.joinTrack.filter((item) => item.userId === id);
        this.joinTrack = this.joinTrack.filter((item) => item.userId !== id)
        if(users[0]) {
            const count = this.leaveUser(users[0].groupName,id);
            return {
                count,
                group:users[0].groupName
            }
        } 
        return {};
    }
}
module.exports = Group; 