model = undefined;

describe ("Models", function () {

  describe ("Instanciate new model", function () {

    it ("should be able to instanciate a new model", function () {
      model = new Bitter.Model();

      assume("var model isnt undefined");
    });

    it ("should create a model with given attributes", function () {
      model = new Bitter.Model ({name: "model name", id: 1});

      assume("var model.attributes.name is 'model name'");
    });

    it ("should have an univocal id", function () {
      assume("var model.id isnt undefined");
    });

  });

  describe("Model methods", function () {

    describe("Freeze", function () {

      it ("should be able to freeze a model to keep it's status", function () {
        model.freeze();
        model.set("name", "value when frozen");

        assume("var model.get('name') isnt 'value when frozen'");
      });

      it ("should be able to unfreeze a model", function () {
        model.unfreeze();
        model.set("name", "value when not frozen");

        assume("var model.get('name') is 'value when not frozen'");
      });

    });

    describe("Get", function () {

      it ("should have a get method", function () {
        assume ("var model.get isnt undefined");
      });

      it ("should be able to get attribute value", function () {
        assume ("var model.get('name') is var model.attributes.name");
      });

    });

    describe("Set", function () {

      it ("should have a set method", function () {
        assume ("var model.set isnt undefined");
      });

      it ("should be able to set a new attribute value", function () {
        model.set("name", "new name");

        assume ("var model.attributes.name is 'new name'");
      });

    });

    describe("Reset", function () {

      it ("should have a reset method", function () {
        assume ("var model.reset isnt undefined");
      });

      it ("should be able to reset the model", function () {
        model.reset();

        assume ("var model.get('name') is undefined");
      });

      it ("should be able to reset to a hash", function () {
        model.reset({name: "Paolo", surname: "Moretti"});

        assume ("var model.get('name') is 'Paolo' and var model.get('surname') is 'Moretti'");
      });

    });

    describe("Link", function () {

      it("should link a model attribute to another model attribute", function () {
        model = new Bitter.Model({ foo: "bar" });
        model2 = new Bitter.Model({ foo: "initial value" });

        model2.link("foo", model, "foo" );
        model.set("foo", "new value");

        assume("var model2.get('foo') is 'new value'");
      });

    });

  });

  describe ("Model events", function () {

    beforeEach(function () {
      model = new Bitter.Model({name: "test name", id: 1});
    });

    describe ("Change", function () {

      it ("should fire a change event every time an attribute is amended", function () {
        model.on("change", function () {});

        assume ("method model.emit is called", function () {
          model.set("name", "new value");

          assume("var model.emit.calls[0].args[0] is 'change'");
          assume("var model.emit.calls[0].args[1] is var model");

          assume("var model.emit.mostRecentCall.args[0] is 'change:name'");
          assume("var model.emit.mostRecentCall.args[1] is 'new value'");
        });
      });

      it ("should be able to trigger a callback when an event is emitted", function () {
        window.callback = function () {};
        spyOn(window, "callback");

        model.on("change:name", window.callback);
        model.set("name", "new value");

        expect(window.callback).toHaveBeenCalledWith("new value");
      });

    });

    describe ("Error", function () {

      it ("should emit error event when frozen and try to set attributes", function () {
        window.frozenModel = new Bitter.Model({foo: "bar"});
        frozenModel.freeze();

        assume("method frozenModel.emit is called", function () {
          frozenModel.set("foo", "pippo");

          assume("var frozenModel.emit.mostRecentCall.args[0] is 'error'");
          assume("var frozenModel.emit.mostRecentCall.args[1] is var Bitter._errors.IS_FROZEN");
        });
      });

      it ("should emit error event when frozen and try to reset", function () {
        frozenModel = new Bitter.Model({foo: "bar"});
        frozenModel.freeze();

        assume("method frozenModel.emit is called", function () {
          frozenModel.reset();

          assume("var frozenModel.emit.mostRecentCall.args[0] is 'error'");
          assume("var frozenModel.emit.mostRecentCall.args[1] is var Bitter._errors.IS_FROZEN");
        });
      });

    });

  });

});