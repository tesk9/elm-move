var path = require("path");
var fs = require("fs");
var helpers = require("./helpers.js");

function moveElmFile(projectPath, destination) {
  var createNewElmFile = function(originalFilePath, newFilePath, elmFileNames) {
    return function(err, fileContents) {
      if (err) { throw err; }
      var newFileContents = elmFileNames.reduce(helpers.replaceModules(projectPath, destination), fileContents);;
      fs.writeFile(newFilePath, newFileContents, function(err) {
        if (err) { throw err; }
        helpers.logMove(originalFilePath, newFilePath);
        helpers.removeFile(originalFilePath);
      });
    }
  };

  return function(elmFileName, _index, elmFileNames) {
    var originalFilePath = path.join(projectPath, elmFileName);
    var newFilePath = path.join(destination, elmFileName);

    fs.readFile(originalFilePath, 'utf8', createNewElmFile(originalFilePath, newFilePath, elmFileNames));
  }
}

function moveElmPackageFile(projectPath, destination) {
  var replacer = function(value) {
    return helpers.replaceModules(projectPath, destination)(value, "");
  };

  return function(fileName) {
    var originalFilePath = path.join(projectPath, fileName);
    var newFilePath = path.join(destination, fileName);

    fs.readFile(originalFilePath, 'utf8', function(err, fileContents) {
      if (err) { throw err; }
      var json =  JSON.parse(fileContents);

      json["source-directories"] = json["source-directories"].map(replacer);
      json["exposed-modules"] = json["exposed-modules"].map(replacer);

      var newFileContents = JSON.stringify(json);
      fs.writeFile(newFilePath, newFileContents, function(err) {
        if (err) { throw err; }
        helpers.logMove(originalFilePath, newFilePath);
        helpers.removeFile(originalFilePath);
      });
    });
  };
};

module.exports = {
  moveElmFile: moveElmFile,
  moveElmPackageFile: moveElmPackageFile,
}
