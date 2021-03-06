System.register(["./AsyncAction", "./AsyncScheduler"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AsyncAction_1, AsyncScheduler_1, VirtualTimeScheduler, VirtualAction;
    return {
        setters: [
            function (AsyncAction_1_1) {
                AsyncAction_1 = AsyncAction_1_1;
            },
            function (AsyncScheduler_1_1) {
                AsyncScheduler_1 = AsyncScheduler_1_1;
            }
        ],
        execute: function () {
            VirtualTimeScheduler = (function (_super) {
                __extends(VirtualTimeScheduler, _super);
                function VirtualTimeScheduler(SchedulerAction, maxFrames) {
                    if (SchedulerAction === void 0) { SchedulerAction = VirtualAction; }
                    if (maxFrames === void 0) { maxFrames = Number.POSITIVE_INFINITY; }
                    var _this = _super.call(this, SchedulerAction, function () { return _this.frame; }) || this;
                    _this.maxFrames = maxFrames;
                    _this.frame = 0;
                    _this.index = -1;
                    return _this;
                }
                /**
                 * Prompt the Scheduler to execute all of its queued actions, therefore
                 * clearing its queue.
                 * @return {void}
                 */
                VirtualTimeScheduler.prototype.flush = function () {
                    var _a = this, actions = _a.actions, maxFrames = _a.maxFrames;
                    var error, action;
                    while ((action = actions.shift()) && (this.frame = action.delay) <= maxFrames) {
                        if (error = action.execute(action.state, action.delay)) {
                            break;
                        }
                    }
                    if (error) {
                        while (action = actions.shift()) {
                            action.unsubscribe();
                        }
                        throw error;
                    }
                };
                return VirtualTimeScheduler;
            }(AsyncScheduler_1.AsyncScheduler));
            VirtualTimeScheduler.frameTimeFactor = 10;
            exports_1("VirtualTimeScheduler", VirtualTimeScheduler);
            /**
             * We need this JSDoc comment for affecting ESDoc.
             * @ignore
             * @extends {Ignored}
             */
            VirtualAction = (function (_super) {
                __extends(VirtualAction, _super);
                function VirtualAction(scheduler, work, index) {
                    if (index === void 0) { index = scheduler.index += 1; }
                    var _this = _super.call(this, scheduler, work) || this;
                    _this.scheduler = scheduler;
                    _this.work = work;
                    _this.index = index;
                    _this.active = true;
                    _this.index = scheduler.index = index;
                    return _this;
                }
                VirtualAction.prototype.schedule = function (state, delay) {
                    if (delay === void 0) { delay = 0; }
                    if (!this.id) {
                        return _super.prototype.schedule.call(this, state, delay);
                    }
                    this.active = false;
                    // If an action is rescheduled, we save allocations by mutating its state,
                    // pushing it to the end of the scheduler queue, and recycling the action.
                    // But since the VirtualTimeScheduler is used for testing, VirtualActions
                    // must be immutable so they can be inspected later.
                    var action = new VirtualAction(this.scheduler, this.work);
                    this.add(action);
                    return action.schedule(state, delay);
                };
                VirtualAction.prototype.requestAsyncId = function (scheduler, id, delay) {
                    if (delay === void 0) { delay = 0; }
                    this.delay = scheduler.frame + delay;
                    var actions = scheduler.actions;
                    actions.push(this);
                    actions.sort(VirtualAction.sortActions);
                    return true;
                };
                VirtualAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
                    if (delay === void 0) { delay = 0; }
                    return undefined;
                };
                VirtualAction.prototype._execute = function (state, delay) {
                    if (this.active === true) {
                        return _super.prototype._execute.call(this, state, delay);
                    }
                };
                VirtualAction.sortActions = function (a, b) {
                    if (a.delay === b.delay) {
                        if (a.index === b.index) {
                            return 0;
                        }
                        else if (a.index > b.index) {
                            return 1;
                        }
                        else {
                            return -1;
                        }
                    }
                    else if (a.delay > b.delay) {
                        return 1;
                    }
                    else {
                        return -1;
                    }
                };
                return VirtualAction;
            }(AsyncAction_1.AsyncAction));
            exports_1("VirtualAction", VirtualAction);
        }
    };
});
//# sourceMappingURL=VirtualTimeScheduler.js.map