describe("Connections", function () {

  describe("Ajax call", function () {

    beforeEach(function () {
      Bitter.defaults = {
        api: {
          uri: "http://tre.rigorix.com/api",
          version: false
        }
      };
    });

    it("should have a call method to call API", function () {
      assume("var Bitter.ajax isnt undefined");
    });

    it("ajax should call jQuery.ajax with same params", function () {
      assume("method jQuery.ajax is called", function () {
        Bitter.ajax({url: 'uri'});

        assume("var jQuery.ajax.mostRecentCall.args[0].url is 'uri'");
      });
    });

  });

});