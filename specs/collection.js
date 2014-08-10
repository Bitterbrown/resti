describe("Collections", function () {

  it ("should have a collection function", function () {
    assume("var Bitter.Collection isnt undefined");
  });

  describe("New instance", function () {

    it("should be able to instance a new empty collection", function () {
      window.collection = new Bitter.Collection();

      assume("var collection isnt undefined and var collection.collection.length is 0");
    });

    it("should be able to instanciate a collection from an array of models", function () {
      window.collection = new Bitter.Collection(["a", "b", "c"]);

      assume("var collection isnt undefined and var collection.collection.length is 3");
      assume("var collection.length is 3");
    });

    it("should have a unique ID", function () {
      assume("var collection.id isnt undefined");
    });

  });


  describe("Events", function () {

    beforeEach(function () {
      window.model_a = new Bitter.Model({foo: "aaa"});
      window.model_b = new Bitter.Model({foo: "bbb"});
      window.model_c = new Bitter.Model({foo: "ccc"});
      window.collection = new Bitter.Collection([model_a, model_b, model_c]);
    });

    describe("Change", function () {

      it("should trigger a change event when a model within the collection changes", function () {
        collection.on("change", function () {});

        assume ("method collection.emit is called", function () {
          model_a.set("foo", "ddd");

          assume("var collection.emit.mostRecentCall.args[0] is 'change'");
          assume("var collection.emit.mostRecentCall.args[1] is var model_a");
        });
      });

    });

  });

});