System.register(["../util/Immediate", "./AsyncAction"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var Immediate_1, AsyncAction_1, AsapAction;
    return {
        setters: [
            function (Immediate_1_1) {
                Immediate_1 = Immediate_1_1;
            },
            function (AsyncAction_1_1) {
                AsyncAction_1 = AsyncAction_1_1;
            }
        ],
        execute: function () {
            /**
             * We need this JSDoc comment for affecting ESDoc.
             * @ignore
             * @extends {Ignored}
             */
            AsapAction = (function (_super) {
                __extends(AsapAction, _super);
                function AsapAction(scheduler, work) {
                    var _this = _super.call(this, scheduler, work) || this;
                    _this.scheduler = scheduler;
                    _this.work = work;
                    return _this;
                }
                AsapAction.prototype.requestAsyncId = function (scheduler, id, delay) {
                    if (delay === void 0) { delay = 0; }
                    // If delay is greater than 0, request as an async action.
                    if (delay !== null && delay > 0) {
                        return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
                    }
                    // Push the action to the end of the scheduler queue.
                    scheduler.actions.push(this);
                    // If a microtask has already been scheduled, don't schedule another
                    // one. If a microtask hasn't been scheduled yet, schedule one now. Return
                    // the current scheduled microtask id.
                    return scheduler.scheduled || (scheduler.scheduled = Immediate_1.Immediate.setImmediate(scheduler.flush.bind(scheduler, null)));
                };
                AsapAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
                    if (delay === void 0) { delay = 0; }
                    // If delay exists and is greater than 0, or if the delay is null (the
                    // action wasn't rescheduled) but was originally scheduled as an async
                    // action, then recycle as an async action.
                    if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
                        return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
                    }
                    // If the scheduler queue is empty, cancel the requested microtask and
                    // set the scheduled flag to undefined so the next AsapAction will schedule
                    // its own.
                    if (scheduler.actions.length === 0) {
                        Immediate_1.Immediate.clearImmediate(id);
                        scheduler.scheduled = undefined;
                    }
                    // Return undefined so the action knows to request a new async id if it's rescheduled.
                    return undefined;
                };
                return AsapAction;
            }(AsyncAction_1.AsyncAction));
            exports_1("AsapAction", AsapAction);
        }
    };
});
//# sourceMappingURL=AsapAction.js.map