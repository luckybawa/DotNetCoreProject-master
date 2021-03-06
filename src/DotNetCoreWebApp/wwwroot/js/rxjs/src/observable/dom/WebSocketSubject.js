System.register(["../../Subject", "../../Subscriber", "../../Observable", "../../Subscription", "../../util/root", "../../ReplaySubject", "../../util/tryCatch", "../../util/errorObject", "../../util/assign"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var Subject_1, Subscriber_1, Observable_1, Subscription_1, root_1, ReplaySubject_1, tryCatch_1, errorObject_1, assign_1, WebSocketSubject;
    return {
        setters: [
            function (Subject_1_1) {
                Subject_1 = Subject_1_1;
            },
            function (Subscriber_1_1) {
                Subscriber_1 = Subscriber_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (Subscription_1_1) {
                Subscription_1 = Subscription_1_1;
            },
            function (root_1_1) {
                root_1 = root_1_1;
            },
            function (ReplaySubject_1_1) {
                ReplaySubject_1 = ReplaySubject_1_1;
            },
            function (tryCatch_1_1) {
                tryCatch_1 = tryCatch_1_1;
            },
            function (errorObject_1_1) {
                errorObject_1 = errorObject_1_1;
            },
            function (assign_1_1) {
                assign_1 = assign_1_1;
            }
        ],
        execute: function () {
            /**
             * We need this JSDoc comment for affecting ESDoc.
             * @extends {Ignored}
             * @hide true
             */
            WebSocketSubject = (function (_super) {
                __extends(WebSocketSubject, _super);
                function WebSocketSubject(urlConfigOrSource, destination) {
                    var _this = this;
                    if (urlConfigOrSource instanceof Observable_1.Observable) {
                        _this = _super.call(this, destination, urlConfigOrSource) || this;
                    }
                    else {
                        _this = _super.call(this) || this;
                        _this.WebSocketCtor = root_1.root.WebSocket;
                        _this._output = new Subject_1.Subject();
                        if (typeof urlConfigOrSource === 'string') {
                            _this.url = urlConfigOrSource;
                        }
                        else {
                            // WARNING: config object could override important members here.
                            assign_1.assign(_this, urlConfigOrSource);
                        }
                        if (!_this.WebSocketCtor) {
                            throw new Error('no WebSocket constructor can be found');
                        }
                        _this.destination = new ReplaySubject_1.ReplaySubject();
                    }
                    return _this;
                }
                WebSocketSubject.prototype.resultSelector = function (e) {
                    return JSON.parse(e.data);
                };
                /**
                 * @param urlConfigOrSource
                 * @return {WebSocketSubject}
                 * @static true
                 * @name webSocket
                 * @owner Observable
                 */
                WebSocketSubject.create = function (urlConfigOrSource) {
                    return new WebSocketSubject(urlConfigOrSource);
                };
                WebSocketSubject.prototype.lift = function (operator) {
                    var sock = new WebSocketSubject(this, this.destination);
                    sock.operator = operator;
                    return sock;
                };
                // TODO: factor this out to be a proper Operator/Subscriber implementation and eliminate closures
                WebSocketSubject.prototype.multiplex = function (subMsg, unsubMsg, messageFilter) {
                    var self = this;
                    return new Observable_1.Observable(function (observer) {
                        var result = tryCatch_1.tryCatch(subMsg)();
                        if (result === errorObject_1.errorObject) {
                            observer.error(errorObject_1.errorObject.e);
                        }
                        else {
                            self.next(result);
                        }
                        var subscription = self.subscribe(function (x) {
                            var result = tryCatch_1.tryCatch(messageFilter)(x);
                            if (result === errorObject_1.errorObject) {
                                observer.error(errorObject_1.errorObject.e);
                            }
                            else if (result) {
                                observer.next(x);
                            }
                        }, function (err) { return observer.error(err); }, function () { return observer.complete(); });
                        return function () {
                            var result = tryCatch_1.tryCatch(unsubMsg)();
                            if (result === errorObject_1.errorObject) {
                                observer.error(errorObject_1.errorObject.e);
                            }
                            else {
                                self.next(result);
                            }
                            subscription.unsubscribe();
                        };
                    });
                };
                WebSocketSubject.prototype._connectSocket = function () {
                    var _this = this;
                    var WebSocketCtor = this.WebSocketCtor;
                    var socket = this.protocol ?
                        new WebSocketCtor(this.url, this.protocol) :
                        new WebSocketCtor(this.url);
                    this.socket = socket;
                    var subscription = new Subscription_1.Subscription(function () {
                        _this.socket = null;
                        if (socket && socket.readyState === 1) {
                            socket.close();
                        }
                    });
                    var observer = this._output;
                    socket.onopen = function (e) {
                        var openObserver = _this.openObserver;
                        if (openObserver) {
                            openObserver.next(e);
                        }
                        var queue = _this.destination;
                        _this.destination = Subscriber_1.Subscriber.create(function (x) { return socket.readyState === 1 && socket.send(x); }, function (e) {
                            var closingObserver = _this.closingObserver;
                            if (closingObserver) {
                                closingObserver.next(undefined);
                            }
                            if (e && e.code) {
                                socket.close(e.code, e.reason);
                            }
                            else {
                                observer.error(new TypeError('WebSocketSubject.error must be called with an object with an error code, ' +
                                    'and an optional reason: { code: number, reason: string }'));
                            }
                            _this.destination = new ReplaySubject_1.ReplaySubject();
                            _this.socket = null;
                        }, function () {
                            var closingObserver = _this.closingObserver;
                            if (closingObserver) {
                                closingObserver.next(undefined);
                            }
                            socket.close();
                            _this.destination = new ReplaySubject_1.ReplaySubject();
                            _this.socket = null;
                        });
                        if (queue && queue instanceof ReplaySubject_1.ReplaySubject) {
                            subscription.add(queue.subscribe(_this.destination));
                        }
                    };
                    socket.onerror = function (e) { return observer.error(e); };
                    socket.onclose = function (e) {
                        var closeObserver = _this.closeObserver;
                        if (closeObserver) {
                            closeObserver.next(e);
                        }
                        if (e.wasClean) {
                            observer.complete();
                        }
                        else {
                            observer.error(e);
                        }
                    };
                    socket.onmessage = function (e) {
                        var result = tryCatch_1.tryCatch(_this.resultSelector)(e);
                        if (result === errorObject_1.errorObject) {
                            observer.error(errorObject_1.errorObject.e);
                        }
                        else {
                            observer.next(result);
                        }
                    };
                };
                WebSocketSubject.prototype._subscribe = function (subscriber) {
                    var _this = this;
                    var source = this.source;
                    if (source) {
                        return source.subscribe(subscriber);
                    }
                    if (!this.socket) {
                        this._connectSocket();
                    }
                    var subscription = new Subscription_1.Subscription();
                    subscription.add(this._output.subscribe(subscriber));
                    subscription.add(function () {
                        var socket = _this.socket;
                        if (_this._output.observers.length === 0 && socket && socket.readyState === 1) {
                            socket.close();
                            _this.socket = null;
                        }
                    });
                    return subscription;
                };
                WebSocketSubject.prototype.unsubscribe = function () {
                    var _a = this, source = _a.source, socket = _a.socket;
                    if (socket && socket.readyState === 1) {
                        socket.close();
                        this.socket = null;
                    }
                    _super.prototype.unsubscribe.call(this);
                    if (!source) {
                        this.destination = new ReplaySubject_1.ReplaySubject();
                    }
                };
                return WebSocketSubject;
            }(Subject_1.AnonymousSubject));
            exports_1("WebSocketSubject", WebSocketSubject);
        }
    };
});
//# sourceMappingURL=WebSocketSubject.js.map