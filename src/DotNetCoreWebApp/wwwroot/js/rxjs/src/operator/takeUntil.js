System.register(["../OuterSubscriber", "../util/subscribeToResult"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    /**
     * Emits the values emitted by the source Observable until a `notifier`
     * Observable emits a value.
     *
     * <span class="informal">Lets values pass until a second Observable,
     * `notifier`, emits something. Then, it completes.</span>
     *
     * <img src="./img/takeUntil.png" width="100%">
     *
     * `takeUntil` subscribes and begins mirroring the source Observable. It also
     * monitors a second Observable, `notifier` that you provide. If the `notifier`
     * emits a value or a complete notification, the output Observable stops
     * mirroring the source Observable and completes.
     *
     * @example <caption>Tick every second until the first click happens</caption>
     * var interval = Rx.Observable.interval(1000);
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var result = interval.takeUntil(clicks);
     * result.subscribe(x => console.log(x));
     *
     * @see {@link take}
     * @see {@link takeLast}
     * @see {@link takeWhile}
     * @see {@link skip}
     *
     * @param {Observable} notifier The Observable whose first emitted value will
     * cause the output Observable of `takeUntil` to stop emitting values from the
     * source Observable.
     * @return {Observable<T>} An Observable that emits the values from the source
     * Observable until such time as `notifier` emits its first value.
     * @method takeUntil
     * @owner Observable
     */
    function takeUntil(notifier) {
        return this.lift(new TakeUntilOperator(notifier));
    }
    exports_1("takeUntil", takeUntil);
    var OuterSubscriber_1, subscribeToResult_1, TakeUntilOperator, TakeUntilSubscriber;
    return {
        setters: [
            function (OuterSubscriber_1_1) {
                OuterSubscriber_1 = OuterSubscriber_1_1;
            },
            function (subscribeToResult_1_1) {
                subscribeToResult_1 = subscribeToResult_1_1;
            }
        ],
        execute: function () {
            TakeUntilOperator = (function () {
                function TakeUntilOperator(notifier) {
                    this.notifier = notifier;
                }
                TakeUntilOperator.prototype.call = function (subscriber, source) {
                    return source._subscribe(new TakeUntilSubscriber(subscriber, this.notifier));
                };
                return TakeUntilOperator;
            }());
            /**
             * We need this JSDoc comment for affecting ESDoc.
             * @ignore
             * @extends {Ignored}
             */
            TakeUntilSubscriber = (function (_super) {
                __extends(TakeUntilSubscriber, _super);
                function TakeUntilSubscriber(destination, notifier) {
                    var _this = _super.call(this, destination) || this;
                    _this.notifier = notifier;
                    _this.add(subscribeToResult_1.subscribeToResult(_this, notifier));
                    return _this;
                }
                TakeUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
                    this.complete();
                };
                TakeUntilSubscriber.prototype.notifyComplete = function () {
                    // noop
                };
                return TakeUntilSubscriber;
            }(OuterSubscriber_1.OuterSubscriber));
        }
    };
});
//# sourceMappingURL=takeUntil.js.map