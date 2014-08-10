Bitter.Model = function (attributes) { "use strict";

  this.id = Bitter.getID();
  this.attributes = attributes;
  this.frozen = false;

  Bitter._instances[this.id] = this.attributes;
};

Bitter.extend(Bitter.Model.prototype, Bitter.Events);

Bitter.extend(Bitter.Model.prototype, {

  __require: Bitter.modules.require,

  freeze: function (status) {
    this.frozen = (status || true);
  },

  get: function (name) {
    return this.attributes[name];
  },

  set: function (attribute, value) {
    if(this.__require(this, ["unfrozen"]) !== true) return;

    this.attributes[attribute] = value;

    this.emit("change", this);
    this.emit("change:"+attribute, value);
  },

  link: function (attribute, referenceModel, referenceAttribute) {
    if(this.__require(this, ["unfrozen"]) !== true) return;

    var _this = this;

    referenceModel.on("change:"+referenceAttribute, function (value) {
      _this.set(attribute, value);
    });
  },

  reset: function (hash) {
    if(this.__require(this, ["unfrozen"]) !== true) return;

    this.attributes = (hash || {});

    this.emit("change", this);
  },

  unfreeze: function () {
    this.frozen = false;
  }

});