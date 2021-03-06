System.register(["../Subject", "../OuterSubscriber", "../util/subscribeToResult"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    /**
     * Branch out the source Observable values as a nested Observable whenever
     * `windowBoundaries` emits.
     *
     * <span class="informal">It's like {@link buffer}, but emits a nested Observable
     * instead of an array.</span>
     *
     * <img src="./img/window.png" width="100%">
     *
     * Returns an Observable that emits windows of items it collects from the source
     * Observable. The output Observable emits connected, non-overlapping
     * windows. It emits the current window and opens a new one whenever the
     * Observable `windowBoundaries` emits an item. Because each window is an
     * Observable, the output is a higher-order Observable.
     *
     * @example <caption>In every window of 1 second each, emit at most 2 click events</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var interval = Rx.Observable.interval(1000);
     * var result = clicks.window(interval)
     *   .map(win => win.take(2)) // each window has at most 2 emissions
     *   .mergeAll(); // flatten the Observable-of-Observables
     * result.subscribe(x => console.log(x));
     *
     * @see {@link windowCount}
     * @see {@link windowTime}
     * @see {@link windowToggle}
     * @see {@link windowWhen}
     * @see {@link buffer}
     *
     * @param {Observable<any>} windowBoundaries An Observable that completes the
     * previous window and starts a new window.
     * @return {Observable<Observable<T>>} An Observable of windows, which are
     * Observables emitting values of the source Observable.
     * @method window
     * @owner Observable
     */
    function window(windowBoundaries) {
        return this.lift(new WindowOperator(windowBoundaries));
    }
    exports_1("window", window);
    var Subject_1, OuterSubscriber_1, subscribeToResult_1, WindowOperator, WindowSubscriber;
    return {
        setters: [
            function (Subject_1_1) {
                Subject_1 = Subject_1_1;
            },
            function (OuterSubscriber_1_1) {
                OuterSubscriber_1 = OuterSubscriber_1_1;
            },
            function (subscribeToResult_1_1) {
                subscribeToResult_1 = subscribeToResult_1_1;
            }
        ],
        execute: function () {
            WindowOperator = (function () {
                function WindowOperator(windowBoundaries) {
                    this.windowBoundaries = windowBoundaries;
                }
                WindowOperator.prototype.call = function (subscriber, source) {
                    var windowSubscriber = new WindowSubscriber(subscriber);
                    var sourceSubscription = source.subscribe(windowSubscriber);
                    if (!sourceSubscription.closed) {
                        windowSubscriber.add(subscribeToResult_1.subscribeToResult(windowSubscriber, this.windowBoundaries));
                    }
                    return sourceSubscription;
                };
                return WindowOperator;
            }());
            /**
             * We need this JSDoc comment for affecting ESDoc.
             * @ignore
             * @extends {Ignored}
             */
            WindowSubscriber = (function (_super) {
                __extends(WindowSubscriber, _super);
                function WindowSubscriber(destination) {
                    var _this = _super.call(this, destination) || this;
                    _this.window = new Subject_1.Subject();
                    destination.next(_this.window);
                    return _this;
                }
                WindowSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
                    this.openWindow();
                };
                WindowSubscriber.prototype.notifyError = function (error, innerSub) {
                    this._error(error);
                };
                WindowSubscriber.prototype.notifyComplete = function (innerSub) {
                    this._complete();
                };
                WindowSubscriber.prototype._next = function (value) {
                    this.window.next(value);
                };
                WindowSubscriber.prototype._error = function (err) {
                    this.window.error(err);
                    this.destination.error(err);
                };
                WindowSubscriber.prototype._complete = function () {
                    this.window.complete();
                    this.destination.complete();
                };
                WindowSubscriber.prototype._unsubscribe = function () {
                    this.window = null;
                };
                WindowSubscriber.prototype.openWindow = function () {
                    var prevWindow = this.window;
                    if (prevWindow) {
                        prevWindow.complete();
                    }
                    var destination = this.destination;
                    var newWindow = this.window = new Subject_1.Subject();
                    destination.next(newWindow);
                };
                return WindowSubscriber;
            }(OuterSubscriber_1.OuterSubscriber));
        }
    };
});
//# sourceMappingURL=window.js.map