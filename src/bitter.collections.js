Bitter.Collection = function (collection) { "use strict";
  Bitter.Events.call(this);
  this.__require = Bitter.modules.require;

  this.bindCollectionEvents = function () {
    Bitter.Events.Reset.call(this);
    var _this = this;

    for (var i=0; i<this.collection.length; i++) {
      if (Bitter.isModel(this.collection[i])) {
        this.collection[i].on("change", function (model) {
          _this.emit("change", model);
        });
      };
    };
  };

  this.add = function (model) {
    if(this.__require(model, ["isModel", "unique"]) !== true) return;

    this.collection.push(model);
    this.length = this.collection.length;

    this.emit("add", model);
    this.emit("change", this);
  };

  this.at = function (index) {
    if(this.collection[index] !== undefined)
      return this.collection[index];
    else
      this.emit("error", Bitter._errors.INDEX_NOT_FOUND);
  };

  this.find = function (bid) {
    if (Bitter.isModel(bid))
      bid = bid.id;

    for (var i=0; i<this.collection.length; i++) {
      if( this.collection[i].id == bid )
        return this.collection[i];
    };
    return false;
  };

  this.collection = (collection || []);
  this.length = this.collection.length;
  this.id = Bitter.getID();

  Bitter._instances[this.id] = this.collection;

  this.bindCollectionEvents();
};