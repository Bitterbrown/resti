var Bitter = {
  _ids: [],
  _instances: {},
  _errors: {
    "IS_FROZEN": "This model is frozen and can't accept updates"
  },

  getID: function () {
    id = 1;
    while (Bitter._instances["b"+id] !== undefined) {
      id++;
    }
    return "b"+id;
  }
};