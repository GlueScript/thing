var express = require('express'),
    app = express(),
    winston = require('winston'),
    bodyParser = require('body-parser'),
    store = require('./lib/store');

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

var router = express.Router();

router.use(function(req, res, next) {
    console.log('%s %s %s', req.method, req.url, req.path);
    next();
});

app.use('/', router);

app.get('*', function (req, res) {
});

app.put('*', function (req, res) {
    store.add(
        {doc: req.body,
         type: req.headers['content-type'],
         path: req.path},
        function (err, result) {
            if (!err) {
                res.json(result);
            } else {
                res.status(500).send({error: err});
            }
        }
    );
});

app.post('*', function(req, res) {
});

app.delete('*', function(req, res) {
});

var PORT = process.env.PORT || 80;
app.listen(PORT);
logger.log('info', 'Running thing service on http://localhost:' + PORT);
