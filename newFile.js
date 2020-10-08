let dir = "C:\\Users\\Familie\\Downloads"
fs = require('fs')

var files;

fs.readdir(dir, function (err, files) {
    files = files.map(function (fileName) {
        return {
            name: fileName,
            time: fs.statSync(dir + '/' + fileName).mtime.getTime()
        };
    })
        .sort(function (a, b) {
            return b.time - a.time;
        })
        .map(function (v) {
            return v.name;
        });
        const stats = fs.statSync(dir + '/' + files[0]);
        const fileSizeInBytes = stats.size;
        console.log(fileSizeInBytes)
});