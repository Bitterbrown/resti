var Bitter = function () {

  // Initial Setup
  if(jQuery === undefined)
    console.error("Resti requires jquery to make ajax calls");

  var defaults = {
    api: {
      uri: false,
      version: false
    },
    ajax: {
      method    : "GET",
      async     : true,
      timeout   : 60000
    }
  };

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
    defaults: defaults,
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

    ajax: function () {
      for(prop in defaults.ajax) {
        if (arguments[0][prop] === undefined)
          arguments[0][prop] = defaults.ajax[prop];
      }
      jQuery.ajax.apply(this, arguments);
    },

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