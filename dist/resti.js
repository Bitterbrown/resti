var Bitter = {
  _ids: [],
  _instances: {},
  _errors: {
    "IS_FROZEN"             : "This model is frozen and can't accept updates",
    "IS_NOT_MODEL"          : "The given var is not a model",
    "MODEL_ALREADY_EXISTS"  : "The model is already present: skipping",
    "MODEL_HAS_NO_ID"       : "The model doesn't have an ID",
    "NO_API_URI"            : "No API uri is provided",
    "INDEX_NOT_FOUND"       : "Can't find any model with that index"
  },
  config: {
    apiUri: false
  },
  modules: {

    // Must run on collection scope
    require: function (what, requirements) {
      for ( var i=0; i<requirements.length; i++) {
        switch(requirements[i]) {
          case "isModel":
            if (!(what instanceof Bitter.Model))
              return this.emit("error", Bitter._errors.IS_NOT_MODEL);
            break;

          case "hasApiUrl":
            if (Bitter.config.apiUri === false)
              return this.emit("error", Bitter._errors.NO_API_URI);

          case "modelHasID":
            if (what.attributes === undefined || what.attributes.id === undefined)
              return this.emit("error", Bitter._errors.MODEL_HAS_NO_ID);

          case "unfrozen":
            if (what.frozen === true)
              return this.emit("error", Bitter._errors.IS_FROZEN);

          case "unique":
            if(Bitter.isCollection(this) && this.find(what) !== false)
              return this.emit("error", Bitter._errors.MODEL_ALREADY_EXISTS);

        };
      };
      return true;
    }
  },

  extend: function(source, extension) {
    for(prop in extension) {
      source[prop] = extension[prop];
    }
  },

  getID: function () {
    id = 1;
    while (Bitter._instances["b"+id] !== undefined) {
      id++;
    }
    return "b"+id;
  },

  isModel: function (model) {
    return model instanceof Bitter.Model && model.id !== undefined;
  },

  isCollection: function (collection) {
    return collection instanceof Bitter.Collection && collection.id !== undefined;
  }
};
Bitter.Events = {
  _events: [],

  on: function (eventName, callback) {
    if (this._events[eventName] === undefined) {
      this._events[eventName] = new Array();
    }
    this._events[eventName].push (callback);
  },

  emit: function (name, value) {
    if (this._events[name] !== undefined ) {
      for (var i = 0; i<this._events[name].length; i++) {
        this._events[name][i](value || null);
      };
    };
  },

  clearEvents: function () {
    this._events = [];
  }
};
Bitter.Model = function (attributes) { "use strict";

  this.id = Bitter.getID();
  this.attributes = attributes;
  this.frozen = false;

  Bitter._instances[this.id] = this.attributes;
};

Bitter.extend(Bitter.Model.prototype, Bitter.Events);

Bitter.extend(Bitter.Model.prototype, {

  __require: Bitter.modules.require,

  create: function () {
    if(this.__require(this, ["hasApiUrl", "modelHasID"]) !== true) return;

    var _this = this;

    $.ajax({
      url: this.url(),
      method: "POST",
      success: function (data) {
        _this.parse(data);
      }
    });
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

    $.ajax({
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
    return Bitter.config.apiUri + "/" + this.get("id");
  }

});
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