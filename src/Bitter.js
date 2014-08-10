var Bitter = {
  _ids: [],
  _instances: {},
  _errors: {
    "IS_FROZEN"             : "This model is frozen and can't accept updates",
    "IS_NOT_MODEL"          : "The given var is not a model",
    "MODEL_ALREADY_EXISTS"  : "The model is already present: skipping",
    "INDEX_NOT_FOUND"       : "Can't find any model with that index"
  },
  modules: {
    require: function (what, requirements) {
      for ( var i=0; i<requirements.length; i++) {
        switch(requirements[i]) {
          case "isModel":
            if (!(what instanceof Bitter.Model))
              return this.emit("error", Bitter._errors.IS_NOT_MODEL);
            break;

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
    return collection.collection !== undefined
//    return collection instanceof Bitter.Collection && collection.id !== undefined;
  }
};