Bitter.Model = function (attributes) { "use strict";
  Bitter.Events.call(this);
  this.__require = Bitter.modules.require;

  this.attributes = attributes;
  this.id = Bitter.getID();
  this.frozen = false;

  Bitter._instances[this.id] = this.attributes;

  this.freeze = function (status) {
    this.frozen = (status || true);
  };

  this.get = function (name) {
    return this.attributes[name];
  };

  this.set = function (attribute, value) {
    if(this.__require(this, ["unfrozen"]) !== true) return;

    this.attributes[attribute] = value;

    this.emit("change", this);
    this.emit("change:"+attribute, value);
  };

  this.link = function (attribute, referenceModel, referenceAttribute) {
    if(this.__require(this, ["unfrozen"]) !== true) return;

    var _this = this;

    referenceModel.on("change:"+referenceAttribute, function (value) {
      _this.set(attribute, value);
    });
  };

  this.reset = function (hash) {
    if(this.__require(this, ["unfrozen"]) !== true) return;

    this.attributes = (hash || {});

    this.emit("change", this);
  };

  this.unfreeze = function () {
    this.frozen = false;
  };

};