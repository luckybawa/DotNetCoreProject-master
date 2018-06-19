System.register(["../../Observable", "../../operator/zip"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Observable_1, zip_1;
    return {
        setters: [
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (zip_1_1) {
                zip_1 = zip_1_1;
            }
        ],
        execute: function () {
            Observable_1.Observable.prototype.zip = zip_1.zipProto;
        }
    };
});
//# sourceMappingURL=zip.js.map