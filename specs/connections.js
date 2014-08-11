describe("Connections", function () {

  it("should have a connection module to extend resti classes", function () {
    assume("var Bitter.Connect isnt undefined");
  });

  describe("Api methods", function () {

    it("should have an api object to deal with calls", function () {
      assume("var Bitter.Connect.api isnt undefined");
    });

    describe("Model", function () {

      beforeEach(function () {
        window.model = new Bitter.Model;
      });

      it("should extend a model when a new istance is created", function () {
        assume("var model.api isnt undefined");
      });

      it("should have API url property", function () {
        assume("var model.api.url isnt undefined and var model.api.url is var Bitter.defaults.api.uri");
      });

    });

  });


});