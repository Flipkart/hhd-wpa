var fs = require('fs')
var express = require('express')
var app = express()
var https = require('http')
var https = require('https')
require('html')

var options = {
  key:fs.readFileSync('server.key'),
  cert:fs.readFileSync('server.crt'),
  ca:[fs.readFileSync('ca.crt')],
  requestCert:true,
  rejectUnauthorized:false,
  passphrase: 'Rash1410',
  agent: false
};

var index = fs.readFileSync('./app/index.html');

app.set('port', process.env.PORT || 3141)
app.set('views', __dirname + '/app')
app.set('view engine', 'html')

app.use(express.static(__dirname + '/app'))

app.get('/*', function(req, res) {
  console.log(" ============ Request handler random was called.====== " + req.path);
  var urlSections = req.path.split('/');
  console.log("*********** " + urlSections + '::' + (urlSections[1] == 'tote') + ':' + urlSections[1])
  if (urlSections[1] == 'tote') {
    console.log(" ============ TOTE = " + urlSections[2]);
    res.setHeader("Content-Type", "application/json");

    var toteJson = require('./totes/tote.json')
    console.log(JSON.stringify(toteJson));
    res.json(toteJson);

  }else if (urlSections[1] == null || urlSections[1] == '') {
    res.render(index);
  }
});

https.createServer(options,app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});

//https.createServer(options, app).listen(4001, function () {
//  console.log('Started!');
//  console.log("Express server listening on port 4001 in %s mode", app.settings.env)
//});

//app.listen(app.get('port'), function(){
//  console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env)
//})
