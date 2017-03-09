var path = require("path");

function replaceModules(projectPath, destination) {
  return function (file, elmFileName) {
    var oldModuleName = getModuleName(projectPath, elmFileName);
    var newModuleName = getModuleName(destination, elmFileName);
    return file.replace(oldModuleName, newModuleName)
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
  replaceModules: replaceModules,
  getModuleName: getModuleName,
  logMove: logMove,
  removeFile: removeFile,
}
