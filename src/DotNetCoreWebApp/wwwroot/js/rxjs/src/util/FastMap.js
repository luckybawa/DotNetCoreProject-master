System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var FastMap;
    return {
        setters: [],
        execute: function () {
            FastMap = (function () {
                function FastMap() {
                    this.values = {};
                }
                FastMap.prototype.delete = function (key) {
                    this.values[key] = null;
                    return true;
                };
                FastMap.prototype.set = function (key, value) {
                    this.values[key] = value;
                    return this;
                };
                FastMap.prototype.get = function (key) {
                    return this.values[key];
                };
                FastMap.prototype.forEach = function (cb, thisArg) {
                    var values = this.values;
                    for (var key in values) {
                        if (values.hasOwnProperty(key) && values[key] !== null) {
                            cb.call(thisArg, values[key], key);
                        }
                    }
                };
                FastMap.prototype.clear = function () {
                    this.values = {};
                };
                return FastMap;
            }());
            exports_1("FastMap", FastMap);
        }
    };
});
//# sourceMappingURL=FastMap.js.map