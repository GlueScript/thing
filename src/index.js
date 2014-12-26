var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    logger = require('./lib/logger'),
    Store = require('./lib/store');

var router = express.Router();
var store = new Store(
    'mongodb://' + process.env.MONGO_HOST + '/' + process.env.MONGO_DB,
    'thing');

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
            logger.log('info', result);
            res.set({'Content-Type': result.type});
            res.set({'Content-Language': result.lang});
            res.send(result.body);
        } else {
            res.set({'Content-Type': 'text/plain'});
            res.set({'Content-Language': 'en'});
            res.status(404).send(req.url + ' not found');
        }
    });
});

app.put('*', function (req, res) {
    // add should overwrite existing documents for this url
    store.add(
        {body: req.body,
         type: req.headers['content-type'],
         lang: req.headers['content-language'] || 'en',
         url: req.url},
        function (err, result) {
            if (!err) {
                res.json(result);
            } else {
                res.status(500).json({error: err});
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
