System.register(["../Subscriber", "../util/EmptyError"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    /**
     * Emits only the first value (or the first value that meets some condition)
     * emitted by the source Observable.
     *
     * <span class="informal">Emits only the first value. Or emits only the first
     * value that passes some test.</span>
     *
     * <img src="./img/first.png" width="100%">
     *
     * If called with no arguments, `first` emits the first value of the source
     * Observable, then completes. If called with a `predicate` function, `first`
     * emits the first value of the source that matches the specified condition. It
     * may also take a `resultSelector` function to produce the output value from
     * the input value, and a `defaultValue` to emit in case the source completes
     * before it is able to emit a valid value. Throws an error if `defaultValue`
     * was not provided and a matching element is not found.
     *
     * @example <caption>Emit only the first click that happens on the DOM</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var result = clicks.first();
     * result.subscribe(x => console.log(x));
     *
     * @example <caption>Emits the first click that happens on a DIV</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var result = clicks.first(ev => ev.target.tagName === 'DIV');
     * result.subscribe(x => console.log(x));
     *
     * @see {@link filter}
     * @see {@link find}
     * @see {@link take}
     *
     * @throws {EmptyError} Delivers an EmptyError to the Observer's `error`
     * callback if the Observable completes before any `next` notification was sent.
     *
     * @param {function(value: T, index: number, source: Observable<T>): boolean} [predicate]
     * An optional function called with each item to test for condition matching.
     * @param {function(value: T, index: number): R} [resultSelector] A function to
     * produce the value on the output Observable based on the values
     * and the indices of the source Observable. The arguments passed to this
     * function are:
     * - `value`: the value that was emitted on the source.
     * - `index`: the "index" of the value from the source.
     * @param {R} [defaultValue] The default value emitted in case no valid value
     * was found on the source.
     * @return {Observable<T|R>} An Observable of the first item that matches the
     * condition.
     * @method first
     * @owner Observable
     */
    function first(predicate, resultSelector, defaultValue) {
        return this.lift(new FirstOperator(predicate, resultSelector, defaultValue, this));
    }
    exports_1("first", first);
    var Subscriber_1, EmptyError_1, FirstOperator, FirstSubscriber;
    return {
        setters: [
            function (Subscriber_1_1) {
                Subscriber_1 = Subscriber_1_1;
            },
            function (EmptyError_1_1) {
                EmptyError_1 = EmptyError_1_1;
            }
        ],
        execute: function () {
            FirstOperator = (function () {
                function FirstOperator(predicate, resultSelector, defaultValue, source) {
                    this.predicate = predicate;
                    this.resultSelector = resultSelector;
                    this.defaultValue = defaultValue;
                    this.source = source;
                }
                FirstOperator.prototype.call = function (observer, source) {
                    return source.subscribe(new FirstSubscriber(observer, this.predicate, this.resultSelector, this.defaultValue, this.source));
                };
                return FirstOperator;
            }());
            /**
             * We need this JSDoc comment for affecting ESDoc.
             * @ignore
             * @extends {Ignored}
             */
            FirstSubscriber = (function (_super) {
                __extends(FirstSubscriber, _super);
                function FirstSubscriber(destination, predicate, resultSelector, defaultValue, source) {
                    var _this = _super.call(this, destination) || this;
                    _this.predicate = predicate;
                    _this.resultSelector = resultSelector;
                    _this.defaultValue = defaultValue;
                    _this.source = source;
                    _this.index = 0;
                    _this.hasCompleted = false;
                    _this._emitted = false;
                    return _this;
                }
                FirstSubscriber.prototype._next = function (value) {
                    var index = this.index++;
                    if (this.predicate) {
                        this._tryPredicate(value, index);
                    }
                    else {
                        this._emit(value, index);
                    }
                };
                FirstSubscriber.prototype._tryPredicate = function (value, index) {
                    var result;
                    try {
                        result = this.predicate(value, index, this.source);
                    }
                    catch (err) {
                        this.destination.error(err);
                        return;
                    }
                    if (result) {
                        this._emit(value, index);
                    }
                };
                FirstSubscriber.prototype._emit = function (value, index) {
                    if (this.resultSelector) {
                        this._tryResultSelector(value, index);
                        return;
                    }
                    this._emitFinal(value);
                };
                FirstSubscriber.prototype._tryResultSelector = function (value, index) {
                    var result;
                    try {
                        result = this.resultSelector(value, index);
                    }
                    catch (err) {
                        this.destination.error(err);
                        return;
                    }
                    this._emitFinal(result);
                };
                FirstSubscriber.prototype._emitFinal = function (value) {
                    var destination = this.destination;
                    if (!this._emitted) {
                        this._emitted = true;
                        destination.next(value);
                        destination.complete();
                        this.hasCompleted = true;
                    }
                };
                FirstSubscriber.prototype._complete = function () {
                    var destination = this.destination;
                    if (!this.hasCompleted && typeof this.defaultValue !== 'undefined') {
                        destination.next(this.defaultValue);
                        destination.complete();
                    }
                    else if (!this.hasCompleted) {
                        destination.error(new EmptyError_1.EmptyError);
                    }
                };
                return FirstSubscriber;
            }(Subscriber_1.Subscriber));
        }
    };
});
//# sourceMappingURL=first.js.map