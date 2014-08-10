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
    return (model !== undefined && model.id !== undefined && Bitter._instances[model.id] !== undefined && model.attributes !== undefined && model.collection === undefined);
  },

  isCollection: function (collection) {
    return (collection !== undefined && collection.id !== undefined && Bitter._instances[collection.id] !== undefined && collection.attributes === undefined && collection.collection !== undefined);
  }
};