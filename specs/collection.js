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

    describe("At", function () {

      it("should return a model at the given index", function () {
        window.model_a = new Bitter.Model({foo: "aaa"});
        window.model_b = new Bitter.Model({foo: "bbb"});
        window.model_c = new Bitter.Model({foo: "ccc"});
        window.collection = new Bitter.Collection([model_a, model_b, model_c]);

        assume("var collection.at(1) is var model_b");
      });

      it("should emit an error if the index doesn't exists", function () {
        window.emptyColl = new Bitter.Collection;

        assume("method emptyColl.emit is called", function () {
          emptyColl.at(1);

          assume("var emptyColl.emit.mostRecentCall.args[0] is 'error'");
          assume("var emptyColl.emit.mostRecentCall.args[1] is var Bitter._errors.INDEX_NOT_FOUND");
        });
      });

    });

    describe("Find", function () {

      beforeEach(function () {
        window.collection = new Bitter.Collection();
        window.model = new Bitter.Model();

        collection.add(model);
      });

      it("should find a model given it's ID", function () {
        assume("var collection.find(model.id) isnt false and var collection.find(model.id) is var model");
      });

      it("should test if a model is present", function () {
        assume("var collection.find(model) isnt false");
        assume("var collection.find('invalidID') is false");
      });

    });

    describe("First", function () {

      it("should return the first model", function () {
        window.model_a = new Bitter.Model({foo: "aaa"});
        window.model_b = new Bitter.Model({foo: "bbb"});
        window.model_c = new Bitter.Model({foo: "ccc"});
        window.collection = new Bitter.Collection([model_a, model_b, model_c]);

        assume("var collection.first() is var model_a");
      });

      it("should emit an error if collection is empty", function () {
        window.emptyColl = new Bitter.Collection;

        assume("method emptyColl.emit is called", function () {
          emptyColl.first();

          assume("var emptyColl.emit.mostRecentCall.args[0] is 'error'");
          assume("var emptyColl.emit.mostRecentCall.args[1] is var Bitter._errors.INDEX_NOT_FOUND");
        });
      });

    })

    describe("Last", function () {

      it("should return the last model", function () {
        window.model_a = new Bitter.Model({foo: "aaa"});
        window.model_b = new Bitter.Model({foo: "bbb"});
        window.model_c = new Bitter.Model({foo: "ccc"});
        window.collection = new Bitter.Collection([model_a, model_b, model_c]);

        assume("var collection.last() is var model_c");
      });

      it("should emit an error if collection is empty", function () {
        window.emptyColl = new Bitter.Collection;

        assume("method emptyColl.emit is called", function () {
          emptyColl.last();

          assume("var emptyColl.emit.mostRecentCall.args[0] is 'error'");
          assume("var emptyColl.emit.mostRecentCall.args[1] is var Bitter._errors.INDEX_NOT_FOUND");
        });
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