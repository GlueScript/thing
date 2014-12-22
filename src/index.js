var app = require('express')(),
    winston = require('winston'),
    bodyParser = require('body-parser'),
    filter = require('./lib/filter');

/*
* Get winston to log uncaught exceptions and to not exit
*/
var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      handleExceptions: true
    })
  ],
  exitOnError: false
});

app.use(bodyParser.text({type : 'text/*', limit: '1024kb'}));
app.use(bodyParser.text({type : 'application/xml', limit: '1024kb'}));
app.use(bodyParser.json({limit: '1024kb'}));

app.get('/', function (req, res) {
});

app.put('/', function (req, res) {
});

app.post('/', function(req, res) {
});

app.delete('/', function(req, res) {
});

var PORT = process.env.PORT || 80;
app.listen(PORT);
logger.log('info', 'Running things service on http://localhost:' + PORT);
