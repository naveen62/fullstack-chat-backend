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

    socket.on('join',(username,callback) => {
        const groupList = group.groupList();
        groupList.forEach((group) => {
            socket.join(group);
        })
        user.addUser(username,socket.id);
        callback('User joined to groups')
    })

    socket.on('getGroupsList',(data,callback) => {
        socket.emit('sendGroupList',group.groupList());
    })

    socket.on('createGroup',(newGroup,callback) => {
        if(!group.groupExists(newGroup)) {
            group.addGroup(newGroup)
            const connectedIds = user.getUsers().map(user => user.id);
            console.log(connectedIds);
            io.to(connectedIds).emit('groupCreated',newGroup);
            // socket.emit('groupCreated',newGroup);
        } else {
            callback('Group already exists, Try with different name')
        }
    })

    socket.on('joinCreatedGroup',(createdGroup,callback) => {
        if(group.groupExists(createdGroup)) {
            socket.join(createdGroup);
            callback(false)
        } else {
            callback(true)
        }
    })

    socket.on('newMessage',(message,callback) => {
        console.log(message);
        if(group.groupExists(message.group)) {
            return io.to(message.group).emit('newMessage', generateMessage(message.username,message.message,message.group))
        }
    })
})

server.listen(5000,() => {
    console.log('Server is running');
})