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

Bitter.Events.Reset = function () { "use strict";
  var _events = [];
};