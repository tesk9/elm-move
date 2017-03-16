var assert = require('assert');
var helpers = require('./../scripts/helpers.js')

describe('Helpers', function() {
  describe('#getModuleName(project, elmFileName)', function() {
    it('should return Model for Model', function() {
      assert.equal('Model', helpers.getModuleName('/', 'Model.elm'));
    });

    it('should return Model for some_directory/Model', function() {
      assert.equal('Model', helpers.getModuleName('some_directory/', 'Model.elm'));
    });

    it('should return FeatureName.Model for some_directory/FeatureName/Model', function() {
      assert.equal('FeatureName.Model',
        helpers.getModuleName('some_directory/FeatureName/', 'Model.elm')
      );
    });

    it('should return BigProject.FeatureName.Model for some_directory/BigProject/FeatureName/Model', function() {
      assert.equal('BigProject.FeatureName.Model',
        helpers.getModuleName('some_directory/BigProject/FeatureName/', 'Model.elm')
      );
    });

    it('should return Users.FeatureName.Model for /Users/some_directory/BigProject/FeatureName/Model', function() {
      assert.equal('BigProject.FeatureName.Model',
        helpers.getModuleName('/Users/some_directory/BigProject/FeatureName/', 'Model.elm')
      );
    });
  });

  describe('#replaceModules(projectPath, destination)(file, elmFileName)', function() {
    var elmFileName = 'Model'
    var destination = 'NewFeaturePath'
    var expected = 'module NewFeaturePath.Model exposing (Model)'

    var runTest = function(projectPath, file) {
      assert.equal(expected,
        helpers.replaceModules(projectPath, destination)(file, elmFileName)
      );
    };

    it('should add NewFeaturePath namespacing', function() {
      runTest('/', 'module Model exposing (Model)')
    });

    it('should add NewFeaturePath namespacing', function() {
      runTest('some_directory/', 'module Model exposing (Model)')
    });

    it('should replace the old feature namespacing with NewFeaturePath', function() {
      runTest('some_directory/FeatureName', 'module FeatureName.Model exposing (Model)')
    });
  });
});