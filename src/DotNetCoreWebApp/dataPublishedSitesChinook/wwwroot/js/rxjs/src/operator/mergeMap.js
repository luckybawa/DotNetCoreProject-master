System.register(["../util/subscribeToResult", "../OuterSubscriber"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    /**
     * Projects each source value to an Observable which is merged in the output
     * Observable.
     *
     * <span class="informal">Maps each value to an Observable, then flattens all of
     * these inner Observables using {@link mergeAll}.</span>
     *
     * <img src="./img/mergeMap.png" width="100%">
     *
     * Returns an Observable that emits items based on applying a function that you
     * supply to each item emitted by the source Observable, where that function
     * returns an Observable, and then merging those resulting Observables and
     * emitting the results of this merger.
     *
     * @example <caption>Map and flatten each letter to an Observable ticking every 1 second</caption>
     * var letters = Rx.Observable.of('a', 'b', 'c');
     * var result = letters.mergeMap(x =>
     *   Rx.Observable.interval(1000).map(i => x+i)
     * );
     * result.subscribe(x => console.log(x));
     *
     * @see {@link concatMap}
     * @see {@link exhaustMap}
     * @see {@link merge}
     * @see {@link mergeAll}
     * @see {@link mergeMapTo}
     * @see {@link mergeScan}
     * @see {@link switchMap}
     *
     * @param {function(value: T, ?index: number): Observable} project A function
     * that, when applied to an item emitted by the source Observable, returns an
     * Observable.
     * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
     * A function to produce the value on the output Observable based on the values
     * and the indices of the source (outer) emission and the inner Observable
     * emission. The arguments passed to this function are:
     * - `outerValue`: the value that came from the source
     * - `innerValue`: the value that came from the projected Observable
     * - `outerIndex`: the "index" of the value that came from the source
     * - `innerIndex`: the "index" of the value from the projected Observable
     * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
     * Observables being subscribed to concurrently.
     * @return {Observable} An Observable that emits the result of applying the
     * projection function (and the optional `resultSelector`) to each item emitted
     * by the source Observable and merging the results of the Observables obtained
     * from this transformation.
     * @method mergeMap
     * @owner Observable
     */
    function mergeMap(project, resultSelector, concurrent) {
        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
        if (typeof resultSelector === 'number') {
            concurrent = resultSelector;
            resultSelector = null;
        }
        return this.lift(new MergeMapOperator(project, resultSelector, concurrent));
    }
    exports_1("mergeMap", mergeMap);
    var subscribeToResult_1, OuterSubscriber_1, MergeMapOperator, MergeMapSubscriber;
    return {
        setters: [
            function (subscribeToResult_1_1) {
                subscribeToResult_1 = subscribeToResult_1_1;
            },
            function (OuterSubscriber_1_1) {
                OuterSubscriber_1 = OuterSubscriber_1_1;
            }
        ],
        execute: function () {
            MergeMapOperator = (function () {
                function MergeMapOperator(project, resultSelector, concurrent) {
                    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
                    this.project = project;
                    this.resultSelector = resultSelector;
                    this.concurrent = concurrent;
                }
                MergeMapOperator.prototype.call = function (observer, source) {
                    return source._subscribe(new MergeMapSubscriber(observer, this.project, this.resultSelector, this.concurrent));
                };
                return MergeMapOperator;
            }());
            exports_1("MergeMapOperator", MergeMapOperator);
            /**
             * We need this JSDoc comment for affecting ESDoc.
             * @ignore
             * @extends {Ignored}
             */
            MergeMapSubscriber = (function (_super) {
                __extends(MergeMapSubscriber, _super);
                function MergeMapSubscriber(destination, project, resultSelector, concurrent) {
                    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
                    var _this = _super.call(this, destination) || this;
                    _this.project = project;
                    _this.resultSelector = resultSelector;
                    _this.concurrent = concurrent;
                    _this.hasCompleted = false;
                    _this.buffer = [];
                    _this.active = 0;
                    _this.index = 0;
                    return _this;
                }
                MergeMapSubscriber.prototype._next = function (value) {
                    if (this.active < this.concurrent) {
                        this._tryNext(value);
                    }
                    else {
                        this.buffer.push(value);
                    }
                };
                MergeMapSubscriber.prototype._tryNext = function (value) {
                    var result;
                    var index = this.index++;
                    try {
                        result = this.project(value, index);
                    }
                    catch (err) {
                        this.destination.error(err);
                        return;
                    }
                    this.active++;
                    this._innerSub(result, value, index);
                };
                MergeMapSubscriber.prototype._innerSub = function (ish, value, index) {
                    this.add(subscribeToResult_1.subscribeToResult(this, ish, value, index));
                };
                MergeMapSubscriber.prototype._complete = function () {
                    this.hasCompleted = true;
                    if (this.active === 0 && this.buffer.length === 0) {
                        this.destination.complete();
                    }
                };
                MergeMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
                    if (this.resultSelector) {
                        this._notifyResultSelector(outerValue, innerValue, outerIndex, innerIndex);
                    }
                    else {
                        this.destination.next(innerValue);
                    }
                };
                MergeMapSubscriber.prototype._notifyResultSelector = function (outerValue, innerValue, outerIndex, innerIndex) {
                    var result;
                    try {
                        result = this.resultSelector(outerValue, innerValue, outerIndex, innerIndex);
                    }
                    catch (err) {
                        this.destination.error(err);
                        return;
                    }
                    this.destination.next(result);
                };
                MergeMapSubscriber.prototype.notifyComplete = function (innerSub) {
                    var buffer = this.buffer;
                    this.remove(innerSub);
                    this.active--;
                    if (buffer.length > 0) {
                        this._next(buffer.shift());
                    }
                    else if (this.active === 0 && this.hasCompleted) {
                        this.destination.complete();
                    }
                };
                return MergeMapSubscriber;
            }(OuterSubscriber_1.OuterSubscriber));
            exports_1("MergeMapSubscriber", MergeMapSubscriber);
        }
    };
});
//# sourceMappingURL=mergeMap.js.map