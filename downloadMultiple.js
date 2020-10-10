cp = require("child_process");
var exec;
function multipleDownload() {
  exec = cp.exec("echo hello");
  exec.on("exit", function () {
    exec = cp.exec("batch.bat");
    exec.stdout.on("data", function (data) {
      console.log(data);
    });
  });
  exec.stdout.on("data", function (data) {
    console.log(data);
  });
}

multipleDownload();
