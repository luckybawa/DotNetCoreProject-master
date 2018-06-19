System.register(["../scheduler/async", "../util/isDate", "../Subscriber", "../util/TimeoutError"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    /**
     * @param {number} due
     * @param {Scheduler} [scheduler]
     * @return {Observable<R>|WebSocketSubject<T>|Observable<T>}
     * @method timeout
     * @owner Observable
     */
    function timeout(due, scheduler) {
        if (scheduler === void 0) { scheduler = async_1.async; }
        var absoluteTimeout = isDate_1.isDate(due);
        var waitFor = absoluteTimeout ? (+due - scheduler.now()) : Math.abs(due);
        return this.lift(new TimeoutOperator(waitFor, absoluteTimeout, scheduler, new TimeoutError_1.TimeoutError()));
    }
    exports_1("timeout", timeout);
    var async_1, isDate_1, Subscriber_1, TimeoutError_1, TimeoutOperator, TimeoutSubscriber;
    return {
        setters: [
            function (async_1_1) {
                async_1 = async_1_1;
            },
            function (isDate_1_1) {
                isDate_1 = isDate_1_1;
            },
            function (Subscriber_1_1) {
                Subscriber_1 = Subscriber_1_1;
            },
            function (TimeoutError_1_1) {
                TimeoutError_1 = TimeoutError_1_1;
            }
        ],
        execute: function () {
            TimeoutOperator = (function () {
                function TimeoutOperator(waitFor, absoluteTimeout, scheduler, errorInstance) {
                    this.waitFor = waitFor;
                    this.absoluteTimeout = absoluteTimeout;
                    this.scheduler = scheduler;
                    this.errorInstance = errorInstance;
                }
                TimeoutOperator.prototype.call = function (subscriber, source) {
                    return source.subscribe(new TimeoutSubscriber(subscriber, this.absoluteTimeout, this.waitFor, this.scheduler, this.errorInstance));
                };
                return TimeoutOperator;
            }());
            /**
             * We need this JSDoc comment for affecting ESDoc.
             * @ignore
             * @extends {Ignored}
             */
            TimeoutSubscriber = (function (_super) {
                __extends(TimeoutSubscriber, _super);
                function TimeoutSubscriber(destination, absoluteTimeout, waitFor, scheduler, errorInstance) {
                    var _this = _super.call(this, destination) || this;
                    _this.absoluteTimeout = absoluteTimeout;
                    _this.waitFor = waitFor;
                    _this.scheduler = scheduler;
                    _this.errorInstance = errorInstance;
                    _this.action = null;
                    _this.scheduleTimeout();
                    return _this;
                }
                TimeoutSubscriber.dispatchTimeout = function (subscriber) {
                    subscriber.error(subscriber.errorInstance);
                };
                TimeoutSubscriber.prototype.scheduleTimeout = function () {
                    var action = this.action;
                    if (action) {
                        // Recycle the action if we've already scheduled one. All the production
                        // Scheduler Actions mutate their state/delay time and return themeselves.
                        // VirtualActions are immutable, so they create and return a clone. In this
                        // case, we need to set the action reference to the most recent VirtualAction,
                        // to ensure that's the one we clone from next time.
                        this.action = action.schedule(this, this.waitFor);
                    }
                    else {
                        this.add(this.action = this.scheduler.schedule(TimeoutSubscriber.dispatchTimeout, this.waitFor, this));
                    }
                };
                TimeoutSubscriber.prototype._next = function (value) {
                    if (!this.absoluteTimeout) {
                        this.scheduleTimeout();
                    }
                    _super.prototype._next.call(this, value);
                };
                TimeoutSubscriber.prototype._unsubscribe = function () {
                    this.action = null;
                    this.scheduler = null;
                    this.errorInstance = null;
                };
                return TimeoutSubscriber;
            }(Subscriber_1.Subscriber));
        }
    };
});
//# sourceMappingURL=timeout.js.map