const fs = require('fs');
const tempdir = process.env.TEMP + '\\r6terminal';
const tempdirzip = tempdir.split("\\").join("\\\\") + "\\dpd.zip";
const request = require('superagent');
const admZip = require('adm-zip');
const source = `https://github.com/Ancientkingg/r6terminal/blob/master/depotdownloader/dpd.zip?raw=true`;

if (!fs.existsSync(tempdir)) {
    fs.mkdirSync(tempdir)
} else {
    request
        .get(source)
        .on('error', function (error) {
            console.log(error);
        })
        .pipe(fs.createWriteStream(tempdirzip)
            .on('finish', function () {
                console.log("Finished downloading!")
                var zip = new admZip(tempdirzip);
                console.log('Start Unzip');
                zip.extractAllTo(tempdir, false);
                console.log('Finished Unzip');
                fs.unlinkSync(tempdir + "\\dpd.zip")
            }));
}



