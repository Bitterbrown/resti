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

    describe("Attach", function () {

      it ("should be able to attach a model attribute to a specific callback", function () {
        window.element = $('<div class="test-element">Test element text</div>');
        $("body").append(element);

        model = new Bitter.Model ({description: "My test description", id: 1});

        model.attach("description", $(".test-element") );

        model.set("description", "My new description");

        assume("var $('.test-element').text() is 'My new description'");
      });

      it ("should be able to unfreeze a model", function () {
        model.unfreeze();
        model.set("name", "value when not frozen");

        assume("var model.get('name') is 'value when not frozen'");
      });

    });

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

    describe("Fetch", function () {

      it("should throw error if resti doesn't have the Restful API uri setted", function () {
        window.model = new Bitter.Model({id: 1});
        Bitter.defaults.api.uri = false;

        assume("method model.emit is called", function () {
          model.fetch();

          assume("var model.emit.mostRecentCall.args[0] is 'error'");
          assume("var model.emit.mostRecentCall.args[1] is var Bitter._errors.NO_API_URI");
        });
      })

      it("should throw error if model doesn't have id", function () {
        Bitter.defaults.api.uri = "http://fakeApi";

        window.model = new Bitter.Model;

        assume("method model.emit is called", function () {
          model.fetch();

          assume("var model.emit.mostRecentCall.args[0] is 'error'");
          assume("var model.emit.mostRecentCall.args[1] is var Bitter._errors.MODEL_HAS_NO_ID");
        });
      });

      it("should call API if conditions above are met", function () {
        window.model = new Bitter.Model({id: 1});

        assume("method jQuery.ajax is called", function () {
          model.fetch();

          assume("var $.ajax.mostRecentCall.args[0].url is '"+Bitter.defaults.api.uri+"/"+model.get("id")+"'");
        });
      });

      describe("Operations", function () {

        beforeEach(function () {
          Bitter.defaults.api.uri = "http://fakeApi";

          window.model = new Bitter.Model({id: 1});
          window.apiResponse = {
            id: 1,
            name: "test model",
            description: "test model description"
          }
          assume("method jQuery.ajax is mocked", function (params) {
            if(params.url == Bitter.defaults.api.uri + "/1" && params.method.toLowerCase() == "get")
              params.success(window.apiResponse);
          });
        });

        it("should call the parse method once the rest response is delivered", function () {
          assume("method model.parse is called with var apiResponse", function () {
            model.fetch();
          });
        });

        it("should be able to update the model", function () {
          assume("method model.reset() is called", function () {
            model.fetch();

            assume("var model.get('name') is 'test model' and var model.get('description') is 'test model description'");
          });
        });

        it("should have a done method to execute a callback", function () {
          assume("method model.doneInternal is called", function () {
            model.fetch();
          });

        });

      });

    });

    describe("Create", function () {

      it("should be able to create a model", function () {
        Bitter.defaults.api.uri = "http://fakeApi";

        window.modelHash = {
          id: 1,
          name: "foo",
          description: "bar"
        }
        window.model = new Bitter.Model(modelHash);

        assume("method jQuery.ajax is called", function () {
          model.create();

          assume("var jQuery.ajax.mostRecentCall.args[0].method.toLowerCase() is 'post'");
          assume("var jQuery.ajax.mostRecentCall.args[0].url is '"+Bitter.defaults.api.uri+"/1'");
        });
      });

    });

    describe("Delete", function () {

      it("should be able to delete a model", function () {
        Bitter.defaults.api.uri = "http://fakeApi";

        window.modelHash = {
          id: 1,
          name: "foo",
          description: "bar"
        }
        window.model = new Bitter.Model(modelHash);

        assume("method jQuery.ajax is called", function () {
          model.delete();

          assume("var jQuery.ajax.mostRecentCall.args[0].method.toLowerCase() is 'delete'");
          assume("var jQuery.ajax.mostRecentCall.args[0].url is '"+Bitter.defaults.api.uri+"/1'");
        });
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