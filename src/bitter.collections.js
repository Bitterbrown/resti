Bitter.Collection = function (collection) { "use strict";

  this.id = Bitter.getID();
  this.collection = (collection || []);
  this.length = this.collection.length;

  Bitter._instances[this.id] = this.collection;

  this.bindCollectionEvents.apply(this);
  this.initialize.apply(this, arguments);
};

Bitter.extend(Bitter.Collection.prototype, Bitter.Events);

Bitter.extend(Bitter.Collection.prototype, {

  __require: Bitter.modules.require,

  add: function (model) {
    if(this.__require.call(this, model, ["isModel", "unique"]) !== true) return;

    this.collection.push(model);
    this.length = this.collection.length;

    this.emit("add", model);
    this.emit("change", this);
  },

  at: function (index) {
    if(this.collection[index] !== undefined)
      return this.collection[index];
    else
      this.emit("error", Bitter._errors.INDEX_NOT_FOUND);
  },

  bindCollectionEvents: function () {
    var _this = this;

    this.clearEvents();

    for (var i=0; i<this.collection.length; i++) {
      if (Bitter.isModel(this.collection[i])) {
        this.collection[i].on("change", function (model) {
          _this.emit("change", model);
        });
      };
    };
  },

  find: function (bid) {
    if (Bitter.isModel(bid))
      bid = bid.id;

    for (var i=0; i<this.collection.length; i++) {
      if( this.collection[i].id == bid )
        return this.collection[i];
    };
    return false;
  },

  first: function () {
    return this.at(0);
  },

  last: function () {
    return this.at(this.collection.length-1);
  },


  // User specific
  initialize: function () {}

});