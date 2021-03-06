const path = require("path");
const { render, SAC, loginDescription, quit, quitconfirm } = require("./ui");
const cp = require("child_process");
const ws = require("windows-shortcuts");
const input = require("input");
const fs = require("fs");
const tempdir = process.env.TEMP + "\\r6terminal";
const tempdirzip = tempdir.split("\\").join("\\\\") + "\\dpd.zip";
const tempdirresources = tempdir.split("\\").join("\\\\") + "\\resources";
const request = require("superagent");
const admZip = require("adm-zip");
let stdin = process.stdin;
let quitapp = 0;
const chalk = require("chalk");
const NS_PER_SEC = 1e9;
let depot_1 = process.argv[2];
let manifest_1 = process.argv[3];
let depot_2 = process.argv[4];
let manifest_2 = process.argv[5]
let downloadDir = path.resolve(process.cwd(), process.argv[6])
let name = process.argv[7];
let password;
SAC();
askStuff();

// future ancientkingg talking here
// arguments are as follows:

// sdkcontent sdkmanifest manifestcontent down username

// for future reference: down = download directory


async function askStuff() {
  console.clear();
  loginDescription(name);
  password = await input.password("Password:");
  confirm = await input.select("Continue downloading?", ["Yes", "No"]);
  if (confirm == "Yes") {
    console.clear();
    progressBar();
  } else if (confirm == "No") {
    console.clear();
    askStuff();
  }
}

function progressBar() {
  let time;
  let n = 0;
  let sumDownloadSpeed = 0;
  time = process.hrtime();
  let dirFileSize = 0;
  let exec = cp.exec(`dotnet DepotDownloader/DepotDownloader.dll -app 359550 -depot ${depot_1} -manifest ${manifest_1} -username ${name} -password ${password} -remember-password -dir "${downloadDir}" -validate -max-servers 15 -max-downloads 10`);
  logs = false;
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding("utf8");
  stdin.on("data", function (key) {
    quitapp = false;
    if (quitapp == false) {
      if (key == "x") {
        if (logs == true) {
          logs = false;
        } else if (logs == false) {
          console.clear();
          logs = true;
        }
      }
    }
    if (key == "q") {
      console.clear();
      quit();
      //
      quitapp = true;
      stdin.on("data", function (confirm) {
        if (confirm == "y") {
          quitconfirm();
          process.exit(1);
        }
        if (confirm == "n") {
          quitapp = false;
        }
      });
      setTimeout(() => {
        quitapp = false;
      }, 5000);
    }
  });
  exec.on("exit", function () {
    exec = cp.exec(`dotnet depotdownloader/DepotDownloader.dll -app 359550 -depot ${depot_2} -manifest ${manifest_2} -username ${name} -password ${password} -remember-password -dir "${downloadDir}" -validate -max-servers 15 -max-downloads 10`);
    time = process.hrtime();
    exec.stdout.on("data", async function (data) {
      if (logs == true) {
        console.log(data.replace(/(\r\n|\n|\r)/gm, ""));
      } else {
        if(data.startsWith("Disconnected")){
          twoFA = await input.text("Please enter your 2fa-code: ")
          exec.stdin.write(twoFA + "\n")
        }else if (/\s\d\d/.test(data)) {
          let diff = process.hrtime(time);
          time = process.hrtime();
          nsDiff = diff[0] * NS_PER_SEC + diff[1];
          // I don't need the average time, I need the time it needed to download that specific file
          // and from that get the average
          // sumETA = sumETA + nsDiff;
          // averageETA = sumETA / n;
          // n++;
          // console.log(n)
          // console.log(nsDiff)
          // console.log(sumETA)
          // console.log(averageETA)

          fs.readdir(downloadDir, function (err, files) {
            if (files.length) {
              files = files
                .map(function (fileName) {
                  return {
                    name: fileName,
                    time: fs.statSync(downloadDir + "/" + fileName).mtime.getTime(),
                  };
                })
                .sort(function (a, b) {
                  return b.time - a.time;
                })
                .map(function (v) {
                  return v.name;
                });
              const stats = fs.statSync(downloadDir + "/" + files[0]);
              const fileSizeInBytes = stats.size;
              // console.log(files[0])
              // console.log(fileSizeInBytes)
              const [, x, ...rest] = data.split(" ");
              let token = x.replace(",", ".");
              let partial = token.substr(0, token.length - 1);
              let percent = Number(partial)/2 + 50;
              // everything is in MB
              let packageFileSize = 5000; // fill in total size of package in MB
              dirFileSize = dirFileSize + fileSizeInBytes / 10e6;
              remainingFileSize = packageFileSize - dirFileSize;
              let downloadSpeed = fileSizeInBytes / 10e6 / (nsDiff / 10e9); // mb/s
              n++;
              sumDownloadSpeed = sumDownloadSpeed + downloadSpeed;
              averageDownloadSpeed = sumDownloadSpeed / n;
              let remainingTimeNumber =
                remainingFileSize / averageDownloadSpeed; // is in seconds
              let rtH = Math.floor(remainingTimeNumber / 3600); // hours
              let rtM = Math.floor((remainingTimeNumber % 3600) / 60); // minutes
              let rtS = Math.floor((remainingTimeNumber % 3600) % 60); // seconds
              let remainingTime =
                "Estimated time remaining: " +
                chalk.red(rtH) +
                " hours " +
                chalk.green(rtM) +
                " minutes " +
                chalk.blue(rtS) +
                " seconds";
              // let remainingTime = averageDownloadSpeed + "  " + downloadSpeed + "  " + remainingTimeNumber + "  " + remainingFileSize
              if (quitapp != true) {
                render({
                  percent,
                  currentFile:
                    " " + path.relative(process.cwd(), rest.join(" ").trim()),
                  remainingTime,
                });
              }
            }
          });
        }
      }
    });
  });
  exec.stdout.on("data", async function (data) {
    if (logs == true) {
      console.log(data.replace(/(\r\n|\n|\r)/gm, ""));
    } else {
      if(data.startsWith("Disconnected")){
        // console.log(data)
        let twoFA = await input.text("Please enter your 2fa-code: ")
        exec.stdin.write(twoFA + "\n")
      }else if (/\s\d\d/.test(data)) {
        var diff = process.hrtime(time);
        time = process.hrtime();
        nsDiff = diff[0] * NS_PER_SEC + diff[1];
        // I don't need the average time, I need the time it needed to download that specific file
        // and from that get the average
        // sumETA = sumETA + nsDiff;
        // averageETA = sumETA / n;
        // n++;
        // console.log(n)
        // console.log(nsDiff)
        // console.log(sumETA)
        // console.log(averageETA)

        fs.readdir(downloadDir, function (err, files) {
          if (files.length) {
            files = files
              .map(function (fileName) {
                return {
                  name: fileName,
                  time: fs.statSync(downloadDir + "/" + fileName).mtime.getTime(),
                };
              })
              .sort(function (a, b) {
                return b.time - a.time;
              })
              .map(function (v) {
                return v.name;
              });
            const stats = fs.statSync(downloadDir + "/" + files[0]);
            const fileSizeInBytes = stats.size;
            // console.log(files[0])
            // console.log(fileSizeInBytes)
            const [, x, ...rest] = data.split(" ");
            let token = x.replace(",", ".");
            let partial = token.substr(0, token.length - 1);
            let percent = Number(partial)/2;
            // everything is in MB
            let packageFileSize = 5000; // fill in total size of package in MB
            dirFileSize = dirFileSize + fileSizeInBytes / 10e6;
            remainingFileSize = packageFileSize - dirFileSize;
            let downloadSpeed = fileSizeInBytes / 10e6 / (nsDiff / 10e9); // mb/s
            n++;
            sumDownloadSpeed = sumDownloadSpeed + downloadSpeed;
            averageDownloadSpeed = sumDownloadSpeed / n;
            let remainingTimeNumber = remainingFileSize / averageDownloadSpeed; // is in seconds
            let rtH = Math.floor(remainingTimeNumber / 3600); // hours
            let rtM = Math.floor((remainingTimeNumber % 3600) / 60); // minutes
            let rtS = Math.floor((remainingTimeNumber % 3600) % 60); // seconds
            let remainingTime =
              "Estimated time remaining: " +
              chalk.red(rtH) +
              " hours " +
              chalk.green(rtM) +
              " minutes " +
              chalk.blue(rtS) +
              " seconds";
            // let remainingTime = averageDownloadSpeed + "  " + downloadSpeed + "  " + remainingTimeNumber + "  " + remainingFileSize
            if (quitapp != true) {
              render({
                percent,
                currentFile:
                  " " + path.relative(process.cwd(), rest.join(" ").trim()),
                remainingTime,
              });
            }
          }
        });
      }
    }
  });
}

// add 2fa support
// add PLAZA support

// dotnet DepotDownloader.dll -app 359550 -depot 377237 -manifest 8358812283631269928 -username x -remember-password -dir "R6Downloads\Y1S0_Vanilla" -validate -max-servers 15 -max-downloads 10
// 2fa prompt =
// Disconnected

// Cluster truck test download
// dotnet DepotDownloader.dll -app 397950 -depot 397951 -manifest 285661690570693680 -username x -password x

// end of the download // IS ALREADY SOLVED BY CHECKING FOR EXIT EVENT
// 100.00% depots\397951\4454219\Clustertruck_Data\sharedassets0.resource
// Depot 397951 - Downloaded 332615968 bytes (475483523 bytes uncompressed)
// Total downloaded: 332615968 bytes (475483523 bytes uncompressed) from 1 depots
// Accepted new login key for account x
// Disconnected from Steam
