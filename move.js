#!/usr/bin/env node

var path = require("path");
var fs = require("fs");

var projectPath = process.argv[2];
var destination = process.argv[3];

function validatePaths(paths) {
  paths.forEach(function(path) {
    if (!fs.existsSync(path)) {
      throw path + "does not exist.";
    }
  });
}

function moveProject(original, destination) {
  validatePaths([original, destination]);

  fs.readdir(original, function(err, files) {
    var elmFileNames = files.filter(function(file) {
      return /.elm$/.test(file);
    });

    if (!elmFileNames.length) {
      console.log("No Elm files found.");
    }

    elmFileNames.forEach(moveElmFile(original, destination));
  });
}

function moveElmFile(projectPath, destination) {
  var createNewElmFile = function(originalFilePath, newFilePath, elmFileNames) {
    return function(err, fileContents) {
      if (err) { throw err; }
      var newFileContents = replaceModuleNames(fileContents, elmFileNames);
      fs.writeFile(newFilePath, newFileContents, function(err) {
        if (err) { throw err; }
        logMove(originalFilePath, newFilePath);
        removeFile(originalFilePath)
      });
    }
  };

  var replaceModuleNames = function(fileContents, elmFileNames) {
    return elmFileNames.reduce(function(file, elmFileName) {
      var oldModuleName = getModuleName(projectPath, elmFileName);
      var newModuleName = getModuleName(destination, elmFileName);

      var re = new RegExp(oldModuleName)
      return file.replace(oldModuleName, newModuleName)
    }, fileContents);
  };


  return function(elmFileName, _index, elmFileNames) {
    var originalFilePath = path.join(projectPath, elmFileName);
    var newFilePath = path.join(destination, elmFileName);

    fs.readFile(originalFilePath, 'utf8', createNewElmFile(originalFilePath, newFilePath, elmFileNames));
  }
}

var getModuleName = function(project, elmFileName) {
  var re = /([A-Z]{1}[A-Za-z]*\/)*[A-Z]{1}[A-Za-z]*/g;
  return path.join(project, elmFileName).match(re)[0].replace(/\//g, ".");
};

function logMove(originalFilePath, newFilePath) {
  console.log("\nContents Moved:");
  console.log(originalFilePath, "=>", newFilePath);
}

function removeFile(path) {
  fs.unlink(path, function(err) {
    if (err) { console.log("ERR", err); }
  });
}

moveProject(projectPath, destination);
