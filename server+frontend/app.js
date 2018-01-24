var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var ipfsAPI = require('ipfs-api')
var multer = require('multer');

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

// connect to ipfs daemon API server
var ipfs = ipfsAPI('localhost', '5001', { protocol: 'http' })

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//dummy default image
//store in mem for now, but this server should be stateless. 
var currHash = "QmVju7FfeucrNEzamVjzXGUW4WZeFLaAsjeKtP2Dthi62y"

app.get('/getCurr', function (req, res, next) {
  //get curr picture from IPFS
  ipfs.files.cat(currHash).then(resp => {
    res.send({ hash: currHash, pic: resp })
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
    currHash=resp[0].hash
    res.send({"newhash": resp[0].hash})
  }).catch(err=>{
    console.log(err)
    res.send(err)
  })
})

app.listen(3000, function () {
  console.log('ETHScreen server Listening on port 3000.');
});

module.exports = app;
