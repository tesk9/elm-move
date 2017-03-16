var path = require("path");
var fs = require("fs");

function replaceModules(projectPath, destination) {
  return function (file, elmFileName) {
    var oldModuleName = getModuleName(projectPath, elmFileName);
    var newModuleName = getModuleName(destination, elmFileName);
    return file.replace(oldModuleName, newModuleName)
  };
}

function getModuleName(project, elmFileName) {
  var fileNameWithoutExtension = path.basename(elmFileName, ".elm");
  var pathComponents = project.split(path.sep).filter(function(v) { return v != "" });

  moduleComponents = pathComponents.reduce(function(array, value) {
    if(/^[A-Z]/.test(value)) { array.push(value); }
    else { array = []; }
    return array;
  }, []);

  moduleComponents.push(fileNameWithoutExtension);
  return moduleComponents.join(".");
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
  replaceModules: replaceModules,
  getModuleName: getModuleName,
  logMove: logMove,
  removeFile: removeFile,
}
