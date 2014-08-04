var Bitter = {
  _ids: [],
  _instances: {},

  getID: function () {
    id = 1;
    while (Bitter._instances["b"+id] !== undefined) {
      id++;
    }
    return "b"+id;
  }
};

Bitter.Events = function () { "use strict";
  var _events = [];

  this.on = function (eventName, callback) {
    if (_events[eventName] === undefined) {
      _events[eventName] = new Array();
    }
    _events[eventName].push (callback);
  };

  this.emit = function (name, value) {
    if (_events[name] !== undefined ) {
      for (var i = 0; i<_events[name].length; i++) {
        _events[name][i](value || null);
      };
    };
  };

  return _events;
};

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
      this.emit("error", "This model is frozen and can't accept updates");
    }
  };

  this.reset = function (hash) {
    if (this.frozen !== true) {
      this.attributes = (hash || {});

      this.emit("change", this.attributes);
    } else {
      this.emit("error", "This model is frozen and can't accept updates");
    }
  };

  this.unfreeze = function () {
    this.frozen = false;
  };
};