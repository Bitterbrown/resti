describe("Bootstrap", function () {

  it("should have an instance", function () {
    assume("var Bitter isnt undefined");
  });

  it("should be an object", function () {
    assume ("var typeof(Bitter) is 'object'");
  });

  it("should have a model class", function () {
    assume("var Bitter.Model isnt undefined and var typeof(Bitter.Model) is 'function'");
  });

  describe("Utils", function () {

    it("should have a getID method to create a unique ID", function () {
      window.test = Bitter.getID();

      assume("var test isnt undefined and var Bitter._instances[test] is undefined");
    });

    it ("should have a isModel method to test if an object is a model", function () {
      window.testModel = new Bitter.Model({foo: "bar"});
      assume("var Bitter.isModel({}) is false and var Bitter.isModel(testModel) is true");
    });

    it ("should have a isCollection method to test if an array is a collection", function () {
      window.testCollection = new Bitter.Collection();
      assume("var Bitter.isCollection([]) is false and var Bitter.isCollection(testCollection) is true");
    });

  });

});