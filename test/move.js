var assert = require('assert');
var mock = require('mock-fs');
var moveProject = require("./../scripts/project.js");


describe('Move', function() {
  mock({
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

  it('should fail gracefully when given a nonexistent project to move', function() {
    var move = function () { moveProject('Not/A/Real/Path', 'Anywhere') };
    assert.throws(move, /Not\/A\/Real\/Path does not exist./)
  });

  mock.restore();
});