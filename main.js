const path = require("path")
const { render, SAC, loginDescription, quit, quitconfirm } = require("./ui")
const cp = require('child_process');
const input = require('input');
const fs = require('fs');
const tempdir = process.env.TEMP + '\\r6terminal';
const tempdirzip = tempdir.split("\\").join("\\\\") + "\\dpd.zip";
const request = require('superagent');
const admZip = require('adm-zip');
const source = `https://github.com/Ancientkingg/r6terminal/blob/master/depotdownloader/dpd.zip?raw=true`;
var stdin = process.stdin;
let quitapp = 0;




SAC();

var name;
var password;
let percent = 0;

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
        zip.extractAllTo(tempdir, false);
        fs.unlinkSync(tempdir + "\\dpd.zip")
        askStuff();
      }));
}


async function askStuff() {
  console.clear();
  loginDescription();
  name = await input.text('Username:');
  password = await input.password('Password:');
  confirm = await input.confirm('Continue to downloading?');
  if (confirm == true) {
    console.clear();
    progressBar();
  } else if(confirm == false) {
    console.clear();
    askStuff();
  }
}

function progressBar() {
  const exec = cp.exec('batch.bat');
  console.log(quitapp);
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding('utf8');
  stdin.on('data', function (key) {
    if (key == "q") {
      console.clear();
      quit();
      // 
      quitapp = true
      stdin.on('data', function (confirm){
        if(confirm == "y" ){
          quitconfirm();
          process.exit(1)
        }
        if(confirm == "n"){
          quitapp = false
        }
      })
      setTimeout(() => {
        quitapp = false
    },5000);
  }});
  exec.stdout.on('data', function (data) {
    if (/\s\d\d/.test(data)) {
      const [, x, ...rest] = data.split(" ")
      let token = x.replace(",", ".")
      let partial = token.substr(0, token.length - 1)
      let percent = Number(partial)
      // console.log(rest.join(" "))
      if (quitapp != true) {
        render({
          percent,
          currentFile: " " + path.relative(process.cwd(), rest.join(" ").trim())
        });
      }
    }
  })
}



