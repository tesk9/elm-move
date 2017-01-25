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

module.exports = moveFolder
