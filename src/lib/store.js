var MongoClient = require('mongodb').MongoClient;

// set the db name from an env var too eg. MONGO_DB
//var url = 'mongodb://' + process.env.MONGO_HOST + '/thing';

/*
 * Provides access to 'things'
 */
function Store(url) {
    this.url = url;
    this.collection = 'thing';
};

module.exports = Store;

Store.prototype.get = function(url, callback) {
     this.exec('get', callback, url);
};

Store.prototype.add = function(doc, callback) {
     this.exec('insert', doc, callback);
};

Store.prototype.exec = function(cmd, callback, param) {
    var store = this;
    MongoClient.connect(this.url, function(err, db) {
        var result = '';
        if (!err) {
            console.log('info: Connected correctly to server. ' + store.url);
            var collection = db.collection(store.collection);
            // perform cmd - pass a function to exec not a string command
            if (cmd === 'insert') {
                collection.insert(param, function (err, result) {
                    if (!err) {
                        console.log('info: Inserted document.');
                    } else {
                        console.log('error: Document insert failed.');
                    }
                    db.close();
                    callback(err, result);
                });
            } else if (cmd === 'get') {
                collection.findOne({url: param}, function (err, result) {
                    if (!err && result) {
                        console.log('info: Retrieved document.');
                    } else {
                        console.log('error: No document found.');
                        err = err ? err : 'not found';
                    }
                    db.close();
                    callback(err, result);
                });
            }
        } else {
            console.log('error: Connect to server failed. ' + store.url);
            callback(err, result);
        }
    });
};
