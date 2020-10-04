const path = require("path")
const render = require("./ui")
let percent = 0;
const input = require('input');
const cp = require('child_process');
var ls = cp.exec('batch.bat');
var name;
var password;


 
async function askStuff() {
  console.clear();
  name = await input.text('Username:');
  password = await input.password('Password:');
  const confirm = await input.confirm('Confirm?');
  if(confirm == true){
    console.clear();
    progressBar();
  }else{
    console.clear();
    askStuff();
  }
}


askStuff();

function progressBar() {
  console.log(name,password);
  ls.stdout.on('data', function (data) {
    if (/\s\d\d/.test(data)) {
      const [, x, ...rest] = data.split(" ")
      let token = x.replace(",", ".")
      let partial = token.substr(0, token.length - 1)
      let percent = Number(partial)
      // console.log(rest.join(" "))
      render({
        percent,
        currentFile: "...\\" + path.relative(process.cwd(), rest.join(" ").trim())
      });
    }
  })
}



