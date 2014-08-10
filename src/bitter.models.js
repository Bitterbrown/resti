Bitter.Model = function (attributes) { "use strict";
  Bitter.Events.call(this);

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
    if (this.frozen !== true) {
      this.attributes[attribute] = value;

      this.emit("change", this.attributes);
      this.emit("change:"+attribute, value);
    } else {
      this.emit("error", Bitter._errors.IS_FROZEN);
    }
  };

  this.reset = function (hash) {
    if (this.frozen !== true) {
      this.attributes = (hash || {});

      this.emit("change", this.attributes);
    } else {
      this.emit("error", Bitter._errors.IS_FROZEN);
    }
  };

  this.unfreeze = function () {
    this.frozen = false;
  };

  return {
    attributes:   this.attributes,
    set:          this.set,
    get:          this.get,
    freeze:       this.freeze,
    unfreeze:     this.unfreeze,
    id:           this.id,
    emit:         this.emit,
    on:           this.on,
    reset:        this.reset
  }
};