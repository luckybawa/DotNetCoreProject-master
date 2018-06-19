System.register(["../OuterSubscriber", "../util/subscribeToResult"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    /**
     * Catches errors on the observable to be handled by returning a new observable or throwing an error.
     *
     * <img src="./img/catch.png" width="100%">
     *
     * @example <caption>Continues with a different Observable when there's an error</caption>
     *
     * Observable.of(1, 2, 3, 4, 5)
     *   .map(n => {
     * 	   if (n == 4) {
     * 	     throw 'four!';
     *     }
     *	   return n;
     *   })
     *   .catch(err => Observable.of('I', 'II', 'III', 'IV', 'V'))
     *   .subscribe(x => console.log(x));
     *   // 1, 2, 3, I, II, III, IV, V
     *
     * @example <caption>Retries the caught source Observable again in case of error, similar to retry() operator</caption>
     *
     * Observable.of(1, 2, 3, 4, 5)
     *   .map(n => {
     * 	   if (n === 4) {
     * 	     throw 'four!';
     *     }
     * 	   return n;
     *   })
     *   .catch((err, caught) => caught)
     *   .take(30)
     *   .subscribe(x => console.log(x));
     *   // 1, 2, 3, 1, 2, 3, ...
     *
     * @example <caption>Throws a new error when the source Observable throws an error</caption>
     *
     * Observable.of(1, 2, 3, 4, 5)
     *   .map(n => {
     *     if (n == 4) {
     *       throw 'four!';
     *     }
     *     return n;
     *   })
     *   .catch(err => {
     *     throw 'error in source. Details: ' + err;
     *   })
     *   .subscribe(
     *     x => console.log(x),
     *     err => console.log(err)
     *   );
     *   // 1, 2, 3, error in source. Details: four!
     *
     * @param {function} selector a function that takes as arguments `err`, which is the error, and `caught`, which
     *  is the source observable, in case you'd like to "retry" that observable by returning it again. Whatever observable
     *  is returned by the `selector` will be used to continue the observable chain.
     * @return {Observable} An observable that originates from either the source or the observable returned by the
     *  catch `selector` function.
     * @method catch
     * @name catch
     * @owner Observable
     */
    function _catch(selector) {
        var operator = new CatchOperator(selector);
        var caught = this.lift(operator);
        return (operator.caught = caught);
    }
    exports_1("_catch", _catch);
    var OuterSubscriber_1, subscribeToResult_1, CatchOperator, CatchSubscriber;
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
            CatchOperator = (function () {
                function CatchOperator(selector) {
                    this.selector = selector;
                }
                CatchOperator.prototype.call = function (subscriber, source) {
                    return source.subscribe(new CatchSubscriber(subscriber, this.selector, this.caught));
                };
                return CatchOperator;
            }());
            /**
             * We need this JSDoc comment for affecting ESDoc.
             * @ignore
             * @extends {Ignored}
             */
            CatchSubscriber = (function (_super) {
                __extends(CatchSubscriber, _super);
                function CatchSubscriber(destination, selector, caught) {
                    var _this = _super.call(this, destination) || this;
                    _this.selector = selector;
                    _this.caught = caught;
                    return _this;
                }
                // NOTE: overriding `error` instead of `_error` because we don't want
                // to have this flag this subscriber as `isStopped`. We can mimic the
                // behavior of the RetrySubscriber (from the `retry` operator), where
                // we unsubscribe from our source chain, reset our Subscriber flags,
                // then subscribe to the selector result.
                CatchSubscriber.prototype.error = function (err) {
                    if (!this.isStopped) {
                        var result = void 0;
                        try {
                            result = this.selector(err, this.caught);
                        }
                        catch (err2) {
                            _super.prototype.error.call(this, err2);
                            return;
                        }
                        this._unsubscribeAndRecycle();
                        this.add(subscribeToResult_1.subscribeToResult(this, result));
                    }
                };
                return CatchSubscriber;
            }(OuterSubscriber_1.OuterSubscriber));
        }
    };
});
//# sourceMappingURL=catch.js.map