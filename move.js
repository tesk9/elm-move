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

    elmFileNames.forEach(moveElmFile);
  });
}

function moveElmFile(elmFileName, _index, elmFileNames) {
  var originalFilePath = path.join(projectPath, elmFileName);
  var newFilePath = path.join(destination, elmFileName);

  fs.readFile(originalFilePath, 'utf8', function(err, fileContents) {
    if (err) { throw err; }

    var newFileContents = replaceModuleNames(fileContents, elmFileNames);

    fs.writeFile(newFilePath, newFileContents, function(err) {
      if (err) { throw err; }
      console.log(originalFilePath, "contents moved to", newFilePath);

      fs.unlink(originalFilePath, function(err) {
        if (err) { console.log("ERR", err); }
      });
    });
  });
}

function replaceModuleNames(fileContents, elmFileNames) {
  return elmFileNames.reduce(function(file, elmFileName) {
    var oldModuleName = getModuleName(projectPath, elmFileName);
    var newModuleName = getModuleName(destination, elmFileName);

    var re = new RegExp(oldModuleName)
    console.log(re)
    return file.replace(oldModuleName, newModuleName)
  }, fileContents);
}

function getModuleName(project, elmFileName) {
  var re = /([A-Z]{1}[a-z]*\/)*[A-Z]{1}[a-z]*/g;
  return path.join(project, elmFileName).match(re)[0].replace(/\//g, ".");
}
