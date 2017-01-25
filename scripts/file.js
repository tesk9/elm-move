var path = require("path");
var fs = require("fs");

function moveElmFile(projectPath, destination) {
  var createNewElmFile = function(originalFilePath, newFilePath, elmFileNames) {
    return function(err, fileContents) {
      if (err) { throw err; }
      var newFileContents = elmFileNames.reduce(replaceModules(projectPath, destination), fileContents);;
      fs.writeFile(newFilePath, newFileContents, function(err) {
        if (err) { throw err; }
        logMove(originalFilePath, newFilePath);
        removeFile(originalFilePath);
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
    return replaceModules(projectPath, destination)(value, "");
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
        logMove(originalFilePath, newFilePath);
        removeFile(originalFilePath);
      });
    });
  };
};


function replaceModules(projectPath, destination) {
  return function (file, elmFileName) {
    var oldModuleName = getModuleName(projectPath, elmFileName);
    var newModuleName = getModuleName(destination, elmFileName);
    return file.replace(oldModuleName, newModuleName);
  };
}

function getModuleName(project, elmFileName) {
  var re = /([A-Z]{1}[A-Za-z]*\/)*[A-Z]{1}[A-Za-z]*/g;
  var match = path.join(project, elmFileName).match(re);
  if (match) {
    return match[0].replace(/\//g, ".");
  }
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

module.exports = {
  moveElmFile: moveElmFile,
  moveElmPackageFile: moveElmPackageFile,
}
