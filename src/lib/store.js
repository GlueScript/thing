var MongoClient = require('mongodb').MongoClient;

// set the db name from an env var too eg. MONGO_DB
var url = 'mongodb://' + process.env.MONGO_HOST + '/thing';

/*
 * Provides access to 'things'
 */
exports.add = function(doc, callback) {
     exec('insert', doc, callback);
};

exec = function(cmd, doc, callback) {
    MongoClient.connect(url, function(err, db) {
        var result = '';
        if (!err) {
            console.log('info: Connected correctly to server. ' + url);
            var collection = db.collection('thing');
            // perform cmd
            if (cmd === 'insert') {
                collection.insert(doc, function (err, result) {
                    if (!err) {
                        console.log('info: Inserted document.');
                    } else {
                        console.log('error: Document insert failed.');
                    }
                    db.close();
                    callback(err, result);
                });
            }
        } else {
            console.log('error: Connect to server failed. ' + url);
            callback(err, result);
        }
    });
};
