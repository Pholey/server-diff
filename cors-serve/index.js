var express = require('express');
var request = require('request');
var cors = require("cors");
var app = express();


app.use(cors());

const serviceAPIToken = ""
const secretKey = ""

app.use('/', function(req, res) {

  var url = req.url.slice(1);
  const opts = {
    url,
    headers: {
      "Authorization": 'Token token="' + serviceAPIToken + secretKey + '"',
    }
  };

  console.log("Piping request to ", opts.url);
  req.pipe(request(opts)).pipe(res);
});

const port = process.env.PORT || 3000
console.log(`Listening on localhost:${port}`)
app.listen(port);
