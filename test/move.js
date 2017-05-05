var mock = require('mock-fs');
var assert = require('assert');
var moveProject = require("./../scripts/project.js");
var fs = require("fs");

describe('Move', function() {
  beforeEach(function() {
    mock({
      'A/Folder': {},
      'An/Existing/Elm/Project': {
        'some-file.txt': 'this file should not be moved',
        'Main.elm': 'module An.Existing.Elm.Project exposing (someCoolStuff)',
        'SubModule': {
          'Styles.elm': 'module An.Existing.Elm.Project.SubModule.Styles exposing (Classes, styles)',
          'Update.elm': 'module An.Existing.Elm.Project.SubModule.Update exposing (Msg(..), update)',
          'Model.elm': 'module An.Existing.Elm.Project.SubModule.Model exposing (Model, init)',
          'View.elm': 'module An.Existing.Elm.Project.SubModule.View exposing (Config, view)',
        }
      },
      'path/to/some.png': new Buffer([8, 6, 7, 5, 3, 0, 9]),
      'ASingleFile.elm': 'module ASingleFile exposing (Model, Thing, otherThing)'
    });
  })

  afterEach(function() {
    mock.restore();
  })

  it('should fail gracefully when given a nonexistent project to move', function() {
    var move = function () { moveProject('Not/A/Real/Path', 'Anywhere') };
    assert.throws(move, /Not\/A\/Real\/Path does not exist./);
  });

  it('should create a directory when given a nonexistent destination', function() {
    var move = function() { moveProject('A/Folder', 'Anywhere') };
    assert.doesNotThrow(move);
  });

  it('should create a directory when given a nested nonexistent destination', function() {
    var move = function() { moveProject('A/Folder', 'Anywhere/ForReal/Tho') };
    assert.doesNotThrow(move);
  });

  it('shold move a single file', function() {
    moveProject('ASingleFile.elm', 'ASingleAwesomeFile.elm');
    fs.readFile('./ASingleAwesomeFile.elm', 'utf8', function(err, content) {
      if(err) { throw err; }
      return assert(content == 'module ASingleAwesomeFile exposing (Model, Thing, otherThing)');
    });
  });
});