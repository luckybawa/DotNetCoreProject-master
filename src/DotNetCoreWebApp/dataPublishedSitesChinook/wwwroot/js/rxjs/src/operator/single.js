System.register(["../Subscriber", "../util/EmptyError"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    /**
     * Returns an Observable that emits the single item emitted by the source Observable that matches a specified
     * predicate, if that Observable emits one such item. If the source Observable emits more than one such item or no
     * such items, notify of an IllegalArgumentException or NoSuchElementException respectively.
     *
     * <img src="./img/single.png" width="100%">
     *
     * @throws {EmptyError} Delivers an EmptyError to the Observer's `error`
     * callback if the Observable completes before any `next` notification was sent.
     * @param {Function} a predicate function to evaluate items emitted by the source Observable.
     * @return {Observable<T>} an Observable that emits the single item emitted by the source Observable that matches
     * the predicate.
     .
     * @method single
     * @owner Observable
     */
    function single(predicate) {
        return this.lift(new SingleOperator(predicate, this));
    }
    exports_1("single", single);
    var Subscriber_1, EmptyError_1, SingleOperator, SingleSubscriber;
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
            SingleOperator = (function () {
                function SingleOperator(predicate, source) {
                    this.predicate = predicate;
                    this.source = source;
                }
                SingleOperator.prototype.call = function (subscriber, source) {
                    return source._subscribe(new SingleSubscriber(subscriber, this.predicate, this.source));
                };
                return SingleOperator;
            }());
            /**
             * We need this JSDoc comment for affecting ESDoc.
             * @ignore
             * @extends {Ignored}
             */
            SingleSubscriber = (function (_super) {
                __extends(SingleSubscriber, _super);
                function SingleSubscriber(destination, predicate, source) {
                    var _this = _super.call(this, destination) || this;
                    _this.predicate = predicate;
                    _this.source = source;
                    _this.seenValue = false;
                    _this.index = 0;
                    return _this;
                }
                SingleSubscriber.prototype.applySingleValue = function (value) {
                    if (this.seenValue) {
                        this.destination.error('Sequence contains more than one element');
                    }
                    else {
                        this.seenValue = true;
                        this.singleValue = value;
                    }
                };
                SingleSubscriber.prototype._next = function (value) {
                    var predicate = this.predicate;
                    this.index++;
                    if (predicate) {
                        this.tryNext(value);
                    }
                    else {
                        this.applySingleValue(value);
                    }
                };
                SingleSubscriber.prototype.tryNext = function (value) {
                    try {
                        var result = this.predicate(value, this.index, this.source);
                        if (result) {
                            this.applySingleValue(value);
                        }
                    }
                    catch (err) {
                        this.destination.error(err);
                    }
                };
                SingleSubscriber.prototype._complete = function () {
                    var destination = this.destination;
                    if (this.index > 0) {
                        destination.next(this.seenValue ? this.singleValue : undefined);
                        destination.complete();
                    }
                    else {
                        destination.error(new EmptyError_1.EmptyError);
                    }
                };
                return SingleSubscriber;
            }(Subscriber_1.Subscriber));
        }
    };
});
//# sourceMappingURL=single.js.map