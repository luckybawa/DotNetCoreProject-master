System.register(["./AsyncAction", "../util/AnimationFrame"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AsyncAction_1, AnimationFrame_1, AnimationFrameAction;
    return {
        setters: [
            function (AsyncAction_1_1) {
                AsyncAction_1 = AsyncAction_1_1;
            },
            function (AnimationFrame_1_1) {
                AnimationFrame_1 = AnimationFrame_1_1;
            }
        ],
        execute: function () {
            /**
             * We need this JSDoc comment for affecting ESDoc.
             * @ignore
             * @extends {Ignored}
             */
            AnimationFrameAction = (function (_super) {
                __extends(AnimationFrameAction, _super);
                function AnimationFrameAction(scheduler, work) {
                    var _this = _super.call(this, scheduler, work) || this;
                    _this.scheduler = scheduler;
                    _this.work = work;
                    return _this;
                }
                AnimationFrameAction.prototype.requestAsyncId = function (scheduler, id, delay) {
                    if (delay === void 0) { delay = 0; }
                    // If delay is greater than 0, request as an async action.
                    if (delay !== null && delay > 0) {
                        return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
                    }
                    // Push the action to the end of the scheduler queue.
                    scheduler.actions.push(this);
                    // If an animation frame has already been requested, don't request another
                    // one. If an animation frame hasn't been requested yet, request one. Return
                    // the current animation frame request id.
                    return scheduler.scheduled || (scheduler.scheduled = AnimationFrame_1.AnimationFrame.requestAnimationFrame(scheduler.flush.bind(scheduler, null)));
                };
                AnimationFrameAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
                    if (delay === void 0) { delay = 0; }
                    // If delay exists and is greater than 0, or if the delay is null (the
                    // action wasn't rescheduled) but was originally scheduled as an async
                    // action, then recycle as an async action.
                    if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
                        return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
                    }
                    // If the scheduler queue is empty, cancel the requested animation frame and
                    // set the scheduled flag to undefined so the next AnimationFrameAction will
                    // request its own.
                    if (scheduler.actions.length === 0) {
                        AnimationFrame_1.AnimationFrame.cancelAnimationFrame(id);
                        scheduler.scheduled = undefined;
                    }
                    // Return undefined so the action knows to request a new async id if it's rescheduled.
                    return undefined;
                };
                return AnimationFrameAction;
            }(AsyncAction_1.AsyncAction));
            exports_1("AnimationFrameAction", AnimationFrameAction);
        }
    };
});
//# sourceMappingURL=AnimationFrameAction.js.map