System.register(["../../Observable", "../../operator/sequenceEqual"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Observable_1, sequenceEqual_1;
    return {
        setters: [
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (sequenceEqual_1_1) {
                sequenceEqual_1 = sequenceEqual_1_1;
            }
        ],
        execute: function () {
            Observable_1.Observable.prototype.sequenceEqual = sequenceEqual_1.sequenceEqual;
        }
    };
});
//# sourceMappingURL=sequenceEqual.js.map