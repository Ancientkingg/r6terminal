const ws = require('windows-shortcuts');
var folder = "C:\Users\Familie\Downloads"
ws.create("%UserProfile%\\Desktop\\R6S Black Ice.lnk", {
    target: folder.split("\\").join("\\\\") + "\\R6DownloaderV4.2.exe",
    runStyle: ws.NORMAL,
    desc: "R6 Version made by R6Terminal",
    icon: "C:\\Users\\Familie\\Downloads\\blackice_KF7_icon.ico"
  });
