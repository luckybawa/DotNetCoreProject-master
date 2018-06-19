System.register(["../Subscriber", "../Subscription", "../Observable", "../Subject", "../util/Map", "../util/FastMap"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    /* tslint:enable:max-line-length */
    /**
     * Groups the items emitted by an Observable according to a specified criterion,
     * and emits these grouped items as `GroupedObservables`, one
     * {@link GroupedObservable} per group.
     *
     * <img src="./img/groupBy.png" width="100%">
     *
     * @example <caption>Group objects by id and return as array</caption>
     * Observable.of<Obj>({id: 1, name: 'aze1'},
     *                    {id: 2, name: 'sf2'},
     *                    {id: 2, name: 'dg2'},
     *                    {id: 1, name: 'erg1'},
     *                    {id: 1, name: 'df1'},
     *                    {id: 2, name: 'sfqfb2'},
     *                    {id: 3, name: 'qfs3'},
     *                    {id: 2, name: 'qsgqsfg2'}
     *     )
     *     .groupBy(p => p.id)
     *     .flatMap( (group$) => group$.reduce((acc, cur) => [...acc, cur], []))
     *     .subscribe(p => console.log(p));
     *
     * // displays:
     * // [ { id: 1, name: 'aze1' },
     * //   { id: 1, name: 'erg1' },
     * //   { id: 1, name: 'df1' } ]
     * //
     * // [ { id: 2, name: 'sf2' },
     * //   { id: 2, name: 'dg2' },
     * //   { id: 2, name: 'sfqfb2' },
     * //   { id: 2, name: 'qsgqsfg2' } ]
     * //
     * // [ { id: 3, name: 'qfs3' } ]
     *
     * @example <caption>Pivot data on the id field</caption>
     * Observable.of<Obj>({id: 1, name: 'aze1'},
     *                    {id: 2, name: 'sf2'},
     *                    {id: 2, name: 'dg2'},
     *                    {id: 1, name: 'erg1'},
     *                    {id: 1, name: 'df1'},
     *                    {id: 2, name: 'sfqfb2'},
     *                    {id: 3, name: 'qfs1'},
     *                    {id: 2, name: 'qsgqsfg2'}
     *                   )
     *     .groupBy(p => p.id, p => p.anme)
     *     .flatMap( (group$) => group$.reduce((acc, cur) => [...acc, cur], ["" + group$.key]))
     *     .map(arr => ({'id': parseInt(arr[0]), 'values': arr.slice(1)}))
     *     .subscribe(p => console.log(p));
     *
     * // displays:
     * // { id: 1, values: [ 'aze1', 'erg1', 'df1' ] }
     * // { id: 2, values: [ 'sf2', 'dg2', 'sfqfb2', 'qsgqsfg2' ] }
     * // { id: 3, values: [ 'qfs1' ] }
     *
     * @param {function(value: T): K} keySelector A function that extracts the key
     * for each item.
     * @param {function(value: T): R} [elementSelector] A function that extracts the
     * return element for each item.
     * @param {function(grouped: GroupedObservable<K,R>): Observable<any>} [durationSelector]
     * A function that returns an Observable to determine how long each group should
     * exist.
     * @return {Observable<GroupedObservable<K,R>>} An Observable that emits
     * GroupedObservables, each of which corresponds to a unique key value and each
     * of which emits those items from the source Observable that share that key
     * value.
     * @method groupBy
     * @owner Observable
     */
    function groupBy(keySelector, elementSelector, durationSelector, subjectSelector) {
        return this.lift(new GroupByOperator(keySelector, elementSelector, durationSelector, subjectSelector));
    }
    exports_1("groupBy", groupBy);
    var Subscriber_1, Subscription_1, Observable_1, Subject_1, Map_1, FastMap_1, GroupByOperator, GroupBySubscriber, GroupDurationSubscriber, GroupedObservable, InnerRefCountSubscription;
    return {
        setters: [
            function (Subscriber_1_1) {
                Subscriber_1 = Subscriber_1_1;
            },
            function (Subscription_1_1) {
                Subscription_1 = Subscription_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (Subject_1_1) {
                Subject_1 = Subject_1_1;
            },
            function (Map_1_1) {
                Map_1 = Map_1_1;
            },
            function (FastMap_1_1) {
                FastMap_1 = FastMap_1_1;
            }
        ],
        execute: function () {
            GroupByOperator = (function () {
                function GroupByOperator(keySelector, elementSelector, durationSelector, subjectSelector) {
                    this.keySelector = keySelector;
                    this.elementSelector = elementSelector;
                    this.durationSelector = durationSelector;
                    this.subjectSelector = subjectSelector;
                }
                GroupByOperator.prototype.call = function (subscriber, source) {
                    return source.subscribe(new GroupBySubscriber(subscriber, this.keySelector, this.elementSelector, this.durationSelector, this.subjectSelector));
                };
                return GroupByOperator;
            }());
            /**
             * We need this JSDoc comment for affecting ESDoc.
             * @ignore
             * @extends {Ignored}
             */
            GroupBySubscriber = (function (_super) {
                __extends(GroupBySubscriber, _super);
                function GroupBySubscriber(destination, keySelector, elementSelector, durationSelector, subjectSelector) {
                    var _this = _super.call(this, destination) || this;
                    _this.keySelector = keySelector;
                    _this.elementSelector = elementSelector;
                    _this.durationSelector = durationSelector;
                    _this.subjectSelector = subjectSelector;
                    _this.groups = null;
                    _this.attemptedToUnsubscribe = false;
                    _this.count = 0;
                    return _this;
                }
                GroupBySubscriber.prototype._next = function (value) {
                    var key;
                    try {
                        key = this.keySelector(value);
                    }
                    catch (err) {
                        this.error(err);
                        return;
                    }
                    this._group(value, key);
                };
                GroupBySubscriber.prototype._group = function (value, key) {
                    var groups = this.groups;
                    if (!groups) {
                        groups = this.groups = typeof key === 'string' ? new FastMap_1.FastMap() : new Map_1.Map();
                    }
                    var group = groups.get(key);
                    var element;
                    if (this.elementSelector) {
                        try {
                            element = this.elementSelector(value);
                        }
                        catch (err) {
                            this.error(err);
                        }
                    }
                    else {
                        element = value;
                    }
                    if (!group) {
                        group = this.subjectSelector ? this.subjectSelector() : new Subject_1.Subject();
                        groups.set(key, group);
                        var groupedObservable = new GroupedObservable(key, group, this);
                        this.destination.next(groupedObservable);
                        if (this.durationSelector) {
                            var duration = void 0;
                            try {
                                duration = this.durationSelector(new GroupedObservable(key, group));
                            }
                            catch (err) {
                                this.error(err);
                                return;
                            }
                            this.add(duration.subscribe(new GroupDurationSubscriber(key, group, this)));
                        }
                    }
                    if (!group.closed) {
                        group.next(element);
                    }
                };
                GroupBySubscriber.prototype._error = function (err) {
                    var groups = this.groups;
                    if (groups) {
                        groups.forEach(function (group, key) {
                            group.error(err);
                        });
                        groups.clear();
                    }
                    this.destination.error(err);
                };
                GroupBySubscriber.prototype._complete = function () {
                    var groups = this.groups;
                    if (groups) {
                        groups.forEach(function (group, key) {
                            group.complete();
                        });
                        groups.clear();
                    }
                    this.destination.complete();
                };
                GroupBySubscriber.prototype.removeGroup = function (key) {
                    this.groups.delete(key);
                };
                GroupBySubscriber.prototype.unsubscribe = function () {
                    if (!this.closed) {
                        this.attemptedToUnsubscribe = true;
                        if (this.count === 0) {
                            _super.prototype.unsubscribe.call(this);
                        }
                    }
                };
                return GroupBySubscriber;
            }(Subscriber_1.Subscriber));
            /**
             * We need this JSDoc comment for affecting ESDoc.
             * @ignore
             * @extends {Ignored}
             */
            GroupDurationSubscriber = (function (_super) {
                __extends(GroupDurationSubscriber, _super);
                function GroupDurationSubscriber(key, group, parent) {
                    var _this = _super.call(this) || this;
                    _this.key = key;
                    _this.group = group;
                    _this.parent = parent;
                    return _this;
                }
                GroupDurationSubscriber.prototype._next = function (value) {
                    this._complete();
                };
                GroupDurationSubscriber.prototype._error = function (err) {
                    var group = this.group;
                    if (!group.closed) {
                        group.error(err);
                    }
                    this.parent.removeGroup(this.key);
                };
                GroupDurationSubscriber.prototype._complete = function () {
                    var group = this.group;
                    if (!group.closed) {
                        group.complete();
                    }
                    this.parent.removeGroup(this.key);
                };
                return GroupDurationSubscriber;
            }(Subscriber_1.Subscriber));
            /**
             * An Observable representing values belonging to the same group represented by
             * a common key. The values emitted by a GroupedObservable come from the source
             * Observable. The common key is available as the field `key` on a
             * GroupedObservable instance.
             *
             * @class GroupedObservable<K, T>
             */
            GroupedObservable = (function (_super) {
                __extends(GroupedObservable, _super);
                function GroupedObservable(key, groupSubject, refCountSubscription) {
                    var _this = _super.call(this) || this;
                    _this.key = key;
                    _this.groupSubject = groupSubject;
                    _this.refCountSubscription = refCountSubscription;
                    return _this;
                }
                GroupedObservable.prototype._subscribe = function (subscriber) {
                    var subscription = new Subscription_1.Subscription();
                    var _a = this, refCountSubscription = _a.refCountSubscription, groupSubject = _a.groupSubject;
                    if (refCountSubscription && !refCountSubscription.closed) {
                        subscription.add(new InnerRefCountSubscription(refCountSubscription));
                    }
                    subscription.add(groupSubject.subscribe(subscriber));
                    return subscription;
                };
                return GroupedObservable;
            }(Observable_1.Observable));
            exports_1("GroupedObservable", GroupedObservable);
            /**
             * We need this JSDoc comment for affecting ESDoc.
             * @ignore
             * @extends {Ignored}
             */
            InnerRefCountSubscription = (function (_super) {
                __extends(InnerRefCountSubscription, _super);
                function InnerRefCountSubscription(parent) {
                    var _this = _super.call(this) || this;
                    _this.parent = parent;
                    parent.count++;
                    return _this;
                }
                InnerRefCountSubscription.prototype.unsubscribe = function () {
                    var parent = this.parent;
                    if (!parent.closed && !this.closed) {
                        _super.prototype.unsubscribe.call(this);
                        parent.count -= 1;
                        if (parent.count === 0 && parent.attemptedToUnsubscribe) {
                            parent.unsubscribe();
                        }
                    }
                };
                return InnerRefCountSubscription;
            }(Subscription_1.Subscription));
        }
    };
});
//# sourceMappingURL=groupBy.js.map