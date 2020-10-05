var stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');


stdin.on('data', function (key) {
    console.log(key)
    if(key == "s"){
        console.log("stop pressing s")
        process.exit(1)
    }
  });