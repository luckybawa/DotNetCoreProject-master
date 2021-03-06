System.register(["../Scheduler"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var Scheduler_1, AsyncScheduler;
    return {
        setters: [
            function (Scheduler_1_1) {
                Scheduler_1 = Scheduler_1_1;
            }
        ],
        execute: function () {
            AsyncScheduler = (function (_super) {
                __extends(AsyncScheduler, _super);
                function AsyncScheduler() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.actions = [];
                    /**
                     * A flag to indicate whether the Scheduler is currently executing a batch of
                     * queued actions.
                     * @type {boolean}
                     */
                    _this.active = false;
                    /**
                     * An internal ID used to track the latest asynchronous task such as those
                     * coming from `setTimeout`, `setInterval`, `requestAnimationFrame`, and
                     * others.
                     * @type {any}
                     */
                    _this.scheduled = undefined;
                    return _this;
                }
                AsyncScheduler.prototype.flush = function (action) {
                    var actions = this.actions;
                    if (this.active) {
                        actions.push(action);
                        return;
                    }
                    var error;
                    this.active = true;
                    do {
                        if (error = action.execute(action.state, action.delay)) {
                            break;
                        }
                    } while (action = actions.shift()); // exhaust the scheduler queue
                    this.active = false;
                    if (error) {
                        while (action = actions.shift()) {
                            action.unsubscribe();
                        }
                        throw error;
                    }
                };
                return AsyncScheduler;
            }(Scheduler_1.Scheduler));
            exports_1("AsyncScheduler", AsyncScheduler);
        }
    };
});
//# sourceMappingURL=AsyncScheduler.js.map