var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var ipfsAPI = require('ipfs-api')
var multer = require('multer');

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

// connect to ipfs daemon API server (18.217.97.201 is on AWS)
var ipfs = ipfsAPI('18.217.97.201', '5001', { protocol: 'http' })

var app = express();

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '/public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/getIpfsObject', function (req, res, next) {
  //get curr picture from IPFS
  ipfs.files.cat(req.body.ipfsHash).then(resp => {
    res.send({pic: resp })
    console.log("sent current pic data")
  }).catch(err => {
    console.log(err)
    res.send(err)
  })
})


app.post('/changePicture', upload.single('image'), function (req, res, next) {
  console.log("changing pic")
  ipfs.files.add(req.file.buffer).then(resp=>{
    console.log(resp)
    res.send({"newhash": resp[0].hash})
  }).catch(err=>{
    console.log(err)
    res.send(err)
  })
})

app.listen(3000, function () {
  console.log('bitcreen server Listening on port 3000.');
});

module.exports = app;
