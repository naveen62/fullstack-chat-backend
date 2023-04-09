const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const Group = require('./models/group');
const User = require('./models/user');
const { generateMessage } = require('./utils/utils');
const io = new Server(server,{
    cors:{
        origin:'http://localhost:3000'
    }
});

// models
const group = new Group();
const user = new User();

io.on('connection',(socket) => {

    socket.on('joinGroup',(joinGroup,callback) => {
        if(group.groupExists(joinGroup)) {
            socket.join(joinGroup);
            const onlineCount = group.joinUser(joinGroup,socket.id);
            io.emit('userJoinedGroup',{
                group:joinGroup,
                online:onlineCount
            });
        }
    })
    socket.on('leaveGroup',(joinGroup,callback) => {
        if(group.groupExists(joinGroup)) {
            socket.leave(joinGroup);
            const onlineCount = group.leaveUser(joinGroup,socket.id);
            io.emit('userLeftGroup',{
                group:joinGroup,
                online:onlineCount
            });
            callback();
        }
    })
    socket.on('checkUsername',(username,callback) => {
        if(user.userExists(username)) {
            return callback(true)
        }
        callback(false,username);
    })  

    socket.on('join',(username,callback) => {
        // const groupList = group.groupList();
        // groupList.forEach((group) => {
        //     socket.join(group);
        // })
        if(!user.userExists(username)) {
            user.addUser(username,socket.id);
        } else {
            user.replaceId(username,socket.id)
        }
        callback('User joined to groups')
    })

    socket.on('getGroupsList',(data,callback) => {
        socket.emit('sendGroupList',{
            groups:group.groupList(),
            joinedCounts:group.getJoinedCount()
        });
    })

    socket.on('createGroup',(newGroup,callback) => {
        if(!group.groupExists(newGroup)) {
            group.addGroup(newGroup)
            const connectedIds = user.getUsers().map(user => user.id);
            io.to(connectedIds).emit('groupCreated',newGroup);
            // socket.emit('groupCreated',newGroup);
        } else {
            callback('Group already exists, Try with different name')
        }
    })

    socket.on('joinCreatedGroup',(createdGroup,callback) => {
        if(group.groupExists(createdGroup)) {
            // socket.join(createdGroup);
            callback(false)
        } else {
            callback(true)
        }
    })

    socket.on('newMessage',(message,callback) => {
        if(group.groupExists(message.group)) {
            return io.emit('newMessage', generateMessage(message.username,message.message,message.group))
        }
    })

    socket.on('disconnect', () => {
        const disconnectedUser = group.disconnectedUser(socket.id);
        user.removeUser(socket.id);
        if((disconnectedUser.count || disconnectedUser.count === 0) && disconnectedUser.group) {
            socket.leave(disconnectedUser.group);
            io.emit('userLeftGroup',{
                group:disconnectedUser.group,
                online:disconnectedUser.count
            });
        }
    })
})

server.listen(5000,() => {
    console.log('Server is running');
})