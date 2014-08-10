var Bitter = {
  _ids: [],
  _instances: {},
  _errors: {
    "IS_FROZEN"     : "This model is frozen and can't accept updates",
    "IS_NOT_MODEL"  : "The given var is not a model"
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