#!/usr/bin/env node

var path = require("path");
var fs = require("fs");

var projectPath = process.argv[2];
var destination = process.argv[3];


// TODO: clean up these initial checks
if (fs.existsSync(projectPath)) {
  console.log(projectPath, "found.");
  if (fs.existsSync(destination)) {
    // TODO: create the destination folder if it's not found.
    console.log(destination, "found.");
    moveProject();
  } else {
    console.log(destination, "does not exist.")
  }
} else {
  console.log(projectPath, "does not exist.");
}

function moveProject() {
  fs.readdir(projectPath, function(err, files) {

    var elmFileNames = files.filter(function(file) {
      return /.elm$/.test(file)
    });

    elmFileNames.forEach(function(elmFileName) {
      fs.readFile(path.join(projectPath, elmFileName), function(err, fileContents) {
        if (err) { throw err; }
        fs.writeFile(path.join(destination, elmFileName), fileContents, function(err) {
          if (err) { throw err; }
          console.log(path.join(projectPath, elmFileName), "contents copied to", path.join(destination, elmFileName));
          fs.unlink(path.join(projectPath, elmFileName), function(err) {
            if (err) { console.log("ERR", err); }
          });
        });
      });
    });
  });
}
