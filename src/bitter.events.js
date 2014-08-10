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