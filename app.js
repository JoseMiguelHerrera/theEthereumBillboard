var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var ipfsAPI = require('ipfs-api')
var multer = require('multer');

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

// connect to ipfs daemon API server (18.217.97.201 is on AWS)
//degreesofsound.com ----> 18.217.97.201
var ipfs = ipfsAPI('18.217.97.201', '5002', { protocol: 'http' })

var app = express();
var ipfstimeout = 10;

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '/public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/getIpfsObject', function (req, res, next) {
  console.log("rquesting object from IPFS. Will look for 10s, then timeout");
  var response = false;

  setTimeout(() => {
    if (!response){
      console.log("ipfs timout in object retrival")
      res.send({error:"ipfs timout retrival"});
    }
  }, ipfstimeout * 1000)

  //get curr picture from IPFS
  ipfs.files.cat(req.body.ipfsHash).then(resp => {
    response = true;
    console.log("sent current pic data")
    res.send({ pic: resp })
  }).catch(err => {
    response = true;
    console.log("error from IPFS API")
    console.log(err)
    res.send(err)
  })
})


app.post('/changePicture', upload.single('image'), function (req, res, next) {
  console.log("changing pic")
  ipfs.files.add(req.file.buffer).then(resp => {
    console.log(resp)
    res.send({ "newhash": resp[0].hash })
  }).catch(err => {
    console.log(err)
    res.send(err)
  })
})

app.listen(3000, function () {
  console.log('bitcreen server Listening on port 3000.');
});

module.exports = app;
