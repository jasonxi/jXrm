define([], function() {
    "use strict";

    var Collection = function () {
        this.items = [];
    };

    Collection.prototype = {
        exec: function (callback) {
            this.items.forEach(function (a) {
              if (callback)
                callback(a);
            });
        },
        push: function(o) {
            this.items.push(o);
        },
        get first() {
            return this.items.length > 0? this.items[0] : null;
        },
        get length() {
            return this.items.length;
        }
    };

    return Collection;
});