var express = require('express'),
    app = express(),
    winston = require('winston'),
    bodyParser = require('body-parser'),
    Store = require('./lib/store');

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

var router = express.Router();
var url = 'mongodb://' + process.env.MONGO_HOST + '/thing';
var store = new Store(url);

app.use(bodyParser.text({type : 'text/*', limit: '1024kb'}));
app.use(bodyParser.text({type : 'application/xml', limit: '1024kb'}));
app.use(bodyParser.json({limit: '1024kb'}));

router.use(function(req, res, next) {
    logger.log('info', '%s %s', req.method, req.url);
    next();
});

app.use('/', router);

app.get('*', function (req, res) {
    store.get(req.url, function(err, result) {
        if (!err) {
            // set content type header of response
            logger.log('info', result);
            res.send(result.doc);
        } else {
            res.status(404).send(req.url + ' not found');
        }
    });
});

app.put('*', function (req, res) {
    store.add(
        {doc: req.body,
         type: req.headers['content-type'],
         url: req.url},
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
