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

  this.collection = (collection || []);
  this.length = this.collection.length;
  this.id = Bitter.getID();

  Bitter._instances[this.id] = this.collection;

  this.bindCollectionEvents();
};