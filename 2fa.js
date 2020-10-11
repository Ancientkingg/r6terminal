const input = require('input')
const cp = require('child_process');
let exec = cp.exec(`batch.bat`);
    exec.stdout.pipe(process.stdout)
    exec.stdout.on('data', async function (data) {
        if(data.startsWith("Please")){
            let twoFA = await input.text("Please enter your 2fa code:")
            exec.stdin.write(twoFA + "\n")
            console.log(data)
        }
    })