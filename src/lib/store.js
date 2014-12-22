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
     this.exec(function(err, db, collection) {
        if (!err) {
            collection.findOne({url: url}, function (err, result) {
                if (!err && result) {
                    console.log('info: Retrieved document.');
                } else {
                    console.log('error: No document found.');
                    err = err ? err : 'not found';
                }
                db.close();
                callback(err, result);
            });
        } else {
            callback(err, null);
        }
     });
};

Store.prototype.add = function(doc, callback) {
     this.exec(function(err, db, collection) {
        if (!err) {
            collection.insert(doc, function (err, result) {
                if (!err) {
                    console.log('info: Inserted document.');
                } else {
                    console.log('error: Document insert failed.');
                }
                db.close();
                callback(err, result);
            });
        } else {
            callback(err, null);
        }
     });
};

Store.prototype.exec = function(func) {
    var store = this;
    MongoClient.connect(this.url, function(err, db) {
        if (!err) {
            console.log('info: Connected to server at ' + store.url);
            func(null, db, db.collection(store.collection));
        } else {
            console.log('error: Connect to server failed at ' + store.url);
            func(err, null, null);
        }
    });
};
