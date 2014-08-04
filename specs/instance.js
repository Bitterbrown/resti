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

});