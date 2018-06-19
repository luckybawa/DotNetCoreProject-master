System.register(["../scheduler/async", "../util/isDate", "../OuterSubscriber", "../util/subscribeToResult"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    /**
     * @param due
     * @param withObservable
     * @param scheduler
     * @return {Observable<R>|WebSocketSubject<T>|Observable<T>}
     * @method timeoutWith
     * @owner Observable
     */
    function timeoutWith(due, withObservable, scheduler) {
        if (scheduler === void 0) { scheduler = async_1.async; }
        var absoluteTimeout = isDate_1.isDate(due);
        var waitFor = absoluteTimeout ? (+due - scheduler.now()) : Math.abs(due);
        return this.lift(new TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler));
    }
    exports_1("timeoutWith", timeoutWith);
    var async_1, isDate_1, OuterSubscriber_1, subscribeToResult_1, TimeoutWithOperator, TimeoutWithSubscriber;
    return {
        setters: [
            function (async_1_1) {
                async_1 = async_1_1;
            },
            function (isDate_1_1) {
                isDate_1 = isDate_1_1;
            },
            function (OuterSubscriber_1_1) {
                OuterSubscriber_1 = OuterSubscriber_1_1;
            },
            function (subscribeToResult_1_1) {
                subscribeToResult_1 = subscribeToResult_1_1;
            }
        ],
        execute: function () {
            TimeoutWithOperator = (function () {
                function TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler) {
                    this.waitFor = waitFor;
                    this.absoluteTimeout = absoluteTimeout;
                    this.withObservable = withObservable;
                    this.scheduler = scheduler;
                }
                TimeoutWithOperator.prototype.call = function (subscriber, source) {
                    return source._subscribe(new TimeoutWithSubscriber(subscriber, this.absoluteTimeout, this.waitFor, this.withObservable, this.scheduler));
                };
                return TimeoutWithOperator;
            }());
            /**
             * We need this JSDoc comment for affecting ESDoc.
             * @ignore
             * @extends {Ignored}
             */
            TimeoutWithSubscriber = (function (_super) {
                __extends(TimeoutWithSubscriber, _super);
                function TimeoutWithSubscriber(destination, absoluteTimeout, waitFor, withObservable, scheduler) {
                    var _this = _super.call(this) || this;
                    _this.destination = destination;
                    _this.absoluteTimeout = absoluteTimeout;
                    _this.waitFor = waitFor;
                    _this.withObservable = withObservable;
                    _this.scheduler = scheduler;
                    _this.timeoutSubscription = undefined;
                    _this.index = 0;
                    _this._previousIndex = 0;
                    _this._hasCompleted = false;
                    destination.add(_this);
                    _this.scheduleTimeout();
                    return _this;
                }
                Object.defineProperty(TimeoutWithSubscriber.prototype, "previousIndex", {
                    get: function () {
                        return this._previousIndex;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TimeoutWithSubscriber.prototype, "hasCompleted", {
                    get: function () {
                        return this._hasCompleted;
                    },
                    enumerable: true,
                    configurable: true
                });
                TimeoutWithSubscriber.dispatchTimeout = function (state) {
                    var source = state.subscriber;
                    var currentIndex = state.index;
                    if (!source.hasCompleted && source.previousIndex === currentIndex) {
                        source.handleTimeout();
                    }
                };
                TimeoutWithSubscriber.prototype.scheduleTimeout = function () {
                    var currentIndex = this.index;
                    var timeoutState = { subscriber: this, index: currentIndex };
                    this.scheduler.schedule(TimeoutWithSubscriber.dispatchTimeout, this.waitFor, timeoutState);
                    this.index++;
                    this._previousIndex = currentIndex;
                };
                TimeoutWithSubscriber.prototype._next = function (value) {
                    this.destination.next(value);
                    if (!this.absoluteTimeout) {
                        this.scheduleTimeout();
                    }
                };
                TimeoutWithSubscriber.prototype._error = function (err) {
                    this.destination.error(err);
                    this._hasCompleted = true;
                };
                TimeoutWithSubscriber.prototype._complete = function () {
                    this.destination.complete();
                    this._hasCompleted = true;
                };
                TimeoutWithSubscriber.prototype.handleTimeout = function () {
                    if (!this.closed) {
                        var withObservable = this.withObservable;
                        this.unsubscribe();
                        this.destination.add(this.timeoutSubscription = subscribeToResult_1.subscribeToResult(this, withObservable));
                    }
                };
                return TimeoutWithSubscriber;
            }(OuterSubscriber_1.OuterSubscriber));
        }
    };
});
//# sourceMappingURL=timeoutWith.js.map