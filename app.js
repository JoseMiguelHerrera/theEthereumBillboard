var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var ipfsAPI = require('ipfs-api')
var multer = require('multer');

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

var ipfs = ipfsAPI('18.217.97.201', '5002', { protocol: 'http' })

var app = express();
var ipfstimeout = 10;

// uncomment after placing your favicon in /public
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

app.listen(3000, function () {
  console.log('bitcreen server Listening on port 3000.');
});

module.exports = app;
