Bitter.Collection = function (collection) { "use strict";
  Bitter.Events.call(this);

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
    if (Bitter.isModel(model) && this.find(model) === false) {
      this.collection.push(model);
      this.length = this.collection.length;

      this.emit("add", model);
      this.emit("change", this);
    } else {
      this.emit("error", Bitter._errors.IS_NOT_MODEL, model);
    }
  };

  this.find = function (what) {
    var bid = ( Bitter.isModel(what) ? what.id : id);
    for (var i=0; i<this.collection.length; i++) {
      if( this.collection[i].id === bid )
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