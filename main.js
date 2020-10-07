const path = require("path")
const { render, SAC, loginDescription, quit, quitconfirm } = require("./ui")
const cp = require('child_process');
const ws = require('windows-shortcuts');
const input = require('input');
const fs = require('fs');
const tempdir = process.env.TEMP + '\\r6terminal';
const tempdirzip = tempdir.split("\\").join("\\\\") + "\\dpd.zip";
const tempdirresources = tempdir.split("\\").join("\\\\") + "\\resources";
const request = require('superagent');
const admZip = require('adm-zip');
const source = `https://github.com/Ancientkingg/r6terminal/blob/master/depotdownloader/dpd.zip?raw=true`;
var stdin = process.stdin;
let quitapp = 0;
const chalk = require('chalk');
let psScript = `
Function Select-FolderDialog
{
    param([string]$Description="Select Folder",[string]$RootFolder="Desktop")

 [System.Reflection.Assembly]::LoadWithPartialName("System.windows.forms") |
     Out-Null     

   $objForm = New-Object System.Windows.Forms.FolderBrowserDialog
        $objForm.Rootfolder = $RootFolder
        $objForm.Description = $Description
        $Show = $objForm.ShowDialog()
        If ($Show -eq "OK")
        {
            Return $objForm.SelectedPath
        }
        Else
        {
            Write-Error "Operation cancelled by user."
        }
    }

$folder = Select-FolderDialog # the variable contains user folder selection
write-host $folder
`




SAC();

var name;
var password;
let percent = 0;

if (!fs.existsSync(tempdir)) {
  fs.mkdirSync(tempdir)
}
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


async function askStuff() {
  console.clear();
  loginDescription();
  name = await input.text('Username:');
  password = await input.password('Password:');
  confirm = await input.select('Continue to downloading?',["Yes", "No"]);
  if (confirm == "Yes") {
    console.clear();
    selectDownload();
  } else if (confirm == "No") {
    console.clear();
    askStuff();
  }
}

function selectDownload(){ 
  cp.execSync('mode con: cols=144 lines=20');
  console.log("");
  console.log("");
  console.log("");
  console.log("");
  console.log(chalk.redBright('                                                ███████ ███████ ██      ███████  ██████ ████████                                               '));
  console.log(chalk.redBright('                                                ██      ██      ██      ██      ██         ██                                                  '));
  console.log(chalk.redBright('                                                ███████ █████   ██      █████   ██         ██                                                  '));
  console.log(chalk.redBright('                                                     ██ ██      ██      ██      ██         ██                                                  '));
  console.log(chalk.redBright('                                                ███████ ███████ ███████ ███████  ██████    ██                                                  '));
  console.log(chalk.redBright('                                                                                                                                               '));
  console.log(chalk.redBright('                                                                                                                                               '));
  console.log(chalk.redBright('██████   ██████  ██     ██ ███    ██ ██       ██████   █████  ██████      ██████  ██ ██████  ███████  ██████ ████████  ██████  ██████  ██    ██'));
  console.log(chalk.redBright('██   ██ ██    ██ ██     ██ ████   ██ ██      ██    ██ ██   ██ ██   ██     ██   ██ ██ ██   ██ ██      ██         ██    ██    ██ ██   ██  ██  ██ '));
  console.log(chalk.redBright('██   ██ ██    ██ ██  █  ██ ██ ██  ██ ██      ██    ██ ███████ ██   ██     ██   ██ ██ ██████  █████   ██         ██    ██    ██ ██████    ████  '));
  console.log(chalk.redBright('██   ██ ██    ██ ██ ███ ██ ██  ██ ██ ██      ██    ██ ██   ██ ██   ██     ██   ██ ██ ██   ██ ██      ██         ██    ██    ██ ██   ██    ██   '));
  console.log(chalk.redBright('██████   ██████   ███ ███  ██   ████ ███████  ██████  ██   ██ ██████      ██████  ██ ██   ██ ███████  ██████    ██     ██████  ██   ██    ██   '));
  console.log(chalk.redBright('                                                                                                                                               '));
  console.log(chalk.redBright('                                                                                                                                               '));
  var spawn = cp.spawn, child;
  child = spawn("powershell.exe", [psScript]);
  child.stdout.once("data", async function (data) {
    folder = await data.toString();
    console.log(folder);
    if(folder.startsWith("\n")){
      return selectDownload()
    }
    if(!folder.startsWith("\n")){
      shortcut = await input.select('Would you like a shortcut on the desktop?',["Yes","No"]);
      if(shortcut == "Yes"){
        createShortcut();
      }
      cp.execSync('mode con: cols=120 lines=30')
      progressBar();
  }
})
  child.stdin.end(); //end input
}

function createShortcut(){
  ws.create("%UserProfile%/Desktop/R6S Black Ice.lnk", {
    target: folder.split("\\").join("\\\\") + "\\RainbowSix.exe",
    runStyle: ws.NORMAL,
    desc: "R6 Version made by R6Terminal",
    icon: tempdirresources + "\\blackice.ico"
  });
  if (!fs.existsSync(tempdirresources)) {
    fs.mkdirSync(tempdirresources)
  }
  request.get(`https://github.com/Ancientkingg/r6terminal/blob/master/resources/blackice_KF7_icon.ico?raw=true`).pipe(fs.createWriteStream(tempdirresources + "\\blackice.ico").on('finish', function (){
    console.log("Downloaded Shortcut")
  }));

}

function progressBar() {
  const exec = cp.exec('batch.bat');
  logs = false
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding('utf8');
  stdin.on('data', function (key) {
    quitapp = false
    if (quitapp == false) {
      if (key == "x") {
        if (logs == true) {
          logs = false
        } else if (logs == false) {
          console.clear();
          logs = true
        }
      }
    }
    if (key == "q") {
      console.clear();
      quit();
      // 
      quitapp = true
      stdin.on('data', function (confirm) {
        if (confirm == "y") {
          quitconfirm();
          process.exit(1)
        }
        if (confirm == "n") {
          quitapp = false
        }
      })
      setTimeout(() => {
        quitapp = false
      }, 5000);
    }
  });
  exec.stdout.on('data', function (data) {
    if (logs == true) {
      console.log(data.replace(/(\r\n|\n|\r)/gm, ""))
    } else {
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
    }
  })
}

// if a new file appears in the download directory, start console.time("dSpeed")
// if another file appears in the download directory, end console.timeEnd("dSpeed")
// check size of second file in download dir and do math with dSpeed to get estimated download speed
// allow user to opt for more accurate estimated download speed and waiting time with nirsoft app_network_counter
// requires admin privileges though, hence the choice.

