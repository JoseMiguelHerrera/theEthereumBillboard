var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var ipfsAPI = require('ipfs-api')
var multer = require('multer');

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

var ipfs = ipfsAPI('18.217.97.201', '5002', { protocol: 'http' })

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://jmhm2012:'+process.env.mongopw+'@bitscreencluster0-hjfiy.mongodb.net/test';
const collectionName = "stuntData";
var stuntDB;


//db init
MongoClient.connect(url, function (err, client) {
  if (err) {
    console.log(err)
  } else {
    console.log("mongodb connected")
    stuntDB = client.db("stunt")
    stuntDB.createCollection(collectionName, function (err, res) {
      if (err) {
        console.log("error creating the mongoDb collection")
        console.log(err)
      } else {
        console.log("stuntData collection guaranteed to exist");
        stuntDB.collection(collectionName).find({}).toArray(function (err, collectionResult) {
          if (err) {
            console.log("error creating the mongoDb collection")
            console.log(err)
          } else {
            if (collectionResult.length === 0) {
              stuntDB.collection(collectionName).insertOne({ views: 0 }, function (err, insertResult) {
                if (err) {
                  console.log("error inserting")
                  console.log(err)
                } else {
                  console.log("insert occurred")
                }
              });
            }
          }
        });
      }
    });
  }
});

app.use(favicon(path.join(__dirname, '/public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//need to try experiment where only the hash is passed
app.post('/changePicture', upload.single('image'), function (req, res, next) {
  let picSizeMB = req.file.buffer.byteLength / 1000000
  if (picSizeMB > 3) {
    console.log("picture too large to add!")
    res.send({ err: "picture should be 3mb or smaller" })
  } else {
    ipfs.files.add(req.file.buffer).then(resp => {
      console.log(resp)
      res.send({ "newhash": resp[0].hash })
    }).catch(err => {
      console.log(err)
      res.send(err)
    })
  }
})

//handle new views writing 
io.on('connection', function (socket) {
  var collection=stuntDB.collection(collectionName)
  collection.find({}).toArray(function (err, findResult) {
    if(err){
      console.log(err)
    }else{
      var newViews=findResult[0].views+1;
      var id=findResult[0]._id;
      //update doc
      collection.updateOne({ "_id" : id },{ $set: { "views" : newViews}})
      socket.emit('viewcount', { viewcount: newViews });
      socket.broadcast.emit('viewcount', { viewcount: newViews });
      console.log("views: "+newViews)
    }
  })
  socket.on('disconnect', function () { });
});



//this would work if we were able to use the IPFS API to pin! It's a WIP feature for them...
/*
app.post("/pin",function(req,res){
  let picSizeMB=req.body[0].size/1000000
  let picHash=req.body[0].hash;
  if(picSizeMB>4){
    console.log("picture too large to pin!")
    res.send({err: "picture should be 4mb or smaller"})
  }else{
    ipfs.pin.add(picHash,(err, resp)=>{
      if(err){
        console.log("error pinning")
        console.log(err)
        res.send({err: err})
      }else{
        res.send({resp: resp})
      }
    })
  }
})
*/

/*
var listener=server.listen(process.env.PORT || 3000, function () {
  console.log('bitcreen server Listening on port '+listener.address().port);
});
*/

module.exports = app;
