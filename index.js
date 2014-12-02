/**
 * Created by emilymacleod on 2014-11-24.
 */
var name = "";
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require("redis");
client = redis.createClient();

var userCount = 0;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
});

app.use("/style.css", express.static(__dirname + '/style.css'));

app.use("/script.js", express.static(__dirname + '/script.js'));
app.use(express.static(__dirname + '/public/'));

client.on("error", function (err) {
    console.log("Error " + err);
});

client.set("app name", "speakeasy", redis.print);

io.on('connection', function(socket){
    var room =  ' ';
    socket.join(room);
    userCount = userCount+1;
    console.log('a user connected','there are now ' + userCount + " users online");
    socket.on('person', function(msg){

        console.log('person: ' + msg);
        socket.broadcast.emit('person', msg);
    });

    client.get('app name', function(err, reply) {
        if(err) {console.log(err)};
        console.log('app name is', reply);
    });

    socket.on('disconnect', function(){
        userCount = userCount-1;
        console.log('a user disconnected','there are now',userCount,"users online");
    });
});

http.listen(3008, function(){
    console.log('listening on *:3008');
});
