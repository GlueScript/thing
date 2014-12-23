var MongoClient = require('mongodb').MongoClient;

/*
 * Provides access to documents
 */
function Store(url, logger) {
    this.url = url;
    this.logger = logger;
    // pass collection name to constructor too
    this.collection = 'thing';
};

module.exports = Store;

Store.prototype.get = function(url, callback) {
    var logger = this.logger
     this.exec(function(err, db, collection) {
        if (!err) {
            collection.findOne({url: url}, function (err, result) {
                if (!err && result) {
                    logger.log('info', 'Retrieved document.');
                } else {
                    logger.log('error', 'No document found.');
                    err = err || 'Not found';
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
    var logger = this.logger
     this.exec(function(err, db, collection) {
        if (!err) {
            collection.insert(doc, function (err, result) {
                if (!err) {
                    logger.log('info', 'Inserted document.');
                } else {
                    logger.log('error', 'Document insert failed.');
                }
                db.close();
                callback(err, result);
            });
        } else {
            callback(err, null);
        }
     });
};

/**
 * Remove documents with a url property matching this url
 * allow for variations on a single url
 */
Store.prototype.delete = function(url, callback) {

};

Store.prototype.exec = function(func) {
    var store = this;
    var logger = this.logger
    MongoClient.connect(this.url, function(err, db) {
        if (!err) {
            logger.log('info', 'Connected to server at ' + store.url);
            func(null, db, db.collection(store.collection));
        } else {
            logger.log('error', 'Connect to server failed at ' + store.url);
            func(err, null, null);
        }
    });
};
