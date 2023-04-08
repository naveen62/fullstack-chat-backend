class User {
    constructor() {
        this.users = []
    }

    addUser(name,id) {
        this.users.push({
            name,
            id,
            curGroup:''
        })
    }
    getUsers() {
        return this.users;
    }
    removeUser(id) {
        const len = this.users.length;
        this.users = this.users.filter((user) => user.id !== id);
        return len === this.users.length;
    }
    userExists(name) {
        return this.users.find((user) => user.name === name);
    }
    replaceId(name,id) {
        this.users = this.users.map((user) => {
            if(user.name === name) {
                return {
                    ...user,
                    id
                }
            } else {
                return user
            }
        });
    }
}

module.exports = User;