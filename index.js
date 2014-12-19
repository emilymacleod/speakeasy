/**
 * Created by emilymacleod on 2014-11-24.
 */
var name = "";
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Sequelize = require('sequelize');
var sequelize = new Sequelize('speakeasy', 'emilymacleod', '', {
        dialect: "postgres", // or 'sqlite', 'postgres', 'mariadb'
        port:    5432, // or 5432 (for postgres)
    });

sequelize
    .authenticate()
    .complete(function(err) {
        if (err) {
            console.log('Unable to connect to the database:', err)
        } else {
            console.log('Connection has been established successfully.')
        }
    });



var userCount = 0;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
});

app.use("/style.css", express.static(__dirname + '/style.css'));

app.use("/script.js", express.static(__dirname + '/script.js'));
app.use(express.static(__dirname + '/public/'));


io.on('connection', function(socket){
    userCount = userCount+1;
    socket.on('newClip', function(newClip){
            console.log('newClip',newClip);
            var clip = sequelize.define('clips', {
                clipid: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
                title: Sequelize.STRING,
                description: Sequelize.STRING,
                content: Sequelize.STRING,
                userid: Sequelize.INTEGER

            },
                {
                    timestamps: false
                });
            newClip.id=0;
            return sequelize.sync().then(function() {
                return clip.create(/*{
                 title: title,
                 description: description,
                 content: content,
                 user_id: 1
                 }*/ newClip);
            });
        }
    );
    socket.on('disconnect', function(){
        userCount = userCount-1;
        //console.log('a user disconnected','there are now',userCount,"users online");
    });
});

http.listen(3008, function(){
    console.log('listening on *:3008');
});