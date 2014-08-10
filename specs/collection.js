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

  describe("Methods", function () {

    describe("Add", function () {

      it("should add a model to a collection", function () {
        window.testCollection = new Bitter.Collection();

        assume("var testCollection.length is 0");

        runs(function () {
          testCollection.add(new Bitter.Model({foo: "bar"}));
        });

        assume("var testCollection.length is 1 and var Bitter.isModel(testCollection.collection[0]) is true");
      });

      it("should not add a model if already present", function () {
        window.testCollection = new Bitter.Collection();
        window.testModel = new Bitter.Model({foo: "bar"});

        testCollection.add(testModel);

        assume("var testCollection.length is 1");

        runs(function () {
          testCollection.add(testModel);
        });

        assume("var testCollection.length is 1");
      });

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

    describe("Add", function () {

      it("should emit add when a model is added to a collection", function () {
        collection.on("add", function () {});

        assume ("method collection.emit is called", function () {
          collection.add(new Bitter.Model({foo: "bar"}));

          assume("var collection.emit.calls[0].args[0] is 'add'");
        });
      });

    });

  });

});