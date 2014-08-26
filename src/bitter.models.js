Bitter.Model = function (attributes) { "use strict";

  this.id = Bitter.getID();
  this.attributes = attributes || {};
  this.frozen = false;

  Bitter._instances[this.id] = this.attributes;
};

Bitter.extend(Bitter.Model.prototype, Bitter.Events);

Bitter.extend(Bitter.Model.prototype, {

  __require: Bitter.modules.require,

  attach: function (attribute, attachment, method) {
    this.on("change:"+attribute, function (value) {
      attachment[(method || "text")](value);
    });
  },

  create: function () {
    if(this.__require(this, ["hasApiUrl", "modelHasID"]) !== true) return;

    var _this = this;

    Bitter.ajax({
      url: this.url(),
      method: "POST",
      success: function (data) {
        _this.parse(data);
        _this.doneInternal(data);
      }
    });
    return this;
  },

  delete: function () {
    if(this.__require(this, ["hasApiUrl", "modelHasID"]) !== true) return;

    Bitter.ajax({
      url: this.url(),
      method: "DELETE",
      success: function (data) {
        _this.doneInternal(data);
      }
    });
    return this;
  },

  done: function (callback) {
    this.doneCallback = callback;
  },

  doneInternal: function (data) {
    if (this.doneCallback !== undefined && typeof(this.doneCallback) === "function") {
      this.doneCallback(data);
      this.doneCallback = undefined;
    };
  },

  fetch: function () {
    if(this.__require(this, ["hasApiUrl", "modelHasID"]) !== true) return;
    var _this = this;

    Bitter.ajax({
      url: this.url(),
      method: "GET",
      success: function (data) {
        _this.reset(_this.parse(data));
        _this.doneInternal(data);
      }
    });

    return this;
  },

  freeze: function (status) {
    this.frozen = (status || true);
  },

  get: function (name) {
    return this.attributes[name];
  },

  link: function (attribute, referenceModel, referenceAttribute) {
    if(this.__require(this, ["unfrozen"]) !== true) return;

    var _this = this;

    referenceModel.on("change:"+referenceAttribute, function (value) {
      _this.attributes[attribute] = value;
    });
  },

  parse: function (data) {
    return data;
  },

  reset: function (hash) {
    if(this.__require(this, ["unfrozen"]) !== true) return;

    this.attributes = (hash || {});

    this.emit("change", this);
  },

  set: function (attribute, value) {
    if(this.__require(this, ["unfrozen"]) !== true) return;

    this.attributes[attribute] = value;

    this.emit("change", this);
    this.emit("change:"+attribute, value);
  },

  unfreeze: function () {
    this.frozen = false;
  },

  url: function () {
    return Bitter.defaults.api.uri + "/" + this.get("id");
  }

});