/* Acknowledgements: https://logrocket.com/open-source/ */
!(function () {
  var e = {
      749: function (e, t, r) {
        "use strict";
        var n = r(836);
        Object.defineProperty(t, "__esModule", { value: !0 }), (t.default = void 0);
        var o = n(r(47)).default;
        t.default = o;
      },
      47: function (e, t, r) {
        "use strict";
        var n = r(836);
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.default = function (e) {
            var t = [];
            return (
              ["log", "warn", "info", "error", "debug"].forEach(function (r) {
                t.push(
                  (0, i.default)(console, r, function () {
                    for (var t = arguments.length, n = new Array(t), i = 0; i < t; i++)
                      n[i] = arguments[i];
                    e.addEvent("lr.core.LogEvent", function () {
                      var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                        i = t.isEnabled;
                      if (("object" === (0, o.default)(i) && !1 === i[r]) || !1 === i) return null;
                      if ("error" === r && t.shouldAggregateConsoleErrors)
                        if (n && n.length >= 2 && "ERROR" === n[0]) {
                          var c = "";
                          try {
                            c = " ".concat(n[1]);
                          } catch (e) {}
                          a.Capture.captureMessage(e, "".concat(n[0]).concat(c), n, {}, !0);
                        } else a.Capture.captureMessage(e, n[0], n, {}, !0);
                      return { logLevel: r.toUpperCase(), args: n };
                    });
                  })
                );
              }),
              function () {
                t.forEach(function (e) {
                  return e();
                });
              }
            );
          });
        var o = n(r(698)),
          i = n(r(800)),
          a = r(476);
      },
      818: function (e, t, r) {
        "use strict";
        var n = r(836);
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.captureMessage = function (e, t, r) {
            var n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {},
              i = arguments.length > 4 && void 0 !== arguments[4] && arguments[4],
              a = {
                exceptionType: i ? "CONSOLE" : "MESSAGE",
                message: t,
                messageArgs: r,
                browserHref: window.location ? window.location.href : "",
              };
            (0, o.scrubException)(a, n),
              e.addEvent("lr.core.Exception", function () {
                return a;
              });
          }),
          (t.captureException = function (e, t) {
            var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
              n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null,
              c = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : "WINDOW",
              u = n || i.default.computeStackTrace(t),
              s = {
                exceptionType: c,
                errorType: u.name,
                message: u.message,
                browserHref: window.location ? window.location.href : "",
              };
            (0, o.scrubException)(s, r);
            var l = { _stackTrace: (0, a.default)(u) };
            e.addEvent(
              "lr.core.Exception",
              function () {
                return s;
              },
              l
            );
          });
        var o = r(731),
          i = n(r(668)),
          a = n(r(751));
      },
      476: function (e, t, r) {
        "use strict";
        var n = r(836),
          o = r(698);
        Object.defineProperty(t, "__esModule", { value: !0 }),
          Object.defineProperty(t, "registerExceptions", {
            enumerable: !0,
            get: function () {
              return i.default;
            },
          }),
          (t.Capture = void 0);
        var i = n(r(239)),
          a = (function (e, t) {
            if (!t && e && e.__esModule) return e;
            if (null === e || ("object" !== o(e) && "function" != typeof e)) return { default: e };
            var r = c(t);
            if (r && r.has(e)) return r.get(e);
            var n = {},
              i = Object.defineProperty && Object.getOwnPropertyDescriptor;
            for (var a in e)
              if ("default" !== a && Object.prototype.hasOwnProperty.call(e, a)) {
                var u = i ? Object.getOwnPropertyDescriptor(e, a) : null;
                u && (u.get || u.set) ? Object.defineProperty(n, a, u) : (n[a] = e[a]);
              }
            (n.default = e), r && r.set(e, n);
            return n;
          })(r(818));
        function c(e) {
          if ("function" != typeof WeakMap) return null;
          var t = new WeakMap(),
            r = new WeakMap();
          return (c = function (e) {
            return e ? r : t;
          })(e);
        }
        t.Capture = a;
      },
      414: function (e, t, r) {
        "use strict";
        var n = r(836);
        Object.defineProperty(t, "__esModule", { value: !0 }), (t.default = void 0);
        var o = n(r(690)),
          i = n(r(728)),
          a = n(r(668)),
          c = Object.prototype;
        function u(e) {
          return void 0 === e;
        }
        function s(e) {
          return "function" == typeof e;
        }
        function l(e, t) {
          return c.hasOwnProperty.call(e, t);
        }
        function f(e, t, r, n) {
          var o = e[t];
          (e[t] = r(o)), n && n.push([e, t, o]);
        }
        var d =
            "undefined" != typeof window
              ? window
              : void 0 !== r.g
              ? r.g
              : "undefined" != typeof self
              ? self
              : {},
          p =
            (d.document,
            (function () {
              function e(t) {
                var r = t.captureException;
                (0, o.default)(this, e),
                  (this._errorHandler = this._errorHandler.bind(this)),
                  (this._ignoreOnError = 0),
                  (this._wrappedBuiltIns = []),
                  (this.captureException = r),
                  a.default.report.subscribe(this._errorHandler),
                  this._instrumentTryCatch();
              }
              return (
                (0, i.default)(e, [
                  {
                    key: "uninstall",
                    value: function () {
                      var e;
                      for (
                        a.default.report.unsubscribe(this._errorHandler);
                        this._wrappedBuiltIns.length;

                      ) {
                        var t = (e = this._wrappedBuiltIns.shift())[0],
                          r = e[1],
                          n = e[2];
                        t[r] = n;
                      }
                    },
                  },
                  {
                    key: "_errorHandler",
                    value: function (e) {
                      this._ignoreOnError || this.captureException(e);
                    },
                  },
                  {
                    key: "_ignoreNextOnError",
                    value: function () {
                      var e = this;
                      (this._ignoreOnError += 1),
                        setTimeout(function () {
                          e._ignoreOnError -= 1;
                        });
                    },
                  },
                  {
                    key: "context",
                    value: function (e, t, r) {
                      return (
                        s(e) && ((r = t || []), (t = e), (e = void 0)),
                        this.wrap(e, t).apply(this, r)
                      );
                    },
                  },
                  {
                    key: "wrap",
                    value: function (e, t, r) {
                      var n = this;
                      if (u(t) && !s(e)) return e;
                      if ((s(e) && ((t = e), (e = void 0)), !s(t))) return t;
                      try {
                        if (t.__lr__) return t;
                        if (t.__lr_wrapper__) return t.__lr_wrapper__;
                        if (!Object.isExtensible(t)) return t;
                      } catch (e) {
                        return t;
                      }
                      function o() {
                        var o = [],
                          i = arguments.length,
                          c = !e || (e && !1 !== e.deep);
                        for (r && s(r) && r.apply(this, arguments); i--; )
                          o[i] = c ? n.wrap(e, arguments[i]) : arguments[i];
                        try {
                          return t.apply(this, o);
                        } catch (t) {
                          throw (
                            (n._ignoreNextOnError(),
                            n.captureException(a.default.computeStackTrace(t), e),
                            t)
                          );
                        }
                      }
                      for (var i in t) l(t, i) && (o[i] = t[i]);
                      return (
                        (o.prototype = t.prototype),
                        (t.__lr_wrapper__ = o),
                        (o.__lr__ = !0),
                        (o.__inner__ = t),
                        o
                      );
                    },
                  },
                  {
                    key: "_instrumentTryCatch",
                    value: function () {
                      var e = this,
                        t = e._wrappedBuiltIns;
                      function r(t) {
                        return function (r, n) {
                          for (var o = new Array(arguments.length), i = 0; i < o.length; ++i)
                            o[i] = arguments[i];
                          var a = o[0];
                          return (
                            s(a) && (o[0] = e.wrap(a)), t.apply ? t.apply(this, o) : t(o[0], o[1])
                          );
                        };
                      }
                      f(d, "setTimeout", r, t),
                        f(d, "setInterval", r, t),
                        d.requestAnimationFrame &&
                          f(
                            d,
                            "requestAnimationFrame",
                            function (t) {
                              return function (r) {
                                return t(e.wrap(r));
                              };
                            },
                            t
                          );
                      for (
                        var n,
                          o,
                          i = [
                            "EventTarget",
                            "Window",
                            "Node",
                            "ApplicationCache",
                            "AudioTrackList",
                            "ChannelMergerNode",
                            "CryptoOperation",
                            "EventSource",
                            "FileReader",
                            "HTMLUnknownElement",
                            "IDBDatabase",
                            "IDBRequest",
                            "IDBTransaction",
                            "KeyOperation",
                            "MediaController",
                            "MessagePort",
                            "ModalWindow",
                            "Notification",
                            "SVGElementInstance",
                            "Screen",
                            "TextTrack",
                            "TextTrackCue",
                            "TextTrackList",
                            "WebSocket",
                            "WebSocketWorker",
                            "Worker",
                            "XMLHttpRequest",
                            "XMLHttpRequestEventTarget",
                            "XMLHttpRequestUpload",
                          ],
                          a = 0;
                        a < i.length;
                        a++
                      )
                        (o = void 0),
                          (o = d[(n = i[a])] && d[n].prototype) &&
                            o.hasOwnProperty &&
                            o.hasOwnProperty("addEventListener") &&
                            (f(
                              o,
                              "addEventListener",
                              function (t) {
                                return function (r, n, o, i) {
                                  try {
                                    n && n.handleEvent && (n.handleEvent = e.wrap(n.handleEvent));
                                  } catch (e) {}
                                  return t.call(this, r, e.wrap(n, void 0, void 0), o, i);
                                };
                              },
                              t
                            ),
                            f(
                              o,
                              "removeEventListener",
                              function (e) {
                                return function (t, r, n, o) {
                                  try {
                                    var i = null == r ? void 0 : r.__lr_wrapper__;
                                    i && e.call(this, t, i, n, o);
                                  } catch (e) {}
                                  return e.call(this, t, r, n, o);
                                };
                              },
                              void 0
                            ));
                      var c = d.jQuery || d.$;
                      c &&
                        c.fn &&
                        c.fn.ready &&
                        f(
                          c.fn,
                          "ready",
                          function (t) {
                            return function (r) {
                              return t.call(this, e.wrap(r));
                            };
                          },
                          t
                        );
                    },
                  },
                ]),
                e
              );
            })());
        t.default = p;
      },
      239: function (e, t, r) {
        "use strict";
        var n = r(836),
          o = r(698);
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.default = function (e) {
            var t = new i.default({
                captureException: function (t) {
                  a.captureException(e, null, null, t);
                },
              }),
              r = function (t) {
                t.reason instanceof Error
                  ? a.captureException(e, t.reason, null, null, "UNHANDLED_REJECTION")
                  : e.addEvent("lr.core.Exception", function () {
                      return {
                        exceptionType: "UNHANDLED_REJECTION",
                        message: t.reason || "Unhandled Promise rejection",
                      };
                    });
              };
            return (
              window.addEventListener("unhandledrejection", r),
              function () {
                window.removeEventListener("unhandledrejection", r), t.uninstall();
              }
            );
          });
        var i = n(r(414)),
          a = (function (e, t) {
            if (!t && e && e.__esModule) return e;
            if (null === e || ("object" !== o(e) && "function" != typeof e)) return { default: e };
            var r = c(t);
            if (r && r.has(e)) return r.get(e);
            var n = {},
              i = Object.defineProperty && Object.getOwnPropertyDescriptor;
            for (var a in e)
              if ("default" !== a && Object.prototype.hasOwnProperty.call(e, a)) {
                var u = i ? Object.getOwnPropertyDescriptor(e, a) : null;
                u && (u.get || u.set) ? Object.defineProperty(n, a, u) : (n[a] = e[a]);
              }
            (n.default = e), r && r.set(e, n);
            return n;
          })(r(818));
        function c(e) {
          if ("function" != typeof WeakMap) return null;
          var t = new WeakMap(),
            r = new WeakMap();
          return (c = function (e) {
            return e ? r : t;
          })(e);
        }
      },
      751: function (e, t) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.default = function (e) {
            function t(e) {
              return null === e ? void 0 : e;
            }
            return e.stack
              ? e.stack.map(function (e) {
                  return {
                    lineNumber: t(e.line),
                    columnNumber: t(e.column),
                    fileName: t(e.url),
                    functionName: t(e.func),
                  };
                })
              : void 0;
          });
      },
      650: function (e, t, r) {
        "use strict";
        var n = r(836);
        Object.defineProperty(t, "__esModule", { value: !0 }), (t.default = void 0);
        var o = n(r(861)),
          i = r(105),
          a = [];
        function c(e, t) {
          for (
            var r = a.reduce(function (e, t) {
                return [t].concat(e);
              }, []),
              n = arguments.length,
              c = new Array(n > 2 ? n - 2 : 0),
              u = 2;
            u < n;
            u++
          )
            c[u - 2] = arguments[u];
          var s = Promise.resolve(c);
          return (
            r.forEach(function (e) {
              var r = e.request,
                n = e.requestError;
              (r || n) &&
                (s = s.then(
                  function (e) {
                    return r.apply(void 0, [t].concat((0, o.default)(e)));
                  },
                  function (e) {
                    return n.apply(void 0, [t].concat((0, o.default)(e)));
                  }
                ));
            }),
            (s = s.then(function (t) {
              var r, n;
              (0, i.setActive)(!1);
              try {
                r = e.apply(void 0, (0, o.default)(t));
              } catch (e) {
                n = e;
              }
              if (((0, i.setActive)(!0), n)) throw n;
              return r;
            })),
            r.forEach(function (e) {
              var r = e.response,
                n = e.responseError;
              (r || n) &&
                (s = s.then(
                  function (e) {
                    return r(t, e);
                  },
                  function (e) {
                    return n && n(t, e);
                  }
                ));
            }),
            s
          );
        }
        function u(e) {
          if (e.fetch && e.Promise) {
            var t = e.fetch.polyfill;
            (e.fetch = (function (e) {
              var t = 0;
              return function () {
                for (var r = arguments.length, n = new Array(r), o = 0; o < r; o++)
                  n[o] = arguments[o];
                return c.apply(void 0, [e, t++].concat(n));
              };
            })(e.fetch)),
              t && (e.fetch.polyfill = t);
          }
        }
        var s = !1,
          l = {
            register: function (e) {
              return (
                s || ((s = !0), u(window)),
                a.push(e),
                function () {
                  var t = a.indexOf(e);
                  t >= 0 && a.splice(t, 1);
                }
              );
            },
            clear: function () {
              a = [];
            },
          };
        t.default = l;
      },
      986: function (e, t, r) {
        "use strict";
        var n = r(836);
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.default = function (e) {
            var t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : { isReactNative: !1, isDisabled: !1 };
            if (!0 === (null == t ? void 0 : t.isDisabled)) return function () {};
            var r = t.isReactNative,
              n = t.shouldAugmentNPS,
              o = t.shouldParseXHRBlob,
              f = {},
              p = function (e) {
                var t = e;
                if ("object" === (0, i.default)(e) && null != e) {
                  var r = Object.getPrototypeOf(e);
                  (r !== Object.prototype && null !== r) || (t = JSON.stringify(e));
                }
                if (t && t.length && t.length > 4096e3 && "string" == typeof t) {
                  var n = t.substring(0, 1e3);
                  return "".concat(
                    n,
                    " ... LogRocket truncating to first 1000 characters.\n      Keep data under 4MB to prevent truncation. https://docs.logrocket.com/reference/network"
                  );
                }
                return e;
              },
              v = function (t, r) {
                var n = r.method;
                e.addEvent("lr.network.RequestEvent", function () {
                  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                    o = e.isEnabled,
                    i = void 0 === o || o,
                    a = e.requestSanitizer,
                    c =
                      void 0 === a
                        ? function (e) {
                            return e;
                          }
                        : a;
                  if (!i) return null;
                  var u = null;
                  try {
                    u = c(d(d({}, r), {}, { reqId: t }));
                  } catch (e) {
                    console.error(e);
                  }
                  if (u) {
                    var s = u.url;
                    if (
                      "undefined" != typeof document &&
                      "function" == typeof document.createElement
                    ) {
                      var v = document.createElement("a");
                      (v.href = u.url), (s = v.href);
                    }
                    return {
                      reqId: t,
                      url: s,
                      headers: (0, l.default)(u.headers, function (e) {
                        return "".concat(e);
                      }),
                      body: p(u.body),
                      method: n,
                      referrer: u.referrer || void 0,
                      mode: u.mode || void 0,
                      credentials: u.credentials || void 0,
                    };
                  }
                  return (f[t] = !0), null;
                });
              },
              g = function (t, r) {
                var n = r.method,
                  o = r.status,
                  i = r.responseType;
                e.addEvent("lr.network.ResponseEvent", function () {
                  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                    a = e.isEnabled,
                    c = void 0 === a || a,
                    u = e.responseSanitizer,
                    s =
                      void 0 === u
                        ? function (e) {
                            return e;
                          }
                        : u;
                  if (!c) return null;
                  if (f[t]) return delete f[t], null;
                  var v = null;
                  try {
                    v = s(d(d({}, r), {}, { reqId: t }));
                  } catch (e) {
                    console.error(e);
                  }
                  return v
                    ? {
                        reqId: t,
                        responseType: i,
                        status: v.status,
                        headers: (0, l.default)(v.headers, function (e) {
                          return "".concat(e);
                        }),
                        body: p(v.body),
                        method: n,
                      }
                    : { reqId: t, responseType: i, status: o, headers: {}, body: null, method: n };
                });
              },
              h = function (t) {
                return e.isDisabled || !0 === f[t];
              },
              y = (0, a.default)({ addRequest: v, addResponse: g, isIgnored: h }),
              b = (0, s.default)({
                addRequest: v,
                addResponse: g,
                isIgnored: h,
                logger: e,
                shouldAugmentNPS: n,
                shouldParseXHRBlob: o,
              }),
              m = (0, c.registerIonic)({ addRequest: v, addResponse: g, isIgnored: h }),
              w = r ? function () {} : (0, u.default)(e);
            return function () {
              w(), y(), b(), m();
            };
          });
        var o = n(r(416)),
          i = n(r(698)),
          a = n(r(452)),
          c = r(863),
          u = n(r(989)),
          s = n(r(105)),
          l = n(r(645));
        function f(e, t) {
          var r = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(e);
            t &&
              (n = n.filter(function (t) {
                return Object.getOwnPropertyDescriptor(e, t).enumerable;
              })),
              r.push.apply(r, n);
          }
          return r;
        }
        function d(e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = null != arguments[t] ? arguments[t] : {};
            t % 2
              ? f(Object(r), !0).forEach(function (t) {
                  (0, o.default)(e, t, r[t]);
                })
              : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
              : f(Object(r)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                });
          }
          return e;
        }
      },
      452: function (e, t, r) {
        "use strict";
        var n = r(836);
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.default = function (e) {
            var t = e.addRequest,
              r = e.addResponse,
              n = e.isIgnored,
              o = "fetch-",
              i = {},
              c = a.default.register({
                request: function (e) {
                  for (
                    var r = arguments.length, n = new Array(r > 1 ? r - 1 : 0), a = 1;
                    a < r;
                    a++
                  )
                    n[a - 1] = arguments[a];
                  var c;
                  if ("undefined" != typeof Request && n[0] instanceof Request) {
                    var s;
                    try {
                      s = n[0].clone().text();
                    } catch (e) {
                      s = Promise.resolve("LogRocket fetch error: ".concat(e.message));
                    }
                    c = s.then(
                      function (e) {
                        return u(u({}, l(n[0])), {}, { body: e });
                      },
                      function (e) {
                        return u(
                          u({}, l(n[0])),
                          {},
                          { body: "LogRocket fetch error: ".concat(e.message) }
                        );
                      }
                    );
                  } else
                    c = Promise.resolve(
                      u(u({}, l(n[1])), {}, { url: "".concat(n[0]), body: (n[1] || {}).body })
                    );
                  return c.then(function (r) {
                    return (i[e] = r.method), t("".concat(o).concat(e), r), n;
                  });
                },
                requestError: function (e, t) {
                  return Promise.reject(t);
                },
                response: function (e, t) {
                  var a, c;
                  if (n("".concat(o).concat(e))) return t;
                  if ("text/event-stream" === t.headers.get("content-type"))
                    c = Promise.resolve("LogRocket skipped consuming an event-stream body.");
                  else {
                    try {
                      a = t.clone();
                    } catch (n) {
                      var u = {
                        url: t.url,
                        responseType: t.type.toUpperCase(),
                        status: t.status,
                        headers: s(t.headers),
                        body: "LogRocket fetch error: ".concat(n.message),
                        method: i[e],
                      };
                      return delete i[e], r("".concat(o).concat(e), u), t;
                    }
                    try {
                      if (window.TextDecoder && a.body) {
                        var l = a.body.getReader(),
                          f = new window.TextDecoder("utf-8"),
                          d = "";
                        c = l.read().then(function e(t) {
                          var r = t.done,
                            n = t.value;
                          if (r) return d;
                          var o = n ? f.decode(n, { stream: !0 }) : "";
                          return (d += o), l.read().then(e);
                        });
                      } else c = a.text();
                    } catch (e) {
                      c = Promise.resolve("LogRocket error reading body: ".concat(e.message));
                    }
                  }
                  return (
                    c
                      .catch(function (e) {
                        if (!("AbortError" === e.name && e instanceof DOMException))
                          return "LogRocket error reading body: ".concat(e.message);
                      })
                      .then(function (n) {
                        var a = {
                          url: t.url,
                          responseType: t.type.toUpperCase(),
                          status: t.status,
                          headers: s(t.headers),
                          body: n,
                          method: i[e],
                        };
                        delete i[e], r("".concat(o).concat(e), a);
                      }),
                    t
                  );
                },
                responseError: function (e, t) {
                  var n = { url: void 0, status: 0, headers: {}, body: "".concat(t) };
                  return r("".concat(o).concat(e), n), Promise.reject(t);
                },
              });
            return c;
          });
        var o = n(r(416)),
          i = n(r(645)),
          a = n(r(650));
        function c(e, t) {
          var r = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(e);
            t &&
              (n = n.filter(function (t) {
                return Object.getOwnPropertyDescriptor(e, t).enumerable;
              })),
              r.push.apply(r, n);
          }
          return r;
        }
        function u(e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = null != arguments[t] ? arguments[t] : {};
            t % 2
              ? c(Object(r), !0).forEach(function (t) {
                  (0, o.default)(e, t, r[t]);
                })
              : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
              : c(Object(r)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                });
          }
          return e;
        }
        var s = function (e) {
          return (0, i.default)(
            (function (e) {
              if (null == e || "function" != typeof e.forEach) return e;
              var t = {};
              return (
                e.forEach(function (e, r) {
                  t[r] ? (t[r] = "".concat(t[r], ",").concat(e)) : (t[r] = "".concat(e));
                }),
                t
              );
            })(e),
            function (e) {
              return "".concat(e);
            }
          );
        };
        function l() {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          return {
            url: e.url,
            headers: s(e.headers),
            method: e.method && e.method.toUpperCase(),
            referrer: e.referrer || void 0,
            mode: e.mode || void 0,
            credentials: e.credentials || void 0,
          };
        }
      },
      863: function (e, t, r) {
        "use strict";
        var n = r(836);
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.mergeHeaders = j),
          (t.serializeQueryParams = function (e, t) {
            return P("", e, t);
          }),
          (t.appendQueryParamsString = R),
          (t.processData = D),
          (t.registerIonic = function (e) {
            var t,
              r,
              n,
              o = e.addRequest,
              i = e.addResponse,
              a = e.isIgnored,
              u =
                null === (t = window.cordova) ||
                void 0 === t ||
                null === (r = t.plugin) ||
                void 0 === r
                  ? void 0
                  : r.http,
              s = {},
              l = !1;
            if (void 0 === u) return function () {};
            var f = null === (n = window.ionic) || void 0 === n ? void 0 : n.platforms;
            if (
              void 0 !== f &&
              "function" == typeof f.some &&
              f.some(function (e) {
                return h.has(e);
              })
            )
              return function () {};
            var y = u.sendRequest,
              b = (0, c.default)(function (e, t, r) {
                if (!a("".concat(g).concat(r)))
                  try {
                    var n = {
                      url: e.url || "",
                      status: e.status < 600 && e.status >= 100 ? e.status : 0,
                      headers: e.headers || {},
                      body: t ? e.data : e.error,
                      method: s[r].toUpperCase(),
                    };
                    i("".concat(g).concat(r), n);
                  } catch (t) {
                    var o = {
                      url: e.url || "",
                      status: e.status < 600 && e.status >= 100 ? e.status : 0,
                      headers: e.headers || {},
                      body: "LogRocket fetch error: ".concat(t.message),
                      method: s[r].toUpperCase(),
                    };
                    i("".concat(g).concat(r), o);
                  }
              });
            return (
              (u.sendRequest = function (e, t, r, n) {
                var i = ++L;
                if (!l)
                  try {
                    var a = (function (e, t) {
                        var r;
                        e = e || {};
                        var n = e.data;
                        try {
                          r = O(
                            p,
                            e.serializer || t.getDataSerializer(),
                            "serializer / data payload type"
                          );
                        } catch (o) {
                          (r = O(
                            v,
                            e.serializer || t.getDataSerializer(),
                            "serializer / data payload type"
                          )),
                            (n = {});
                        }
                        return {
                          data: n,
                          filePath: e.filePath,
                          followRedirect: e.followRedirect,
                          headers: E(e.headers || {}, m, "Invalid header type, must be string"),
                          method: O(d, e.method || d[0], "method"),
                          name: e.name,
                          params: E(
                            e.params || {},
                            w,
                            "Invalid param, must be of type string or array"
                          ),
                          responseType: e.responseType,
                          serializer: r,
                          connectTimeout: e.connectTimeout,
                          readTimeout: e.readTimeout,
                          timeout: e.timeout,
                        };
                      })(t, u),
                      c = R(e, P("", a.params, !0)),
                      f = (function (e, t, r) {
                        var n = r.getHeaders("*") || {},
                          o =
                            (function (e, t) {
                              var r = new URL(e),
                                n = r.host;
                              return t.getHeaders(n) || null;
                            })(e, r) || {};
                        return j(j(n, o), t);
                      })(e, a.headers, u),
                      h = a.method || "get";
                    s[i] = h;
                    var _ = {
                      url: c,
                      method: h.toUpperCase(),
                      headers: f || {},
                      body: D(a.data || {}, a.serializer),
                    };
                    o("".concat(g).concat(i), _);
                  } catch (r) {
                    var S = {
                      url: e,
                      method: (t.method || "get").toUpperCase(),
                      headers: {},
                      body: "LogRocket fetch error: ".concat(r.message),
                    };
                    o("".concat(g).concat(i), S);
                  }
                return y(
                  e,
                  t,
                  function (e) {
                    l || (b(e, !0, i), delete s[i]), r(e);
                  },
                  function (e) {
                    l || (b(e, !1, i), delete s[i]), n(e);
                  }
                );
              }),
              function () {
                (l = !0), (u.sendRequest = y), (s = {});
              }
            );
          });
        var o = n(r(416)),
          i = n(r(698)),
          a = n(r(861)),
          c = n(r(167));
        function u(e, t) {
          var r = ("undefined" != typeof Symbol && e[Symbol.iterator]) || e["@@iterator"];
          if (!r) {
            if (
              Array.isArray(e) ||
              (r = (function (e, t) {
                if (!e) return;
                if ("string" == typeof e) return s(e, t);
                var r = Object.prototype.toString.call(e).slice(8, -1);
                "Object" === r && e.constructor && (r = e.constructor.name);
                if ("Map" === r || "Set" === r) return Array.from(e);
                if ("Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))
                  return s(e, t);
              })(e)) ||
              (t && e && "number" == typeof e.length)
            ) {
              r && (e = r);
              var n = 0,
                o = function () {};
              return {
                s: o,
                n: function () {
                  return n >= e.length ? { done: !0 } : { done: !1, value: e[n++] };
                },
                e: function (e) {
                  throw e;
                },
                f: o,
              };
            }
            throw new TypeError(
              "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
            );
          }
          var i,
            a = !0,
            c = !1;
          return {
            s: function () {
              r = r.call(e);
            },
            n: function () {
              var e = r.next();
              return (a = e.done), e;
            },
            e: function (e) {
              (c = !0), (i = e);
            },
            f: function () {
              try {
                a || null == r.return || r.return();
              } finally {
                if (c) throw i;
              }
            },
          };
        }
        function s(e, t) {
          (null == t || t > e.length) && (t = e.length);
          for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
          return n;
        }
        function l(e, t) {
          var r = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(e);
            t &&
              (n = n.filter(function (t) {
                return Object.getOwnPropertyDescriptor(e, t).enumerable;
              })),
              r.push.apply(r, n);
          }
          return r;
        }
        function f(e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = null != arguments[t] ? arguments[t] : {};
            t % 2
              ? l(Object(r), !0).forEach(function (t) {
                  (0, o.default)(e, t, r[t]);
                })
              : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
              : l(Object(r)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                });
          }
          return e;
        }
        var d = new Set([
            "get",
            "put",
            "post",
            "patch",
            "head",
            "delete",
            "options",
            "upload",
            "download",
          ]),
          p = new Set(["urlencoded", "json", "utf8"]),
          v = new Set(["raw", "multipart"]),
          g = "ionic-",
          h = new Set(["desktop", "mobileweb", "pwa"]),
          y = new Set(["FormData"]),
          b = new Set(),
          m = new Set(["string"]),
          w = new Set(["string", "array"]),
          _ = {
            utf8: m,
            urlencoded: new Set(["object"]),
            json: new Set(["array", "object"]),
            raw: new Set(["Uint8Array", "ArrayBuffer"]),
            default: b,
          };
        function O(e, t, r) {
          if ("string" != typeof t)
            throw new Error("".concat(r, " must be one of: ").concat((0, a.default)(e).join(", ")));
          if (((t = t.trim().toLowerCase()), !e.has(t)))
            throw new Error("".concat(r, " must be one of: ").concat((0, a.default)(e).join(", ")));
          return t;
        }
        function E(e, t, r) {
          if ("object" !== (0, i.default)(e)) throw new Error(r);
          for (var n = 0, o = Object.keys(e); n < o.length; n++) {
            var a = o[n];
            if (!t.has((0, i.default)(e[a]))) throw new Error(r);
          }
          return e;
        }
        function j(e, t) {
          return f(f({}, e), t);
        }
        function S(e, t) {
          return t ? encodeURIComponent(e) : e;
        }
        function k(e, t, r) {
          return e.length
            ? r
              ? "".concat(encodeURIComponent(e), "[").concat(encodeURIComponent(t), "]")
              : "".concat(e, "[").concat(t, "]")
            : r
            ? encodeURIComponent(t)
            : t;
        }
        function x(e, t, r) {
          var n,
            o = [],
            a = u(t);
          try {
            for (a.s(); !(n = a.n()).done; ) {
              var c = n.value;
              Array.isArray(c)
                ? o.push(x("".concat(e, "[]"), c, r))
                : "object" !== (0, i.default)(c)
                ? o.push("".concat(k(e, "", r), "=").concat(S(c, r)))
                : o.push(P("".concat(e, "[]").concat(c), r, void 0));
            }
          } catch (e) {
            a.e(e);
          } finally {
            a.f();
          }
          return o.join("&");
        }
        function P(e, t, r) {
          var n = [];
          for (var o in t)
            if (t.hasOwnProperty(o)) {
              var a = e.length ? "".concat(e, "[").concat(o, "]") : o;
              Array.isArray(t[o])
                ? n.push(x(a, t[o], r))
                : "object" !== (0, i.default)(t[o]) || null === t[o]
                ? n.push("".concat(k(e, o, r), "=").concat(S(t[o], r)))
                : n.push(P(a, t[o], r));
            }
          return n.join("&");
        }
        function R(e, t) {
          if (!e.length || !t.length) return e;
          var r = new URL(e),
            n = r.host,
            o = r.pathname,
            i = r.search,
            a = r.hash,
            c = r.protocol;
          return ""
            .concat(c, "//")
            .concat(n)
            .concat(o)
            .concat(i.length ? "".concat(i, "&").concat(t) : "?".concat(t))
            .concat(a);
        }
        function D(e, t) {
          var n = (0, i.default)(e),
            o = (function (e) {
              return _[e] || _.default;
            })(t),
            c = (function (e) {
              return "multipart" === e ? y : b;
            })(t);
          if (c.size > 0) {
            var u = !1;
            if (
              (c.forEach(function (t) {
                r.g[t] && e instanceof r.g[t] && (u = !0);
              }),
              !u)
            )
              throw new Error("INSTANCE_TYPE_MISMATCH_DATA ".concat((0, a.default)(c).join(", ")));
          }
          if (0 === c.size && !o.has(n))
            throw new Error("TYPE_MISMATCH_DATA ".concat((0, a.default)(o).join(", ")));
          return "utf8" === t ? e : JSON.stringify(e, void 0, 2);
        }
        var L = 0;
      },
      989: function (e, t) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.default = function (e) {
            var t = void 0;
            function n() {
              var n = { online: window.navigator.onLine, effectiveType: "UNKOWN" };
              window.navigator.onLine
                ? window.navigator.connection &&
                  window.navigator.connection.effectiveType &&
                  (n.effectiveType = r[window.navigator.connection.effectiveType] || "UNKNOWN")
                : (n.effectiveType = "NONE"),
                (t && n.online === t.online && n.effectiveType === t.effectiveType) ||
                  ((t = n),
                  e.addEvent("lr.network.NetworkStatusEvent", function () {
                    var e = (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {})
                      .isEnabled;
                    return void 0 === e || e ? n : null;
                  }));
            }
            setTimeout(n),
              window.navigator.connection &&
                "function" == typeof window.navigator.connection.addEventListener &&
                window.navigator.connection.addEventListener("change", n);
            return (
              window.addEventListener("online", n),
              window.addEventListener("offline", n),
              function () {
                window.removeEventListener("offline", n),
                  window.removeEventListener("online", n),
                  window.navigator.connection &&
                    "function" == typeof window.navigator.connection.removeEventListener &&
                    window.navigator.connection.removeEventListener("change", n);
              }
            );
          });
        var r = { "slow-2g": "SLOW2G", "2g": "TWOG", "3g": "THREEG", "4g": "FOURG" };
      },
      105: function (e, t, r) {
        "use strict";
        var n = r(836);
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.setActive = function (e) {
            u = e;
          }),
          (t.default = function (e) {
            var t = e.addRequest,
              r = e.addResponse,
              n = e.isIgnored,
              l = e.logger,
              f = e.shouldAugmentNPS,
              d = void 0 === f || f,
              p = e.shouldParseXHRBlob,
              v = void 0 !== p && p,
              g = XMLHttpRequest,
              h = new WeakMap(),
              y = !1,
              b = "xhr-";
            return (
              (window._lrXMLHttpRequest = XMLHttpRequest),
              (XMLHttpRequest = function (e, f) {
                var p = new g(e, f);
                if (!u) return p;
                h.set(p, { xhrId: ++s, headers: {} });
                var m = p.open;
                var w = p.send;
                d &&
                  ((p.open = function () {
                    for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
                      t[r] = arguments[r];
                    try {
                      var n = t[1];
                      if (
                        window.URL &&
                        "function" == typeof window.URL &&
                        0 === n.search(c.WOOTRIC_RESPONSES_REGEX)
                      ) {
                        var o = new window.URL(l.recordingURL);
                        o.searchParams.set("nps", "wootric");
                        var i = new window.URL(n),
                          a = i.searchParams.get("response[text]"),
                          u = a ? "".concat(a, "\n\n") : "";
                        i.searchParams.set(
                          "response[text]",
                          "".concat(u, "<").concat(o.href, "|View LogRocket session>")
                        ),
                          (t[1] = i.href);
                      }
                    } catch (e) {}
                    return m.apply(this, t);
                  }),
                  (p.send = function () {
                    for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
                      t[r] = arguments[r];
                    try {
                      var n = h.get(p);
                      if (
                        window.URL &&
                        "function" == typeof window.URL &&
                        n &&
                        n.url &&
                        0 === n.url.search(c.DELIGHTED_RESPONSES_REGEX) &&
                        t.length &&
                        -1 !== t[0].indexOf(c.DELIGHTED_FEEDBACK_PREFIX)
                      ) {
                        var o = new window.URL(l.recordingURL);
                        o.searchParams.set("nps", "delighted");
                        var i = encodeURIComponent(o.href),
                          u = t[0]
                            .split("&")
                            .map(function (e) {
                              if ((0, a.default)(e, c.DELIGHTED_FEEDBACK_PREFIX)) {
                                var t = e === c.DELIGHTED_FEEDBACK_PREFIX;
                                return ""
                                  .concat(e)
                                  .concat(t ? "" : "\n\n", "<")
                                  .concat(i, "|View LogRocket session>");
                              }
                              return e;
                            })
                            .join("&");
                        t[0] = u;
                      }
                    } catch (e) {}
                    return w.apply(this, t);
                  })),
                  (0, i.default)(p, "open", function (e, t) {
                    if (!y) {
                      var r = h.get(p);
                      (r.method = e), (r.url = t);
                    }
                  }),
                  (0, i.default)(p, "send", function (e) {
                    if (!y) {
                      var r = h.get(p);
                      if (r) {
                        var n = {
                          url: r.url,
                          method: r.method && r.method.toUpperCase(),
                          headers: (0, o.default)(r.headers || {}, function (e) {
                            return e.join(", ");
                          }),
                          body: e,
                        };
                        t("".concat(b).concat(r.xhrId), n);
                      }
                    }
                  }),
                  (0, i.default)(p, "setRequestHeader", function (e, t) {
                    if (!y) {
                      var r = h.get(p);
                      r &&
                        ((r.headers = r.headers || {}),
                        (r.headers[e] = r.headers[e] || []),
                        r.headers[e].push(t));
                    }
                  });
                var _ = {
                  readystatechange: function () {
                    if (!y && 4 === p.readyState) {
                      var e = h.get(p);
                      if (!e) return;
                      if (n("".concat(b).concat(e.xhrId))) return;
                      var t,
                        o = (p.getAllResponseHeaders() || "")
                          .split(/[\r\n]+/)
                          .reduce(function (e, t) {
                            var r = e,
                              n = t.split(": ");
                            if (n.length > 0) {
                              var o = n.shift(),
                                i = n.join(": ");
                              e[o] ? (r[o] += ", ".concat(i)) : (r[o] = i);
                            }
                            return r;
                          }, {});
                      try {
                        switch (p.responseType) {
                          case "json":
                            t = l._shouldCloneResponse
                              ? JSON.parse(JSON.stringify(p.response))
                              : p.response;
                            break;
                          case "arraybuffer":
                          case "blob":
                            t = p.response;
                            break;
                          case "document":
                            t = p.responseXML;
                            break;
                          case "text":
                          case "":
                            t = p.responseText;
                            break;
                          default:
                            t = "";
                        }
                      } catch (e) {
                        t = "LogRocket: Error accessing response.";
                      }
                      var i = {
                        url: e.url,
                        status: p.status,
                        headers: o,
                        body: t,
                        method: (e.method || "").toUpperCase(),
                      };
                      if (v && i.body instanceof Blob) {
                        var a = new FileReader();
                        a.readAsText(i.body),
                          (a.onload = function () {
                            try {
                              i.body = JSON.parse(a.result);
                            } catch (e) {}
                            r("".concat(b).concat(e.xhrId), i);
                          });
                      } else r("".concat(b).concat(e.xhrId), i);
                    }
                  },
                };
                return (
                  Object.keys(_).forEach(function (e) {
                    p.addEventListener(e, _[e]);
                  }),
                  p
                );
              }),
              (XMLHttpRequest.prototype = g.prototype),
              ["UNSENT", "OPENED", "HEADERS_RECEIVED", "LOADING", "DONE"].forEach(function (e) {
                XMLHttpRequest[e] = g[e];
              }),
              function () {
                (y = !0), (XMLHttpRequest = g);
              }
            );
          });
        var o = n(r(645)),
          i = n(r(800)),
          a = n(r(242)),
          c = r(5),
          u = !0;
        var s = 0;
      },
      707: function (e, t) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), (t.default = void 0);
        var r = Date.now.bind(Date),
          n = r(),
          o =
            "undefined" != typeof performance && performance.now
              ? performance.now.bind(performance)
              : function () {
                  return r() - n;
                };
        t.default = o;
      },
      222: function (e, t, r) {
        "use strict";
        var n = r(836);
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.default = function (e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
              r = t.stateSanitizer,
              n =
                void 0 === r
                  ? function (e) {
                      return e;
                    }
                  : r,
              o = t.actionSanitizer,
              a =
                void 0 === o
                  ? function (e) {
                      return e;
                    }
                  : o;
            return function (t) {
              return function (r, o, s) {
                var l = t(r, o, s),
                  f = l.dispatch,
                  d = u++;
                e.addEvent("lr.redux.InitialState", function () {
                  var e;
                  try {
                    e = n(l.getState());
                  } catch (e) {
                    console.error(e.toString());
                  }
                  return { state: e, storeId: d };
                });
                return c(
                  c({}, l),
                  {},
                  {
                    dispatch: function (t) {
                      var r,
                        o,
                        c = (0, i.default)();
                      try {
                        o = f(t);
                      } catch (e) {
                        r = e;
                      } finally {
                        var u = (0, i.default)() - c;
                        e.addEvent("lr.redux.ReduxAction", function () {
                          var e = null,
                            r = null;
                          try {
                            (e = n(l.getState())), (r = a(t));
                          } catch (e) {
                            console.error(e.toString());
                          }
                          return e && r
                            ? { storeId: d, action: r, duration: u, stateDelta: e }
                            : null;
                        });
                      }
                      if (r) throw r;
                      return o;
                    },
                  }
                );
              };
            };
          });
        var o = n(r(416)),
          i = n(r(707));
        function a(e, t) {
          var r = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(e);
            t &&
              (n = n.filter(function (t) {
                return Object.getOwnPropertyDescriptor(e, t).enumerable;
              })),
              r.push.apply(r, n);
          }
          return r;
        }
        function c(e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = null != arguments[t] ? arguments[t] : {};
            t % 2
              ? a(Object(r), !0).forEach(function (t) {
                  (0, o.default)(e, t, r[t]);
                })
              : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
              : a(Object(r)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                });
          }
          return e;
        }
        var u = 0;
      },
      43: function (e, t, r) {
        "use strict";
        var n = r(836);
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.default = function (e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
              r = t.stateSanitizer,
              n =
                void 0 === r
                  ? function (e) {
                      return e;
                    }
                  : r,
              a = t.actionSanitizer,
              c =
                void 0 === a
                  ? function (e) {
                      return e;
                    }
                  : a;
            return function (t) {
              var r = i++;
              return (
                e.addEvent("lr.redux.InitialState", function () {
                  var e;
                  try {
                    e = n(t.getState());
                  } catch (e) {
                    console.error(e.toString());
                  }
                  return { state: e, storeId: r };
                }),
                function (i) {
                  return function (a) {
                    var u,
                      s,
                      l = (0, o.default)();
                    try {
                      s = i(a);
                    } catch (e) {
                      u = e;
                    } finally {
                      var f = (0, o.default)() - l;
                      e.addEvent("lr.redux.ReduxAction", function () {
                        var e = null,
                          o = null;
                        try {
                          (e = n(t.getState())), (o = c(a));
                        } catch (e) {
                          console.error(e.toString());
                        }
                        return e && o
                          ? { storeId: r, action: o, duration: f, stateDelta: e }
                          : null;
                      });
                    }
                    if (u) throw u;
                    return s;
                  };
                }
              );
            };
          });
        var o = n(r(707)),
          i = 0;
      },
      94: function (e, t, r) {
        "use strict";
        var n = r(836);
        Object.defineProperty(t, "__esModule", { value: !0 }),
          Object.defineProperty(t, "createEnhancer", {
            enumerable: !0,
            get: function () {
              return o.default;
            },
          }),
          Object.defineProperty(t, "createMiddleware", {
            enumerable: !0,
            get: function () {
              return i.default;
            },
          });
        var o = n(r(222)),
          i = n(r(43));
      },
      668: function (e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), (t.default = void 0);
        var n = { collectWindowErrors: !0, debug: !1 },
          o =
            "undefined" != typeof window
              ? window
              : void 0 !== r.g
              ? r.g
              : "undefined" != typeof self
              ? self
              : {},
          i = [].slice,
          a = "?",
          c =
            /^(?:Uncaught (?:exception: )?)?((?:Eval|Internal|Range|Reference|Syntax|Type|URI)Error): ?(.*)$/;
        function u() {
          return "undefined" == typeof document || void 0 === document.location
            ? ""
            : document.location.href;
        }
        (n.report = (function () {
          var e,
            t,
            r = [],
            s = null,
            l = null,
            f = null;
          function d(e, t) {
            var o = null;
            if (!t || n.collectWindowErrors) {
              for (var a in r)
                if (r.hasOwnProperty(a))
                  try {
                    r[a].apply(null, [e].concat(i.call(arguments, 2)));
                  } catch (e) {
                    o = e;
                  }
              if (o) throw o;
            }
          }
          function p(t, r, o, i, s) {
            if (f) n.computeStackTrace.augmentStackTraceWithInitialElement(f, r, o, t), v();
            else if (s) d(n.computeStackTrace(s), !0);
            else {
              var l,
                p = { url: r, line: o, column: i },
                g = void 0,
                h = t;
              if ("[object String]" === {}.toString.call(t))
                (l = t.match(c)) && ((g = l[1]), (h = l[2]));
              (p.func = a), d({ name: g, message: h, url: u(), stack: [p] }, !0);
            }
            return !!e && e.apply(this, arguments);
          }
          function v() {
            var e = f,
              t = s;
            (s = null), (f = null), (l = null), d.apply(null, [e, !1].concat(t));
          }
          function g(e, t) {
            var r = i.call(arguments, 1);
            if (f) {
              if (l === e) return;
              v();
            }
            var o = n.computeStackTrace(e);
            if (
              ((f = o),
              (l = e),
              (s = r),
              setTimeout(
                function () {
                  l === e && v();
                },
                o.incomplete ? 2e3 : 0
              ),
              !1 !== t)
            )
              throw e;
          }
          return (
            (g.subscribe = function (n) {
              !(function () {
                if (t) return;
                (e = o.onerror), (o.onerror = p), (t = !0);
              })(),
                r.push(n);
            }),
            (g.unsubscribe = function (e) {
              for (var t = r.length - 1; t >= 0; --t) r[t] === e && r.splice(t, 1);
            }),
            (g.uninstall = function () {
              !(function () {
                if (!t) return;
                (o.onerror = e), (t = !1), (e = void 0);
              })(),
                (r = []);
            }),
            g
          );
        })()),
          (n.computeStackTrace = (function () {
            function e(e) {
              if (void 0 !== e.stack && e.stack) {
                for (
                  var t,
                    r,
                    n =
                      /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|<anonymous>).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
                    o =
                      /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|resource|\[native).*?)(?::(\d+))?(?::(\d+))?\s*$/i,
                    i =
                      /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i,
                    c = e.stack.split("\n"),
                    s = [],
                    l = (/^(.*) is undefined$/.exec(e.message), 0),
                    f = c.length;
                  l < f;
                  ++l
                ) {
                  if ((t = n.exec(c[l]))) {
                    var d = t[2] && -1 !== t[2].indexOf("native");
                    r = {
                      url: d ? null : t[2],
                      func: t[1] || a,
                      args: d ? [t[2]] : [],
                      line: t[3] ? +t[3] : null,
                      column: t[4] ? +t[4] : null,
                    };
                  } else if ((t = i.exec(c[l])))
                    r = {
                      url: t[2],
                      func: t[1] || a,
                      args: [],
                      line: +t[3],
                      column: t[4] ? +t[4] : null,
                    };
                  else {
                    if (!(t = o.exec(c[l]))) continue;
                    r = {
                      url: t[3],
                      func: t[1] || a,
                      args: t[2] ? t[2].split(",") : [],
                      line: t[4] ? +t[4] : null,
                      column: t[5] ? +t[5] : null,
                    };
                  }
                  !r.func && r.line && (r.func = a), s.push(r);
                }
                return s.length
                  ? (s[0].column || void 0 === e.columnNumber || (s[0].column = e.columnNumber + 1),
                    { name: e.name, message: e.message, url: u(), stack: s })
                  : null;
              }
            }
            function t(e, t, r, n) {
              var o = { url: t, line: r };
              if (o.url && o.line) {
                if (
                  ((e.incomplete = !1),
                  o.func || (o.func = a),
                  e.stack.length > 0 && e.stack[0].url === o.url)
                ) {
                  if (e.stack[0].line === o.line) return !1;
                  if (!e.stack[0].line && e.stack[0].func === o.func)
                    return (e.stack[0].line = o.line), !1;
                }
                return e.stack.unshift(o), (e.partial = !0), !0;
              }
              return (e.incomplete = !0), !1;
            }
            function r(e, i) {
              for (
                var c,
                  s,
                  l = /function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i,
                  f = [],
                  d = {},
                  p = !1,
                  v = r.caller;
                v && !p;
                v = v.caller
              )
                if (v !== o && v !== n.report) {
                  if (
                    ((s = { url: null, func: a, line: null, column: null }),
                    v.name ? (s.func = v.name) : (c = l.exec(v.toString())) && (s.func = c[1]),
                    void 0 === s.func)
                  )
                    try {
                      s.func = c.input.substring(0, c.input.indexOf("{"));
                    } catch (e) {}
                  d["" + v] ? (p = !0) : (d["" + v] = !0), f.push(s);
                }
              i && f.splice(0, i);
              var g = { name: e.name, message: e.message, url: u(), stack: f };
              return (
                t(g, e.sourceURL || e.fileName, e.line || e.lineNumber, e.message || e.description),
                g
              );
            }
            function o(t, o) {
              var i = null;
              o = null == o ? 0 : +o;
              try {
                if ((i = e(t))) return i;
              } catch (e) {
                if (n.debug) throw e;
              }
              try {
                if ((i = r(t, o + 1))) return i;
              } catch (e) {
                if (n.debug) throw e;
              }
              return { name: t.name, message: t.message, url: u() };
            }
            return (
              (o.augmentStackTraceWithInitialElement = t), (o.computeStackTraceFromStackProp = e), o
            );
          })());
        var s = n;
        t.default = s;
      },
      5: function (e, t) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.DELIGHTED_FEEDBACK_PREFIX =
            t.DELIGHTED_RESPONSES_REGEX =
            t.WOOTRIC_RESPONSES_REGEX =
              void 0);
        t.WOOTRIC_RESPONSES_REGEX = /^https:\/\/production.wootric.com\/responses/;
        t.DELIGHTED_RESPONSES_REGEX = /^https:\/\/web.delighted.com\/e\/[a-zA-Z-]*\/c/;
        t.DELIGHTED_FEEDBACK_PREFIX = "comment=";
      },
      19: function (e, t, r) {
        "use strict";
        var n = r(836);
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.createUnsubListener = function (e) {
            return function () {
              e.clear();
            };
          }),
          (t.Handler = void 0);
        var o = n(r(690)),
          i = n(r(728)),
          a = (function () {
            function e(t) {
              (0, o.default)(this, e), (this._value = void 0), (this._value = t);
            }
            return (
              (0, i.default)(e, [
                {
                  key: "get",
                  value: function () {
                    return this._value;
                  },
                },
                {
                  key: "clear",
                  value: function () {
                    this._value = void 0;
                  },
                },
              ]),
              e
            );
          })();
        t.Handler = a;
      },
      800: function (e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.default = function (e, t, r) {
            if ("function" != typeof e[t]) return o;
            try {
              var i = function () {
                  for (var e, t = arguments.length, r = new Array(t), n = 0; n < t; n++)
                    r[n] = arguments[n];
                  var o = a.apply(this, r);
                  return null === (e = c.get()) || void 0 === e || e.apply(this, r), o;
                },
                a = e[t],
                c = new n.Handler(r);
              return (
                (e[t] = i),
                function () {
                  c.clear(), e[t] === i && (e[t] = a);
                }
              );
            } catch (e) {
              return o;
            }
          });
        var n = r(19),
          o = function () {};
      },
      536: function (e, t) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), (t.default = void 0);
        var r =
          "undefined" != typeof console && console.error && console.error.bind
            ? console.error.bind(console)
            : function () {};
        t.default = r;
      },
      645: function (e, t) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.default = function (e, t) {
            if (null == e) return {};
            var r = {};
            return (
              Object.keys(e).forEach(function (n) {
                r[n] = t(e[n]);
              }),
              r
            );
          });
      },
      167: function (e, t, r) {
        "use strict";
        var n = r(836);
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.default = function (e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : function () {};
            return function () {
              var r;
              try {
                r = e.apply(void 0, arguments);
              } catch (e) {
                if ("undefined" != typeof window && window._lrdebug) throw e;
                var n = t(e);
                (0, i.default)("LogRocket", e), (0, o.default)(e, n);
              }
              return r;
            };
          });
        var o = n(r(769)),
          i = n(r(536));
      },
      731: function (e, t, r) {
        "use strict";
        var n = r(836);
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.scrubException = function (e, t) {
            if (t) {
              var r,
                n = i(u);
              try {
                for (n.s(); !(r = n.n()).done; ) {
                  var o = r.value,
                    a = t[o];
                  c(a) && (e[o] = a.toString());
                }
              } catch (e) {
                n.e(e);
              } finally {
                n.f();
              }
              var l,
                f = i(s);
              try {
                for (f.s(); !(l = f.n()).done; ) {
                  for (
                    var d = l.value, p = t[d] || {}, v = {}, g = 0, h = Object.keys(p);
                    g < h.length;
                    g++
                  ) {
                    var y = h[g],
                      b = p[y];
                    c(b) && (v[y.toString()] = b.toString());
                  }
                  e[d] = v;
                }
              } catch (e) {
                f.e(e);
              } finally {
                f.f();
              }
            }
          });
        var o = n(r(698));
        function i(e, t) {
          var r = ("undefined" != typeof Symbol && e[Symbol.iterator]) || e["@@iterator"];
          if (!r) {
            if (
              Array.isArray(e) ||
              (r = (function (e, t) {
                if (!e) return;
                if ("string" == typeof e) return a(e, t);
                var r = Object.prototype.toString.call(e).slice(8, -1);
                "Object" === r && e.constructor && (r = e.constructor.name);
                if ("Map" === r || "Set" === r) return Array.from(e);
                if ("Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))
                  return a(e, t);
              })(e)) ||
              (t && e && "number" == typeof e.length)
            ) {
              r && (e = r);
              var n = 0,
                o = function () {};
              return {
                s: o,
                n: function () {
                  return n >= e.length ? { done: !0 } : { done: !1, value: e[n++] };
                },
                e: function (e) {
                  throw e;
                },
                f: o,
              };
            }
            throw new TypeError(
              "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
            );
          }
          var i,
            c = !0,
            u = !1;
          return {
            s: function () {
              r = r.call(e);
            },
            n: function () {
              var e = r.next();
              return (c = e.done), e;
            },
            e: function (e) {
              (u = !0), (i = e);
            },
            f: function () {
              try {
                c || null == r.return || r.return();
              } finally {
                if (u) throw i;
              }
            },
          };
        }
        function a(e, t) {
          (null == t || t > e.length) && (t = e.length);
          for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
          return n;
        }
        function c(e) {
          return /boolean|number|string/.test((0, o.default)(e));
        }
        var u = ["level", "logger"],
          s = ["tags", "extra"];
      },
      769: function (e, t, r) {
        "use strict";
        var n = r(836);
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.sendTelemetry = function (e, t) {
            if ("undefined" != typeof window && window._lrdebug) return void (0, i.default)(e);
            if (
              t &&
              t.extra &&
              t.extra.appID &&
              "function" == typeof t.extra.appID.indexOf &&
              0 === t.extra.appID.indexOf("au2drp/") &&
              Math.random() >= 0.25
            )
              return;
            l(u({ message: e }, t));
          }),
          (t.default = function (e, t) {
            try {
              var r,
                n,
                o = e.message;
              try {
                r = JSON.stringify(t).slice(0, 1e3);
              } catch (e) {
                try {
                  r = "Could not stringify payload: ".concat(Object.prototype.toString.call(t));
                } catch (e) {}
              }
              try {
                n = a.default.computeStackTrace(e).stack.map(function (e) {
                  return {
                    filename: e.url,
                    lineno: e.line,
                    colno: e.column,
                    function: e.func || "?",
                  };
                });
              } catch (e) {}
              l({
                message: o,
                extra: { stringPayload: r },
                exception: { values: [{ type: e.type, value: o, stacktrace: { frames: n } }] },
              });
            } catch (e) {
              (0, i.default)("Failed to send", e);
            }
          });
        var o = n(r(416)),
          i = n(r(536)),
          a = n(r(668));
        function c(e, t) {
          var r = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(e);
            t &&
              (n = n.filter(function (t) {
                return Object.getOwnPropertyDescriptor(e, t).enumerable;
              })),
              r.push.apply(r, n);
          }
          return r;
        }
        function u(e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = null != arguments[t] ? arguments[t] : {};
            t % 2
              ? c(Object(r), !0).forEach(function (t) {
                  (0, o.default)(e, t, r[t]);
                })
              : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
              : c(Object(r)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                });
          }
          return e;
        }
        var s = "efe8214c2db9c172f21f9b68eef45d1786b24222";
        function l(e) {
          try {
            var t,
              r,
              n = e.message,
              o =
                "https://e.logrocket.com/api/3/store/?sentry_version=7&sentry_client=http%2F3.8.0&sentry_key=b64162b4187a4c5caae8a68a7e291793",
              a = JSON.stringify(
                u(
                  {
                    message: n,
                    logger: "javascript",
                    platform: "javascript",
                    request: {
                      headers: {
                        "User-Agent": "undefined" != typeof navigator && navigator.userAgent,
                      },
                      url: "undefined" != typeof location && location.href,
                    },
                    release: s,
                    environment:
                      (null === (t = window) ||
                      void 0 === t ||
                      null === (r = t.__SDKCONFIG__) ||
                      void 0 === r
                        ? void 0
                        : r.scriptEnv) || "prod",
                  },
                  e
                )
              );
            if ("undefined" != typeof window) {
              var c = new (window._lrXMLHttpRequest || XMLHttpRequest)();
              c.open("POST", o), c.send(a);
            } else
              "undefined" != typeof fetch &&
                fetch(o, { method: "POST", body: a }).catch(function (e) {
                  (0, i.default)("Failed to send via fetch", e);
                });
          } catch (e) {
            (0, i.default)("Failed to send", e);
          }
        }
      },
      242: function (e, t) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.default = function (e, t) {
            var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
            return e && t && e.substring(r, r + t.length) === t;
          });
      },
      868: function (e, t, r) {
        "use strict";
        var n = r(836);
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.default = t.MAX_QUEUE_SIZE = void 0);
        var o = n(r(690)),
          i = n(r(728)),
          a = n(r(416)),
          c = n(r(215)),
          u = n(r(986)),
          s = r(476),
          l = n(r(749)),
          f = r(94);
        function d(e, t) {
          var r = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(e);
            t &&
              (n = n.filter(function (t) {
                return Object.getOwnPropertyDescriptor(e, t).enumerable;
              })),
              r.push.apply(r, n);
          }
          return r;
        }
        function p(e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = null != arguments[t] ? arguments[t] : {};
            t % 2
              ? d(Object(r), !0).forEach(function (t) {
                  (0, a.default)(e, t, r[t]);
                })
              : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
              : d(Object(r)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                });
          }
          return e;
        }
        t.MAX_QUEUE_SIZE = 1e3;
        var v = (function () {
          function e() {
            var t = this;
            (0, o.default)(this, e),
              (this._buffer = []),
              ["log", "info", "warn", "error", "debug"].forEach(function (e) {
                t[e] = function () {
                  for (var r = arguments.length, n = new Array(r), o = 0; o < r; o++)
                    n[o] = arguments[o];
                  t.addEvent(
                    "lr.core.LogEvent",
                    function () {
                      return (
                        "error" === e &&
                          (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {})
                            .shouldAggregateConsoleErrors &&
                          s.Capture.captureMessage(t, n[0], n, {}, !0),
                        { logLevel: e.toUpperCase(), args: n }
                      );
                    },
                    { shouldCaptureStackTrace: !0 }
                  );
                };
              }),
              (this._isInitialized = !1),
              (this._installed = []),
              (window._lr_surl_cb = this.getSessionURL.bind(this));
          }
          return (
            (0, i.default)(e, [
              {
                key: "addEvent",
                value: function (e, t) {
                  var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
                    n = Date.now();
                  this._run(function (o) {
                    o.addEvent(e, t, p(p({}, r), {}, { timeOverride: n }));
                  });
                },
              },
              {
                key: "onLogger",
                value: function (e) {
                  for (this._logger = e; this._buffer.length > 0; ) {
                    this._buffer.shift()(this._logger);
                  }
                },
              },
              {
                key: "_run",
                value: function (e) {
                  if (!this._isDisabled)
                    if (this._logger) e(this._logger);
                    else {
                      if (this._buffer.length >= 1e3)
                        return (
                          (this._isDisabled = !0),
                          console.warn(
                            "LogRocket: script did not load. Check that you have a valid network connection."
                          ),
                          void this.uninstall()
                        );
                      this._buffer.push(e.bind(this));
                    }
                },
              },
              {
                key: "init",
                value: function (e) {
                  var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                  if (!this._isInitialized) {
                    var r,
                      n = t.shouldAugmentNPS,
                      o = void 0 === n || n,
                      i = t.shouldParseXHRBlob,
                      a = void 0 !== i && i,
                      f = t.shouldDetectExceptions;
                    (void 0 === f || f) && this._installed.push((0, s.registerExceptions)(this)),
                      this._installed.push(
                        (0, u.default)(this, {
                          shouldAugmentNPS: !!o,
                          shouldParseXHRBlob: !!a,
                          isDisabled:
                            !1 ===
                            (null == t || null === (r = t.network) || void 0 === r
                              ? void 0
                              : r.isEnabled),
                        })
                      ),
                      this._installed.push((0, l.default)(this)),
                      (this._isInitialized = !0),
                      this._run(function (r) {
                        r.init(
                          e,
                          (function () {
                            var e =
                                arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                              t = e.ingestServer,
                              r = (0, c.default)(e, ["ingestServer"]);
                            return t
                              ? p(
                                  { serverURL: "".concat(t, "/i"), statsURL: "".concat(t, "/s") },
                                  r
                                )
                              : r;
                          })(t)
                        );
                      });
                  }
                },
              },
              {
                key: "start",
                value: function () {
                  this._run(function (e) {
                    e.start();
                  });
                },
              },
              {
                key: "uninstall",
                value: function () {
                  this._installed.forEach(function (e) {
                    return e();
                  }),
                    (this._buffer = []),
                    this._run(function (e) {
                      e.uninstall();
                    });
                },
              },
              {
                key: "identify",
                value: function (e, t) {
                  this._run(function (r) {
                    r.identify(e, t);
                  });
                },
              },
              {
                key: "startNewSession",
                value: function () {
                  this._run(function (e) {
                    e.startNewSession();
                  });
                },
              },
              {
                key: "track",
                value: function (e, t) {
                  this._run(function (r) {
                    r.track(e, t);
                  });
                },
              },
              {
                key: "getSessionURL",
                value: function (e) {
                  if ("function" != typeof e)
                    throw new Error("LogRocket: must pass callback to getSessionURL()");
                  this._run(function (t) {
                    t.getSessionURL ? t.getSessionURL(e) : e(t.recordingURL);
                  });
                },
              },
              {
                key: "trackScrollEvent",
                value: function (e) {
                  this._logger && this._logger.trackScrollEvent(e);
                },
              },
              {
                key: "getVersion",
                value: function (e) {
                  this._run(function (t) {
                    e(t.version);
                  });
                },
              },
              {
                key: "captureMessage",
                value: function (e) {
                  var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                  s.Capture.captureMessage(this, e, [e], t);
                },
              },
              {
                key: "captureException",
                value: function (e) {
                  var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                  s.Capture.captureException(this, e, t);
                },
              },
              {
                key: "version",
                get: function () {
                  return this._logger && this._logger.version;
                },
              },
              {
                key: "sessionURL",
                get: function () {
                  return this._logger && this._logger.recordingURL;
                },
              },
              {
                key: "recordingURL",
                get: function () {
                  return this._logger && this._logger.recordingURL;
                },
              },
              {
                key: "recordingID",
                get: function () {
                  return this._logger && this._logger.recordingID;
                },
              },
              {
                key: "threadID",
                get: function () {
                  return this._logger && this._logger.threadID;
                },
              },
              {
                key: "tabID",
                get: function () {
                  return this._logger && this._logger.tabID;
                },
              },
              {
                key: "reduxEnhancer",
                value: function () {
                  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                  return (0, f.createEnhancer)(this, e);
                },
              },
              {
                key: "reduxMiddleware",
                value: function () {
                  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                  return (0, f.createMiddleware)(this, e);
                },
              },
              {
                key: "isDisabled",
                get: function () {
                  return !!(this._isDisabled || (this._logger && this._logger._isDisabled));
                },
              },
            ]),
            e
          );
        })();
        t.default = v;
      },
      923: function (e, t, r) {
        "use strict";
        var n = r(836);
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.default = function () {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : function () {},
              t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : a,
              r =
                arguments.length > 2 && void 0 !== arguments[2]
                  ? arguments[2]
                  : function () {
                      return new o.default();
                    };
            if ("undefined" != typeof navigator && "ReactNative" === navigator.product)
              throw new Error(i);
            if ("undefined" != typeof window) {
              if (window._disableLogRocket) return t();
              if (window.MutationObserver && window.WeakMap) {
                window._lrMutationObserver = window.MutationObserver;
                var n = r();
                return e(n), n;
              }
            }
            return a();
          });
        var o = n(r(868)),
          i =
            "LogRocket on React Native requires the LogRocket React Native specific SDK. See setup guide here https://docs.logrocket.com/reference/react-native.",
          a = function () {
            return {
              init: function () {},
              uninstall: function () {},
              log: function () {},
              info: function () {},
              warn: function () {},
              error: function () {},
              debug: function () {},
              addEvent: function () {},
              identify: function () {},
              start: function () {},
              get threadID() {
                return null;
              },
              get recordingID() {
                return null;
              },
              get recordingURL() {
                return null;
              },
              reduxEnhancer: function () {
                return function (e) {
                  return function () {
                    return e.apply(void 0, arguments);
                  };
                };
              },
              reduxMiddleware: function () {
                return function () {
                  return function (e) {
                    return function (t) {
                      return e(t);
                    };
                  };
                };
              },
              track: function () {},
              getSessionURL: function () {},
              getVersion: function () {},
              startNewSession: function () {},
              onLogger: function () {},
              setClock: function () {},
              captureMessage: function () {},
              captureException: function () {},
            };
          };
      },
      974: function (e, t, r) {
        "use strict";
        var n = r(836);
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.getDomainsAndEnv = c),
          (t.setupBaseSDKCONFIG = u),
          (t.default = function () {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
              t = e.enterpriseServer,
              r = e.sdkVersion,
              n = void 0 === r ? "9.0.2" : r,
              a = (0, o.default)(e, ["enterpriseServer", "sdkVersion"]),
              s = c(n),
              l = s.scriptEnv,
              f = s.scriptOrigin,
              d = s.scriptIngest,
              p = a.sdkServer || t,
              v = a.ingestServer || t || d,
              g = (0, i.default)(function () {
                var e = document.createElement("script");
                v && (u(v), (window.__SDKCONFIG__.scriptEnv = l)),
                  p
                    ? (e.src = "".concat(p, "/logger.min.js"))
                    : window.__SDKCONFIG__ && window.__SDKCONFIG__.loggerURL
                    ? (e.src = window.__SDKCONFIG__.loggerURL)
                    : window._lrAsyncScript
                    ? (e.src = window._lrAsyncScript)
                    : (e.src = "".concat(f, "/logger-1.min.js")),
                  (e.async = !0),
                  document.head.appendChild(e),
                  (e.onload = function () {
                    "function" == typeof window._LRLogger
                      ? setTimeout(function () {
                          g.onLogger(new window._LRLogger({ sdkVersion: n }));
                        })
                      : (console.warn(
                          "LogRocket: script execution has been blocked by a product or service."
                        ),
                        g.uninstall());
                  }),
                  (e.onerror = function () {
                    console.warn(
                      "LogRocket: script could not load. Check that you have a valid network connection."
                    ),
                      g.uninstall();
                  });
              });
            return g;
          });
        var o = n(r(215)),
          i = n(r(923)),
          a = {
            "cdn.logrocket.com": "https://r.logrocket.io",
            "cdn.logrocket.io": "https://r.logrocket.io",
            "cdn.lr-ingest.io": "https://r.lr-ingest.io",
            "cdn.lr-in.com": "https://r.lr-in.com",
            "cdn.lr-in-prod.com": "https://r.lr-in-prod.com",
            "cdn.lr-ingest.com": "https://r.lr-ingest.com",
            "cdn.ingest-lr.com": "https://r.ingest-lr.com",
            "cdn.lr-intake.com": "https://r.lr-intake.com",
            "cdn.intake-lr.com": "https://r.intake-lr.com",
            "cdn.logr-ingest.com": "https://r.logr-ingest.com",
            "cdn.lrkt-in.com": "https://r.lrkt-in.com",
            "cdn-staging.logrocket.io": "https://staging-i.logrocket.io",
            "cdn-staging.lr-ingest.io": "https://staging-i.lr-ingest.io",
            "cdn-staging.lr-in.com": "https://staging-i.lr-in.com",
            "cdn-staging.lr-in-prod.com": "https://staging-i.lr-in-prod.com",
            "cdn-staging.lr-ingest.com": "https://staging-i.lr-ingest.com",
            "cdn-staging.ingest-lr.com": "https://staging-i.ingest-lr.com",
            "cdn-staging.lr-intake.com": "https://staging-i.lr-intake.com",
            "cdn-staging.intake-lr.com": "https://staging-i.intake-lr.com",
            "cdn-staging.logr-ingest.com": "https://staging-i.logr-ingest.com",
            "cdn-staging.lrkt-in.com": "https://staging-i.lrkt-in.com",
          };
        function c(e) {
          if ("script" === e || "shopify-pixel" === e) {
            try {
              var t = document.currentScript.src.match(/^(https?:\/\/([^\\]+))\/.+$/),
                r = t && t[2];
              if (r && a[r])
                return {
                  scriptEnv:
                    ((n = r),
                    n.startsWith("cdn-staging")
                      ? "staging"
                      : n.startsWith("localhost")
                      ? "development"
                      : "prod"),
                  scriptOrigin: t && t[1],
                  scriptIngest: a[r],
                };
            } catch (e) {}
            return { scriptEnv: "prod", scriptOrigin: "https://cdn.logrocket.io" };
          }
          return {
            scriptEnv: "staging",
            scriptOrigin: "https://cdn-staging.lrkt-in.com",
            scriptIngest: "https://staging-i.lrkt-in.com",
          };
          var n;
        }
        function u(e) {
          void 0 === window.__SDKCONFIG__ && (window.__SDKCONFIG__ = {}),
            (window.__SDKCONFIG__.serverURL = "".concat(e, "/i")),
            (window.__SDKCONFIG__.statsURL = "".concat(e, "/s"));
        }
      },
      897: function (e) {
        (e.exports = function (e, t) {
          (null == t || t > e.length) && (t = e.length);
          for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
          return n;
        }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports);
      },
      405: function (e, t, r) {
        var n = r(897);
        (e.exports = function (e) {
          if (Array.isArray(e)) return n(e);
        }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports);
      },
      690: function (e) {
        (e.exports = function (e, t) {
          if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
        }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports);
      },
      728: function (e, t, r) {
        var n = r(62);
        function o(e, t) {
          for (var r = 0; r < t.length; r++) {
            var o = t[r];
            (o.enumerable = o.enumerable || !1),
              (o.configurable = !0),
              "value" in o && (o.writable = !0),
              Object.defineProperty(e, n(o.key), o);
          }
        }
        (e.exports = function (e, t, r) {
          return (
            t && o(e.prototype, t),
            r && o(e, r),
            Object.defineProperty(e, "prototype", { writable: !1 }),
            e
          );
        }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports);
      },
      416: function (e, t, r) {
        var n = r(62);
        (e.exports = function (e, t, r) {
          return (
            (t = n(t)) in e
              ? Object.defineProperty(e, t, {
                  value: r,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                })
              : (e[t] = r),
            e
          );
        }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports);
      },
      836: function (e) {
        (e.exports = function (e) {
          return e && e.__esModule ? e : { default: e };
        }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports);
      },
      498: function (e) {
        (e.exports = function (e) {
          if (
            ("undefined" != typeof Symbol && null != e[Symbol.iterator]) ||
            null != e["@@iterator"]
          )
            return Array.from(e);
        }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports);
      },
      281: function (e) {
        (e.exports = function () {
          throw new TypeError(
            "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
          );
        }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports);
      },
      215: function (e, t, r) {
        var n = r(71);
        (e.exports = function (e, t) {
          if (null == e) return {};
          var r,
            o,
            i = n(e, t);
          if (Object.getOwnPropertySymbols) {
            var a = Object.getOwnPropertySymbols(e);
            for (o = 0; o < a.length; o++)
              (r = a[o]),
                t.indexOf(r) >= 0 ||
                  (Object.prototype.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
          }
          return i;
        }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports);
      },
      71: function (e) {
        (e.exports = function (e, t) {
          if (null == e) return {};
          var r,
            n,
            o = {},
            i = Object.keys(e);
          for (n = 0; n < i.length; n++) (r = i[n]), t.indexOf(r) >= 0 || (o[r] = e[r]);
          return o;
        }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports);
      },
      861: function (e, t, r) {
        var n = r(405),
          o = r(498),
          i = r(116),
          a = r(281);
        (e.exports = function (e) {
          return n(e) || o(e) || i(e) || a();
        }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports);
      },
      36: function (e, t, r) {
        var n = r(698).default;
        (e.exports = function (e, t) {
          if ("object" !== n(e) || null === e) return e;
          var r = e[Symbol.toPrimitive];
          if (void 0 !== r) {
            var o = r.call(e, t || "default");
            if ("object" !== n(o)) return o;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === t ? String : Number)(e);
        }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports);
      },
      62: function (e, t, r) {
        var n = r(698).default,
          o = r(36);
        (e.exports = function (e) {
          var t = o(e, "string");
          return "symbol" === n(t) ? t : String(t);
        }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports);
      },
      698: function (e) {
        function t(r) {
          return (
            (e.exports = t =
              "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (e) {
                    return typeof e;
                  }
                : function (e) {
                    return e &&
                      "function" == typeof Symbol &&
                      e.constructor === Symbol &&
                      e !== Symbol.prototype
                      ? "symbol"
                      : typeof e;
                  }),
            (e.exports.__esModule = !0),
            (e.exports.default = e.exports),
            t(r)
          );
        }
        (e.exports = t), (e.exports.__esModule = !0), (e.exports.default = e.exports);
      },
      116: function (e, t, r) {
        var n = r(897);
        (e.exports = function (e, t) {
          if (e) {
            if ("string" == typeof e) return n(e, t);
            var r = Object.prototype.toString.call(e).slice(8, -1);
            return (
              "Object" === r && e.constructor && (r = e.constructor.name),
              "Map" === r || "Set" === r
                ? Array.from(e)
                : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
                ? n(e, t)
                : void 0
            );
          }
        }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports);
      },
    },
    t = {};
  function r(n) {
    var o = t[n];
    if (void 0 !== o) return o.exports;
    var i = (t[n] = { exports: {} });
    return e[n](i, i.exports, r), i.exports;
  }
  r.g = (function () {
    if ("object" == typeof globalThis) return globalThis;
    try {
      return this || new Function("return this")();
    } catch (e) {
      if ("object" == typeof window) return window;
    }
  })();
  var n = {};
  !(function () {
    "use strict";
    var e = n,
      t = r(836);
    e.default = void 0;
    var o = (0, t(r(974)).default)({ sdkVersion: "script" });
    e.default = o;
  })(),
    (this.LogRocket = n.default);
})();
