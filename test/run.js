var assert = require('assert');
var helpers = require('./../scripts/helpers.js')

describe('Helpers', function() {
  describe('#getModuleName()', function() {
    it('should return Model for some_directory/Model', function() {
      assert.equal("Model", helpers.getModuleName("some_directory/", "Model"));
    });

    it('should return FeatureName.Model for some_directory/FeatureName/Model', function() {
      assert.equal("FeatureName.Model",
        helpers.getModuleName("some_directory/FeatureName/", "Model")
      );
    });

    it('should return BigProject.FeatureName.Model for some_directory/BigProject/FeatureName/Model', function() {
      assert.equal("BigProject.FeatureName.Model",
        helpers.getModuleName("some_directory/BigProject/FeatureName/", "Model")
      );
    });
  });
});