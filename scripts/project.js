var fileMovers = require("./file.js");
var fs = require("fs");
var path = require("path");

var moveElmFile = fileMovers.moveElmFile;
var moveElmPackageFile = fileMovers.moveElmPackageFile;

function moveProject(original, destination) {
  console.log("Preparing:", original, "=>", destination)
  validatePaths([original, destination]);

  fs.readdir(original, function(err, files) {
    var folders = files.filter(isAFolder);
    var elmFileNames = files.filter(isAnElmFile);
    var elmPackageJsons = files.filter(isAnElmPackageFile);

    folders.forEach(moveFolder(original, destination));
    elmFileNames.forEach(moveElmFile(original, destination));
    elmPackageJsons.forEach(moveElmPackageFile(original, destination));
  });
}

function moveFolder(projectPath, destination) {
  var moveFolder = function(folderPath, folderContentsDestination) {
    return moveProject(folderPath, folderContentsDestination);
  };

  var mkdirAndMove = function(folderPath, folderContentsDestination) {
    fs.mkdir(folderContentsDestination, function(err) {
      if (err) { throw err; }
      moveFolder(folderPath, folderContentsDestination);
    });
  };

  return function(folderName) {
    var folderPath = path.join(projectPath, folderName)
    var folderContentsDestination = path.join(destination, folderName);

    if(fs.existsSync(folderContentsDestination)) {
      moveFolder(folderPath, folderContentsDestination);
    } else {
      mkdirAndMove(folderPath, folderContentsDestination)
    }
  }
}

function validatePaths(paths) {
  paths.forEach(function(path) {
    if (!fs.existsSync(path)) {
      throw path + " does not exist.";
    }
  });
}

function isAFolder(name) {
  return !(/\./.test(name));
}

function isAnElmFile(name) {
  return /\.elm$/.test(name);
}

function isAnElmPackageFile(name) {
  return name == 'elm-package.json';
}

module.exports = moveProject
