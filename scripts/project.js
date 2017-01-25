var moveFolder = require("./folder.js");
var moveElmFile = require("./file.js");
var fs = require("fs");

function moveProject(original, destination) {
  validatePaths([original, destination]);

  fs.readdir(original, function(err, files) {
    var folders = files.filter(isAFolder);
    var elmFileNames = files.filter(isAnElmFile);

    folders.forEach(moveFolder(original, destination));
    elmFileNames.forEach(moveElmFile(original, destination));
  });
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

module.exports = moveProject
