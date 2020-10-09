var fs = require('fs'),
    path = require('path'),
    async = require('async');

function readSizeRecursive(item, cb) {
  fs.lstat(item, function(err, stats) {
    if (!err && stats.isDirectory()) {
      var total = stats.size;

      fs.readdir(item, function(err, list) {
        if (err) return cb(err);

        async.forEach(
          list,
          function(diritem, callback) {
            readSizeRecursive(path.join(item, diritem), function(err, size) {
              total += size;
              callback(err);
            }); 
          },  
          function(err) {
            cb(err, total);
          }   
        );  
      }); 
      console.log(total)
    }   
    else {
      cb(err);
    }   
  }); 
}   

