System.register(["../Observable", "../Subscription"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var Observable_1, Subscription_1, FromEventPatternObservable;
    return {
        setters: [
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (Subscription_1_1) {
                Subscription_1 = Subscription_1_1;
            }
        ],
        execute: function () {
            /**
             * We need this JSDoc comment for affecting ESDoc.
             * @extends {Ignored}
             * @hide true
             */
            FromEventPatternObservable = (function (_super) {
                __extends(FromEventPatternObservable, _super);
                function FromEventPatternObservable(addHandler, removeHandler, selector) {
                    var _this = _super.call(this) || this;
                    _this.addHandler = addHandler;
                    _this.removeHandler = removeHandler;
                    _this.selector = selector;
                    return _this;
                }
                /**
                 * Creates an Observable from an API based on addHandler/removeHandler
                 * functions.
                 *
                 * <span class="informal">Converts any addHandler/removeHandler API to an
                 * Observable.</span>
                 *
                 * <img src="./img/fromEventPattern.png" width="100%">
                 *
                 * Creates an Observable by using the `addHandler` and `removeHandler`
                 * functions to add and remove the handlers, with an optional selector
                 * function to project the event arguments to a result. The `addHandler` is
                 * called when the output Observable is subscribed, and `removeHandler` is
                 * called when the Subscription is unsubscribed.
                 *
                 * @example <caption>Emits clicks happening on the DOM document</caption>
                 * function addClickHandler(handler) {
                 *   document.addEventListener('click', handler);
                 * }
                 *
                 * function removeClickHandler(handler) {
                 *   document.removeEventListener('click', handler);
                 * }
                 *
                 * var clicks = Rx.Observable.fromEventPattern(
                 *   addClickHandler,
                 *   removeClickHandler
                 * );
                 * clicks.subscribe(x => console.log(x));
                 *
                 * @see {@link from}
                 * @see {@link fromEvent}
                 *
                 * @param {function(handler: Function): any} addHandler A function that takes
                 * a `handler` function as argument and attaches it somehow to the actual
                 * source of events.
                 * @param {function(handler: Function): void} removeHandler A function that
                 * takes a `handler` function as argument and removes it in case it was
                 * previously attached using `addHandler`.
                 * @param {function(...args: any): T} [selector] An optional function to
                 * post-process results. It takes the arguments from the event handler and
                 * should return a single value.
                 * @return {Observable<T>}
                 * @static true
                 * @name fromEventPattern
                 * @owner Observable
                 */
                FromEventPatternObservable.create = function (addHandler, removeHandler, selector) {
                    return new FromEventPatternObservable(addHandler, removeHandler, selector);
                };
                FromEventPatternObservable.prototype._subscribe = function (subscriber) {
                    var _this = this;
                    var removeHandler = this.removeHandler;
                    var handler = !!this.selector ? function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        _this._callSelector(subscriber, args);
                    } : function (e) { subscriber.next(e); };
                    this._callAddHandler(handler, subscriber);
                    subscriber.add(new Subscription_1.Subscription(function () {
                        //TODO: determine whether or not to forward to error handler
                        removeHandler(handler);
                    }));
                };
                FromEventPatternObservable.prototype._callSelector = function (subscriber, args) {
                    try {
                        var result = this.selector.apply(this, args);
                        subscriber.next(result);
                    }
                    catch (e) {
                        subscriber.error(e);
                    }
                };
                FromEventPatternObservable.prototype._callAddHandler = function (handler, errorSubscriber) {
                    try {
                        this.addHandler(handler);
                    }
                    catch (e) {
                        errorSubscriber.error(e);
                    }
                };
                return FromEventPatternObservable;
            }(Observable_1.Observable));
            exports_1("FromEventPatternObservable", FromEventPatternObservable);
        }
    };
});
//# sourceMappingURL=FromEventPatternObservable.js.map