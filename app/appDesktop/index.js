var express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
var app = express();
const fs = require('fs');
const req = require('express/lib/request');

app.use(express.static('public'));
app.use('/commonAssets',express.static('../commonAssets'));
app.use(bodyParser.text());

app.get('/', function(req, res){
   res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/projectList', function (req, res) {

  var projectListArray = [];
  
  fs.readdir(path.join(__dirname, 'public/projects'), (err, files) => {
    files.forEach(file => {
      if (file.substr(file.indexOf('.')) == '.css' || file.substr(file.indexOf('.')) == '.js')
        return;
      var index = file.indexOf('-');
      var data = {
        projectNumber: file.slice(0,index),
        projectName: file.slice(index+1,file.length-(index+4))
      };
      projectListArray.push(data);
    });
    res.json(projectListArray);
  });

});

app.get('/musicList', function (req, res) {
	var musicListArray = [];
	fs.readdir(path.join(__dirname, '../commonAssets/music'), (err, files) => {
    files.forEach(file => {
      musicListArray.push(file);
    });
    res.json(musicListArray);
  });
});

app.get('/notesMessagesGet', function (req, res) {
  fs.readFile('../commonAssets/notesMessages.txt', 'utf8', (err, data) => {
    if (err) {
      return;
    }
    res.end(data);
  });
});

app.post('/notesMessages', function(req, res){
  let nameAndMessage = req.body.split(":");
  if(nameAndMessage.length != 2 || nameAndMessage[0] === '' || nameAndMessage[1] === '' || nameAndMessage[0].length > 30 || nameAndMessage[1].length>500){
    return;
  }
  fs.writeFile(path.join(__dirname, '../commonAssets/notesMessages.txt'), nameAndMessage[0]+':'+nameAndMessage[1] + '\n', { flag: 'a+' } , err => {
    if (err) {
      //
      return
    }
    //file written successfully
  })
  res.end('ok');
});

app.listen(3000);