System.register(["../scheduler/async", "../Subscriber", "../util/isScheduler"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    /* tslint:enable:max-line-length */
    /**
     * Buffers the source Observable values for a specific time period.
     *
     * <span class="informal">Collects values from the past as an array, and emits
     * those arrays periodically in time.</span>
     *
     * <img src="./img/bufferTime.png" width="100%">
     *
     * Buffers values from the source for a specific time duration `bufferTimeSpan`.
     * Unless the optional argument `bufferCreationInterval` is given, it emits and
     * resets the buffer every `bufferTimeSpan` milliseconds. If
     * `bufferCreationInterval` is given, this operator opens the buffer every
     * `bufferCreationInterval` milliseconds and closes (emits and resets) the
     * buffer every `bufferTimeSpan` milliseconds. When the optional argument
     * `maxBufferSize` is specified, the buffer will be closed either after
     * `bufferTimeSpan` milliseconds or when it contains `maxBufferSize` elements.
     *
     * @example <caption>Every second, emit an array of the recent click events</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var buffered = clicks.bufferTime(1000);
     * buffered.subscribe(x => console.log(x));
     *
     * @example <caption>Every 5 seconds, emit the click events from the next 2 seconds</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var buffered = clicks.bufferTime(2000, 5000);
     * buffered.subscribe(x => console.log(x));
     *
     * @see {@link buffer}
     * @see {@link bufferCount}
     * @see {@link bufferToggle}
     * @see {@link bufferWhen}
     * @see {@link windowTime}
     *
     * @param {number} bufferTimeSpan The amount of time to fill each buffer array.
     * @param {number} [bufferCreationInterval] The interval at which to start new
     * buffers.
     * @param {number} [maxBufferSize] The maximum buffer size.
     * @param {Scheduler} [scheduler=async] The scheduler on which to schedule the
     * intervals that determine buffer boundaries.
     * @return {Observable<T[]>} An observable of arrays of buffered values.
     * @method bufferTime
     * @owner Observable
     */
    function bufferTime(bufferTimeSpan) {
        var length = arguments.length;
        var scheduler = async_1.async;
        if (isScheduler_1.isScheduler(arguments[arguments.length - 1])) {
            scheduler = arguments[arguments.length - 1];
            length--;
        }
        var bufferCreationInterval = null;
        if (length >= 2) {
            bufferCreationInterval = arguments[1];
        }
        var maxBufferSize = Number.POSITIVE_INFINITY;
        if (length >= 3) {
            maxBufferSize = arguments[2];
        }
        return this.lift(new BufferTimeOperator(bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler));
    }
    exports_1("bufferTime", bufferTime);
    function dispatchBufferTimeSpanOnly(state) {
        var subscriber = state.subscriber;
        var prevContext = state.context;
        if (prevContext) {
            subscriber.closeContext(prevContext);
        }
        if (!subscriber.closed) {
            state.context = subscriber.openContext();
            state.context.closeAction = this.schedule(state, state.bufferTimeSpan);
        }
    }
    function dispatchBufferCreation(state) {
        var bufferCreationInterval = state.bufferCreationInterval, bufferTimeSpan = state.bufferTimeSpan, subscriber = state.subscriber, scheduler = state.scheduler;
        var context = subscriber.openContext();
        var action = this;
        if (!subscriber.closed) {
            subscriber.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, { subscriber: subscriber, context: context }));
            action.schedule(state, bufferCreationInterval);
        }
    }
    function dispatchBufferClose(arg) {
        var subscriber = arg.subscriber, context = arg.context;
        subscriber.closeContext(context);
    }
    var async_1, Subscriber_1, isScheduler_1, BufferTimeOperator, Context, BufferTimeSubscriber;
    return {
        setters: [
            function (async_1_1) {
                async_1 = async_1_1;
            },
            function (Subscriber_1_1) {
                Subscriber_1 = Subscriber_1_1;
            },
            function (isScheduler_1_1) {
                isScheduler_1 = isScheduler_1_1;
            }
        ],
        execute: function () {
            BufferTimeOperator = (function () {
                function BufferTimeOperator(bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
                    this.bufferTimeSpan = bufferTimeSpan;
                    this.bufferCreationInterval = bufferCreationInterval;
                    this.maxBufferSize = maxBufferSize;
                    this.scheduler = scheduler;
                }
                BufferTimeOperator.prototype.call = function (subscriber, source) {
                    return source.subscribe(new BufferTimeSubscriber(subscriber, this.bufferTimeSpan, this.bufferCreationInterval, this.maxBufferSize, this.scheduler));
                };
                return BufferTimeOperator;
            }());
            Context = (function () {
                function Context() {
                    this.buffer = [];
                }
                return Context;
            }());
            /**
             * We need this JSDoc comment for affecting ESDoc.
             * @ignore
             * @extends {Ignored}
             */
            BufferTimeSubscriber = (function (_super) {
                __extends(BufferTimeSubscriber, _super);
                function BufferTimeSubscriber(destination, bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
                    var _this = _super.call(this, destination) || this;
                    _this.bufferTimeSpan = bufferTimeSpan;
                    _this.bufferCreationInterval = bufferCreationInterval;
                    _this.maxBufferSize = maxBufferSize;
                    _this.scheduler = scheduler;
                    _this.contexts = [];
                    var context = _this.openContext();
                    _this.timespanOnly = bufferCreationInterval == null || bufferCreationInterval < 0;
                    if (_this.timespanOnly) {
                        var timeSpanOnlyState = { subscriber: _this, context: context, bufferTimeSpan: bufferTimeSpan };
                        _this.add(context.closeAction = scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
                    }
                    else {
                        var closeState = { subscriber: _this, context: context };
                        var creationState = { bufferTimeSpan: bufferTimeSpan, bufferCreationInterval: bufferCreationInterval, subscriber: _this, scheduler: scheduler };
                        _this.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, closeState));
                        _this.add(scheduler.schedule(dispatchBufferCreation, bufferCreationInterval, creationState));
                    }
                    return _this;
                }
                BufferTimeSubscriber.prototype._next = function (value) {
                    var contexts = this.contexts;
                    var len = contexts.length;
                    var filledBufferContext;
                    for (var i = 0; i < len; i++) {
                        var context = contexts[i];
                        var buffer = context.buffer;
                        buffer.push(value);
                        if (buffer.length == this.maxBufferSize) {
                            filledBufferContext = context;
                        }
                    }
                    if (filledBufferContext) {
                        this.onBufferFull(filledBufferContext);
                    }
                };
                BufferTimeSubscriber.prototype._error = function (err) {
                    this.contexts.length = 0;
                    _super.prototype._error.call(this, err);
                };
                BufferTimeSubscriber.prototype._complete = function () {
                    var _a = this, contexts = _a.contexts, destination = _a.destination;
                    while (contexts.length > 0) {
                        var context = contexts.shift();
                        destination.next(context.buffer);
                    }
                    _super.prototype._complete.call(this);
                };
                BufferTimeSubscriber.prototype._unsubscribe = function () {
                    this.contexts = null;
                };
                BufferTimeSubscriber.prototype.onBufferFull = function (context) {
                    this.closeContext(context);
                    var closeAction = context.closeAction;
                    closeAction.unsubscribe();
                    this.remove(closeAction);
                    if (!this.closed && this.timespanOnly) {
                        context = this.openContext();
                        var bufferTimeSpan = this.bufferTimeSpan;
                        var timeSpanOnlyState = { subscriber: this, context: context, bufferTimeSpan: bufferTimeSpan };
                        this.add(context.closeAction = this.scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
                    }
                };
                BufferTimeSubscriber.prototype.openContext = function () {
                    var context = new Context();
                    this.contexts.push(context);
                    return context;
                };
                BufferTimeSubscriber.prototype.closeContext = function (context) {
                    this.destination.next(context.buffer);
                    var contexts = this.contexts;
                    var spliceIndex = contexts ? contexts.indexOf(context) : -1;
                    if (spliceIndex >= 0) {
                        contexts.splice(contexts.indexOf(context), 1);
                    }
                };
                return BufferTimeSubscriber;
            }(Subscriber_1.Subscriber));
        }
    };
});
//# sourceMappingURL=bufferTime.js.map