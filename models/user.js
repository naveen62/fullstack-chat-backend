class User {
    constructor() {
        this.user = []
    }

    addUser(name,id) {
        this.user.push({
            name,
            id,
            curGroup:''
        })
    }
    getUsers() {
        return this.user;
    }
}

module.exports = User;