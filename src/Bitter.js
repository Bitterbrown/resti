var Bitter = function () {

  // Getting ajax library if present
  if(jQuery !== undefined && jQuery.ajax !== undefined)
    __ajax = jQuery.ajax
  else {
    console.error("Resti requires a js library/framework with an ajax system");
    __ajax = function () {
      throw Error("No library found with ajax methods");
    };
  }

  return {
    _ids: [],
    _instances: {},
    _errors: {
      "IS_FROZEN"             : "This model is frozen and can't accept updates",
      "IS_NOT_MODEL"          : "The given var is not a model",
      "MODEL_ALREADY_EXISTS"  : "The model is already present: skipping",
      "MODEL_HAS_NO_ID"       : "The model doesn't have an ID",
      "NO_API_URI"            : "No API uri is provided",
      "INDEX_NOT_FOUND"       : "Can't find any model with that index"
    },
    defaults: {
      api: {
        uri: false,
          version: 1
      }
    },
    modules: {

      // Must run on collection scope
      require: function (what, requirements) {
        for ( var i=0; i<requirements.length; i++) {
          switch(requirements[i]) {
            case "isModel":
              if (!(what instanceof Bitter.Model))
                return this.emit("error", Bitter._errors.IS_NOT_MODEL);
              break;

            case "hasApiUrl":
              if (Bitter.defaults.api.uri === false || Bitter.defaults.api.uri === "" || Bitter.defaults.api.uri === null)
                return this.emit("error", Bitter._errors.NO_API_URI);

            case "modelHasID":
              if (what.attributes === undefined || what.attributes.id === undefined)
                return this.emit("error", Bitter._errors.MODEL_HAS_NO_ID);

            case "unfrozen":
              if (what.frozen === true)
                return this.emit("error", Bitter._errors.IS_FROZEN);

            case "unique":
              if(Bitter.isCollection(this) && this.find(what) !== false)
                return this.emit("error", Bitter._errors.MODEL_ALREADY_EXISTS);

          };
        };
        return true;
      }
    },

    ajax: __ajax,

    extend: function(source, extension) {
      for(prop in extension) {
        source[prop] = extension[prop];
      }
    },

    getID: function () {
      id = 1;
      while (Bitter._instances["b"+id] !== undefined) {
        id++;
      }
      return "b"+id;
    },

    isModel: function (model) {
      return model instanceof Bitter.Model && model.id !== undefined;
    },

    isCollection: function (collection) {
      return collection instanceof Bitter.Collection && collection.id !== undefined;
    }
  };

}();