// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"w1y6":[function(require,module,exports) {
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ankiScheduler = function ankiScheduler(userConfig) {
  var config = {
    defaultFactor: 2.5,
    firstFewIntervals: [1, 6],
    factorModifier: 0.15,
    easeBonus: 1.3,
    hardFactor: 1.2,
    minFactor: 1.3,
    jitterPercentage: 0.05,
    maxInterval: 50 * 365,
    responseTexts: ["Again.", "Hard.", "Good.", "Easy."]
  };
  config = Object.assign(config, userConfig);

  var algorithm = function algorithm(history) {
    var nextInterval;
    var lastFail = history ? history.map(function (review) {
      return review.signal;
    }).lastIndexOf("1") : 0;
    history = history ? lastFail == -1 ? history : history.slice(lastFail + 1) : []; // Check if in learning phase

    if (history.length == 0 || history.length <= config.firstFewIntervals.length) {
      return [{
        responseText: config.responseTexts[0],
        signal: 1,
        interval: 0
      }, {
        responseText: config.responseTexts[2],
        signal: 3,
        interval: config.firstFewIntervals[history ? Math.max(history.length - 1, 0) : 0]
      }];
    } else {
      var calculateNewParams = function calculateNewParams(prevFactor, prevInterval, delay, signal) {
        var _ref = function () {
          switch (signal) {
            case "1":
              return [prevFactor - 0.2, 0];

            case "2":
              return [prevFactor - config.factorModifier, prevInterval * config.hardFactor];

            case "3":
              return [prevFactor, (prevInterval + delay / 2) * prevFactor];

            case "4":
              return [prevFactor + config.factorModifier, (prevInterval + delay) * prevFactor * config.easeBonus];

            default:
              return [prevFactor, prevInterval * prevFactor];
          }
        }(),
            _ref2 = _slicedToArray(_ref, 2),
            newFactor = _ref2[0],
            newInterval = _ref2[1];

        return [newFactor, Math.min(newInterval, config.maxInterval)];
      };

      var getDelay = function getDelay(hist, prevInterval) {
        if (hist && hist.length > 1) return Math.max((hist[hist.length - 1].date - hist[hist.length - 2].date) / (1000 * 60 * 60 * 24) - prevInterval, 0);else return 0;
      };

      var recurAnki = function recurAnki(hist) {
        if (!hist || hist.length <= config.firstFewIntervals.length) {
          return [config.defaultFactor, config.firstFewIntervals[config.firstFewIntervals.length - 1]];
        } else {
          var _recurAnki = recurAnki(hist.slice(0, -1)),
              _recurAnki2 = _slicedToArray(_recurAnki, 2),
              prevFactor = _recurAnki2[0],
              prevInterval = _recurAnki2[1];

          return calculateNewParams(prevFactor, prevInterval, getDelay(hist, prevInterval), hist[hist.length - 1].signal);
        }
      };

      var _recurAnki3 = recurAnki(history.slice(0, -1)),
          _recurAnki4 = _slicedToArray(_recurAnki3, 2),
          finalFactor = _recurAnki4[0],
          finalInterval = _recurAnki4[1];

      var addJitter = function addJitter(interval) {
        var jitter = interval * config.jitterPercentage;
        return interval + (-jitter + Math.random() * jitter);
      };

      var getResponse = function getResponse(signal) {
        return {
          responseText: config.responseTexts[parseInt(signal) - 1],
          signal: signal,
          interval: Math.floor(addJitter(calculateNewParams(finalFactor, finalInterval, getDelay(history, finalInterval), signal)[1]))
        };
      };

      return [getResponse("1"), getResponse("2"), getResponse("3"), getResponse("4")];
    }
  };

  return algorithm;
};

module.exports = ankiScheduler;
},{}],"PwIx":[function(require,module,exports) {
"use strict";

var _ankiScheduler = _interopRequireDefault(require("./ankiScheduler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* roam/sr - Spaced Repetition in Roam Research
   Author: Adam Krivka
   v1.0.1
   https://github.com/aidam38/roamsr
 */
var VERSION = "v1.0.1";
if (!window.roamsr) window.roamsr = {};
/* ====== SCHEDULERS / ALGORITHMS ====== */

roamsr.ankiScheduler = _ankiScheduler.default;
/* ====== HELPER FUNCTIONS ====== */

roamsr.sleep = function (m) {
  var t = m ? m : 10;
  return new Promise(function (r) {
    return setTimeout(r, t);
  });
};

roamsr.createUid = function () {
  // From roam42 based on https://github.com/ai/nanoid#js version 3.1.2
  var nanoid = function nanoid() {
    var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 21;
    var e = "",
        r = crypto.getRandomValues(new Uint8Array(t));

    for (; t--;) {
      var n = 63 & r[t];
      e += n < 36 ? n.toString(36) : n < 62 ? (n - 26).toString(36).toUpperCase() : n < 63 ? "_" : "-";
    }

    return e;
  };

  return nanoid(9);
};

roamsr.removeSelector = function (selector) {
  document.querySelectorAll(selector).forEach(function (element) {
    element.remove();
  });
};

roamsr.goToUid = function (uid) {
  var baseUrl = "/" + new URL(window.location.href).hash.split("/").slice(0, 3).join("/");
  var url = uid ? baseUrl + "/page/" + uid : baseUrl;
  location.assign(url);
};

roamsr.getFuckingDate = function (str) {
  if (!str) return null;
  var strSplit = str.split("-");
  if (strSplit.length != 3) return null;

  try {
    var date = new Date(strSplit[2] + "-" + strSplit[0] + "-" + strSplit[1]);
    date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    return date;
  } catch (e) {
    console.log(e);
  }
};

roamsr.getRoamDate = function (date) {
  if (!date || date == 0) date = new Date();
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var suffix = function (d) {
    if (d > 3 && d < 21) return "th";

    switch (d % 10) {
      case 1:
        return "st";

      case 2:
        return "nd";

      case 3:
        return "rd";

      default:
        return "th";
    }
  }(date.getDate());

  var pad = function pad(n) {
    return n.toString().padStart(2, "0");
  };

  var roamDate = {
    title: months[date.getMonth()] + " " + date.getDate() + suffix + ", " + date.getFullYear(),
    uid: pad(date.getMonth() + 1) + "-" + pad(date.getDate()) + "-" + date.getFullYear()
  };
  return roamDate;
};

roamsr.getIntervalHumanReadable = function (n) {
  if (n == 0) return "<10 min";else if (n > 0 && n <= 15) return n + " d";else if (n <= 30) return (n / 7).toFixed(1) + " w";else if (n <= 365) return (n / 30).toFixed(1) + " m";
};
/* ====== LOADING CARDS ====== */


roamsr.loadCards = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(limits) {
    var dateBasis,
        getDecks,
        getAlgorithm,
        isNew,
        getHistory,
        mainQuery,
        mainQueryResult,
        cards,
        todayUid,
        todayQuery,
        todayQueryResult,
        todayReviewedCards,
        _iterator,
        _step,
        todayReviews,
        _args = arguments;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            dateBasis = _args.length > 1 && _args[1] !== undefined ? _args[1] : new Date();

            // Common functions
            getDecks = function getDecks(res) {
              var recurDeck = function recurDeck(part) {
                var result = [];
                if (part.refs) result.push.apply(result, _toConsumableArray(part.refs));
                if (part._children && part._children.length > 0) result.push.apply(result, _toConsumableArray(recurDeck(part._children[0])));
                return result;
              };

              var possibleDecks = recurDeck(res).map(function (deck) {
                return deck.title;
              });
              return possibleDecks.filter(function (deckTag) {
                return roamsr.settings.customDecks.map(function (customDeck) {
                  return customDeck.tag;
                }).includes(deckTag);
              });
            };

            getAlgorithm = function getAlgorithm(res) {
              var decks = getDecks(res);
              var preferredDeck;
              var algorithm;

              if (decks && decks.length > 0) {
                preferredDeck = roamsr.settings.customDecks.filter(function (customDeck) {
                  return customDeck.tag == decks[decks.length - 1];
                })[0];
              } else preferredDeck = roamsr.settings.defaultDeck;

              var scheduler = preferredDeck.scheduler || preferredDeck.algorithm;
              var config = preferredDeck.config;

              if (!scheduler || scheduler === "anki") {
                algorithm = roamsr.ankiScheduler(config);
              } else algorithm = scheduler(config);

              return algorithm;
            };

            isNew = function isNew(res) {
              return res._refs ? !res._refs.some(function (review) {
                var reviewDate = new Date(roamsr.getFuckingDate(review.page.uid));
                reviewDate.setDate(reviewDate.getDate() + 1);
                return reviewDate < dateBasis;
              }) : true;
            };

            getHistory = function getHistory(res) {
              if (res._refs) {
                return res._refs.filter(function (ref) {
                  return ref._children && ref._children[0].refs ? ref._children[0].refs.map(function (ref2) {
                    return ref2.title;
                  }).includes("roam/sr/review") : false;
                }).map(function (review) {
                  return {
                    date: roamsr.getFuckingDate(review.page.uid),
                    signal: review.refs[0] ? review.refs[0].title.slice(2) : null,
                    uid: review.uid,
                    string: review.string
                  };
                }).sort(function (a, b) {
                  return a.date - b.date;
                });
              } else return [];
            }; // Query for all cards and their history


            mainQuery = "[\n    :find (pull ?card [\n      :block/string \n      :block/uid \n      {:block/refs [:node/title]} \n      {:block/_refs [:block/uid :block/string {:block/_children [:block/uid {:block/refs [:node/title]}]} {:block/refs [:node/title]} {:block/page [:block/uid]}]}\n      {:block/_children ...}\n    ])\n    :where \n      [?card :block/refs ?srPage] \n      [?srPage :node/title \"".concat(roamsr.settings.mainTag, "\"] \n      (not-join [?card] \n        [?card :block/refs ?flagPage] \n        [?flagPage :node/title \"").concat(roamsr.settings.flagTag, "\"])\n      (not-join [?card] \n        [?card :block/refs ?queryPage] \n        [?queryPage :node/title \"query\"])\n    ]");
            _context.next = 8;
            return window.roamAlphaAPI.q(mainQuery);

          case 8:
            mainQueryResult = _context.sent;
            cards = mainQueryResult.map(function (result) {
              var res = result[0];
              var card = {
                uid: res.uid,
                isNew: isNew(res),
                decks: getDecks(res),
                algorithm: getAlgorithm(res),
                string: res.string,
                history: getHistory(res)
              };
              return card;
            }); // Query for today's review

            todayUid = roamsr.getRoamDate().uid;
            todayQuery = "[\n    :find (pull ?card \n      [:block/uid \n      {:block/refs [:node/title]} \n      {:block/_refs [{:block/page [:block/uid]}]}]) \n      (pull ?review [:block/refs])\n    :where \n      [?reviewParent :block/children ?review] \n      [?reviewParent :block/page ?todayPage] \n      [?todayPage :block/uid \"".concat(todayUid, "\"] \n      [?reviewParent :block/refs ?reviewPage] \n      [?reviewPage :node/title \"roam/sr/review\"] \n      [?review :block/refs ?card] \n      [?card :block/refs ?srPage] \n      [?srPage :node/title \"").concat(roamsr.settings.mainTag, "\"]\n    ]");
            _context.next = 14;
            return window.roamAlphaAPI.q(todayQuery);

          case 14:
            todayQueryResult = _context.sent;
            todayReviewedCards = todayQueryResult.filter(function (result) {
              return result[1].refs.length == 2;
            }).map(function (result) {
              var card = {
                uid: result[0].uid,
                isNew: isNew(result[0]),
                decks: getDecks(result[0])
              };
              return card;
            }); // Filter only cards that are due

            cards = cards.filter(function (card) {
              return card.history.length > 0 ? card.history.some(function (review) {
                return !review.signal && new Date(review.date) <= dateBasis;
              }) : true;
            }); // Filter out cards over limit

            roamsr.state.extraCards = [[], []];

            if (roamsr.state.limits) {
              _iterator = _createForOfIteratorHelper(roamsr.settings.customDecks.concat(roamsr.settings.defaultDeck));

              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  deck = _step.value;
                  todayReviews = todayReviewedCards.reduce(function (a, card) {
                    if (deck.tag ? card.decks.includes(deck.tag) : card.decks.length == 0) {
                      if (!a[2].includes(card.uid)) {
                        a[2].push(card.uid);
                        a[card.isNew ? 0 : 1]++;
                      }
                    }

                    return a;
                  }, [0, 0, []]);
                  cards.reduceRight(function (a, card, i) {
                    if (deck.tag ? card.decks.includes(deck.tag) : card.decks.length == 0) {
                      var j = card.isNew ? 0 : 1;
                      var limits = [deck.newCardLimit || 0, deck.reviewLimit || 0];

                      if (a[j]++ >= limits[j] - todayReviews[j]) {
                        roamsr.state.extraCards[j].push(cards.splice(i, 1));
                      }
                    }

                    return a;
                  }, [0, 0]);
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
            } // Sort (new to front)


            cards = cards.sort(function (a, b) {
              return a.history.length - b.history.length;
            });
            return _context.abrupt("return", cards);

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();
/* ====== STYLES ====== */


roamsr.addBasicStyles = function () {
  var style = "\n  .roamsr-widget__review-button {\n    color: #5C7080 !important;\n  }\n  \n  .roamsr-widget__review-button:hover {\n    color: #F5F8FA !important;\n  }\n  \n  .roamsr-return-button-container {\n    z-index: 100000;\n    margin: 5px 0px 5px 45px;\n  }\n\n  .roamsr-wrapper {\n    pointer-events: none;\n    position: relative;\n    bottom: 180px;\n    justify-content: center;\n  }\n\n  .roamsr-container {\n    width: 100%;\n    max-width: 600px;\n    justify-content: center;\n    align-items: center;\n    padding: 5px 20px;\n  }\n\n  .roamsr-button {\n    z-index: 10000;\n    pointer-events: all;\n  }\n\n  .roamsr-response-area {\n    flex-wrap: wrap;\n    justify-content: center;\n    margin-bottom: 15px;\n  }\n\n  .roamsr-flag-button-container {\n    width: 100%;\n  }\n  ";
  var basicStyles = Object.assign(document.createElement("style"), {
    id: "roamsr-css-basic",
    innerHTML: style
  });
  document.getElementsByTagName("head")[0].appendChild(basicStyles);
};

roamsr.setCustomStyle = function (yes) {
  var styleId = "roamsr-css-custom";
  var element = document.getElementById(styleId);
  if (element) element.remove();

  if (yes) {
    // Query new style
    var styleQuery = window.roamAlphaAPI.q("[:find (pull ?style [:block/string]) :where [?roamsr :node/title \"roam/sr\"] [?roamsr :block/children ?css] [?css :block/refs ?roamcss] [?roamcss :node/title \"roam/css\"] [?css :block/children ?style]]");

    if (styleQuery && styleQuery.length != 0) {
      var customStyle = styleQuery[0][0].string.replace("`" + "``css", "").replace("`" + "``", "");
      var roamsrCSS = Object.assign(document.createElement("style"), {
        id: styleId,
        innerHTML: customStyle
      });
      document.getElementsByTagName("head")[0].appendChild(roamsrCSS);
    }
  }
};

roamsr.showAnswerAndCloze = function (yes) {
  var styleId = "roamsr-css-mainview";
  var element = document.getElementById(styleId);
  if (element) element.remove();

  if (yes) {
    var clozeStyle = roamsr.settings.clozeStyle || "highlight";
    var style = "\n    .roam-article .rm-reference-main,\n    .roam-article .rm-block-children\n    {\n      visibility: hidden;  \n    }\n\n    .roam-article .rm-".concat(clozeStyle, " {\n      background-color: #cccccc;\n      color: #cccccc;\n    }");
    var basicStyles = Object.assign(document.createElement("style"), {
      id: styleId,
      innerHTML: style
    });
    document.getElementsByTagName("head")[0].appendChild(basicStyles);
  }
};
/* ====== MAIN FUNCTIONS ====== */


roamsr.scheduleCardIn = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(card, interval) {
    var nextDate, nextRoamDate, queryReviewBlock, topLevelUid, block;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            nextDate = new Date();
            nextDate.setDate(nextDate.getDate() + interval);
            nextRoamDate = roamsr.getRoamDate(nextDate); // Create daily note if it doesn't exist yet

            _context2.next = 5;
            return window.roamAlphaAPI.createPage({
              page: {
                title: nextRoamDate.title
              }
            });

          case 5:
            _context2.next = 7;
            return roamsr.sleep();

          case 7:
            // Query for the [[roam/sr/review]] block
            queryReviewBlock = window.roamAlphaAPI.q('[:find (pull ?reviewBlock [:block/uid]) :in $ ?dailyNoteUID :where [?reviewBlock :block/refs ?reviewPage] [?reviewPage :node/title "roam/sr/review"] [?dailyNote :block/children ?reviewBlock] [?dailyNote :block/uid ?dailyNoteUID]]', nextRoamDate.uid); // Check if it's there; if not, create it

            if (!(queryReviewBlock.length == 0)) {
              _context2.next = 16;
              break;
            }

            topLevelUid = roamsr.createUid();
            _context2.next = 12;
            return window.roamAlphaAPI.createBlock({
              location: {
                "parent-uid": nextRoamDate.uid,
                order: 0
              },
              block: {
                string: "[[roam/sr/review]]",
                uid: topLevelUid
              }
            });

          case 12:
            _context2.next = 14;
            return roamsr.sleep();

          case 14:
            _context2.next = 17;
            break;

          case 16:
            topLevelUid = queryReviewBlock[0][0].uid;

          case 17:
            // Generate the block
            block = {
              uid: roamsr.createUid(),
              string: "((" + card.uid + "))"
            }; // Finally, schedule the card

            _context2.next = 20;
            return window.roamAlphaAPI.createBlock({
              location: {
                "parent-uid": topLevelUid,
                order: 0
              },
              block: block
            });

          case 20:
            _context2.next = 22;
            return roamsr.sleep();

          case 22:
            return _context2.abrupt("return", {
              date: nextRoamDate.uid,
              signal: null,
              uid: block.uid,
              string: block.string
            });

          case 23:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

roamsr.responseHandler = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(card, interval, signal) {
    var hist, last, todayReviewBlock, nextReview, newCard;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log("Signal: " + signal + ", Interval: " + interval);
            hist = card.history; // If new card, make it look like it was scheduled for today

            if (!(hist.length == 0 || hist[hist.length - 1] && hist[hist.length - 1].date !== new Date())) {
              _context3.next = 11;
              break;
            }

            last = hist.pop();

            if (!last) {
              _context3.next = 7;
              break;
            }

            _context3.next = 7;
            return window.roamAlphaAPI.deleteBlock({
              block: {
                uid: last.uid
              }
            });

          case 7:
            _context3.next = 9;
            return roamsr.scheduleCardIn(card, 0);

          case 9:
            todayReviewBlock = _context3.sent;
            hist.push(todayReviewBlock);

          case 11:
            // Record response
            last = hist.pop();
            last.string = last.string + " #[[r/" + signal + "]]";
            last.signal = signal;
            _context3.next = 16;
            return window.roamAlphaAPI.updateBlock({
              block: {
                uid: last.uid,
                string: last.string
              }
            });

          case 16:
            hist.push(last); // Schedule card to future

            _context3.next = 19;
            return roamsr.scheduleCardIn(card, interval);

          case 19:
            nextReview = _context3.sent;
            hist.push(nextReview); // If it's scheduled for today, add it to the end of the queue

            if (interval == 0) {
              newCard = card;
              newCard.history = hist;
              newCard.isNew = false;
              roamsr.state.queue.push(newCard);
            }

          case 22:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x4, _x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

roamsr.flagCard = function () {
  var card = roamsr.getCurrentCard();
  window.roamAlphaAPI.updateBlock({
    block: {
      uid: card.uid,
      string: card.string + " #" + roamsr.settings.flagTag
    }
  });
  var j = roamsr.getCurrentCard().isNew ? 0 : 1;
  var extraCard = roamsr.state.extraCards[j].shift();
  if (extraCard) roamsr.state.queue.push(extraCard);
};

roamsr.stepToNext = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
  return regeneratorRuntime.wrap(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (roamsr.state.currentIndex + 1 >= roamsr.state.queue.length) {
            roamsr.endSession();
          } else {
            roamsr.state.currentIndex++;
            roamsr.goToCurrentCard();
          }

          roamsr.updateCounters();

        case 2:
        case "end":
          return _context4.stop();
      }
    }
  }, _callee4);
}));
roamsr.goToCurrentCard = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
  var doStuff;
  return regeneratorRuntime.wrap(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          window.onhashchange = function () {};

          roamsr.showAnswerAndCloze(true);
          roamsr.removeReturnButton();

          doStuff = /*#__PURE__*/function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
              return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      roamsr.goToUid(roamsr.getCurrentCard().uid);
                      _context5.next = 3;
                      return roamsr.sleep(50);

                    case 3:
                      roamsr.addContainer();
                      roamsr.addShowAnswerButton();

                    case 5:
                    case "end":
                      return _context5.stop();
                  }
                }
              }, _callee5);
            }));

            return function doStuff() {
              return _ref6.apply(this, arguments);
            };
          }();

          _context6.next = 6;
          return doStuff();

        case 6:
          window.onhashchange = doStuff;
          _context6.next = 9;
          return roamsr.sleep(500);

        case 9:
          _context6.next = 11;
          return doStuff();

        case 11:
          window.onhashchange = function () {
            roamsr.removeContainer();
            roamsr.addReturnButton();
            roamsr.showAnswerAndCloze(false);

            window.onhashchange = function () {};
          };

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  }, _callee6);
}));
/* ====== SESSIONS ====== */

roamsr.loadSettings = function () {
  // Default settings
  roamsr.settings = {
    mainTag: "sr",
    flagTag: "f",
    clozeStyle: "highlight",
    // "highlight" or "block-ref"
    defaultDeck: {
      algorithm: null,
      config: {},
      newCardLimit: 20,
      reviewLimit: 100
    },
    customDecks: []
  };
  roamsr.settings = Object.assign(roamsr.settings, window.roamsrUserSettings);
};

roamsr.loadState = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(i) {
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            roamsr.state = {
              limits: true,
              currentIndex: i
            };
            _context7.next = 3;
            return roamsr.loadCards();

          case 3:
            roamsr.state.queue = _context7.sent;
            return _context7.abrupt("return");

          case 5:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x7) {
    return _ref7.apply(this, arguments);
  };
}();

roamsr.getCurrentCard = function () {
  var card = roamsr.state.queue[roamsr.state.currentIndex];
  return card ? card : {};
};

roamsr.startSession = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
  var widget;
  return regeneratorRuntime.wrap(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          if (!(roamsr.state && roamsr.state.queue.length > 0)) {
            _context8.next = 15;
            break;
          }

          console.log("Starting session.");
          roamsr.setCustomStyle(true); // Hide left sidebar

          try {
            document.getElementsByClassName("bp3-icon-menu-closed")[0].click();
          } catch (e) {}

          roamsr.loadSettings();
          _context8.next = 7;
          return roamsr.loadState(0);

        case 7:
          console.log("The queue: ");
          console.log(roamsr.state.queue);
          _context8.next = 11;
          return roamsr.goToCurrentCard();

        case 11:
          roamsr.addKeyListener(); // Change widget

          widget = document.querySelector(".roamsr-widget");
          widget.innerHTML = "<div style='padding: 5px 0px'><span class='bp3-icon bp3-icon-cross'></span> END SESSION</div>";
          widget.onclick = roamsr.endSession;

        case 15:
        case "end":
          return _context8.stop();
      }
    }
  }, _callee8);
}));
roamsr.endSession = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
  var doStuff;
  return regeneratorRuntime.wrap(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          window.onhashchange = function () {};

          console.log("Ending sesion."); // Change widget

          roamsr.removeSelector(".roamsr-widget");
          roamsr.addWidget(); // Remove elements

          doStuff = /*#__PURE__*/function () {
            var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
              return regeneratorRuntime.wrap(function _callee9$(_context9) {
                while (1) {
                  switch (_context9.prev = _context9.next) {
                    case 0:
                      roamsr.removeContainer();
                      roamsr.removeReturnButton();
                      roamsr.setCustomStyle(false);
                      roamsr.showAnswerAndCloze(false);
                      roamsr.removeKeyListener();
                      roamsr.goToUid();
                      _context9.next = 8;
                      return roamsr.loadState(-1);

                    case 8:
                      roamsr.updateCounters();

                    case 9:
                    case "end":
                      return _context9.stop();
                  }
                }
              }, _callee9);
            }));

            return function doStuff() {
              return _ref10.apply(this, arguments);
            };
          }();

          _context10.next = 7;
          return doStuff();

        case 7:
          _context10.next = 9;
          return roamsr.sleep(200);

        case 9:
          _context10.next = 11;
          return doStuff();

        case 11:
          _context10.next = 13;
          return roamsr.sleep(1000);

        case 13:
          _context10.next = 15;
          return roamsr.loadState(-1);

        case 15:
          roamsr.updateCounters(); // ... once again

        case 16:
        case "end":
          return _context10.stop();
      }
    }
  }, _callee10);
}));
/* ====== UI ELEMENTS ====== */
// COMMON

roamsr.getCounter = function (deck) {
  // Getting the number of new cards
  var cardCount = [0, 0];

  if (roamsr.state.queue) {
    var remainingQueue = roamsr.state.queue.slice(Math.max(roamsr.state.currentIndex, 0));
    var filteredQueue = !deck ? remainingQueue : remainingQueue.filter(function (card) {
      return card.decks.includes(deck);
    });
    cardCount = filteredQueue.reduce(function (a, card) {
      if (card.isNew) a[0]++;else a[1]++;
      return a;
    }, [0, 0]);
  } // Create the element


  var counter = Object.assign(document.createElement("div"), {
    className: "roamsr-counter",
    innerHTML: "<span style=\"color: dodgerblue; padding-right: 8px\">" + cardCount[0] + "</span> <span style=\"color: green;\">" + cardCount[1] + "</span>"
  });
  return counter;
};

roamsr.updateCounters = function () {
  var counter = document.querySelectorAll(".roamsr-counter").forEach(function (counter) {
    counter.innerHTML = roamsr.getCounter().innerHTML;
    counter.style.cssText = !roamsr.state.limits ? "font-style: italic;" : "font-style: inherit;";
  });
}; // CONTAINER


roamsr.addContainer = function () {
  if (!document.querySelector(".roamsr-container")) {
    var wrapper = Object.assign(document.createElement("div"), {
      className: "flex-h-box roamsr-wrapper"
    });
    var container = Object.assign(document.createElement("div"), {
      className: "flex-v-box roamsr-container"
    });
    var flagButtonContainer = Object.assign(document.createElement("div"), {
      className: "flex-h-box roamsr-flag-button-container"
    });
    var flagButton = Object.assign(document.createElement("button"), {
      className: "bp3-button roamsr-button",
      innerHTML: "Flag.",
      onclick: function () {
        var _onclick = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
          return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
              switch (_context11.prev = _context11.next) {
                case 0:
                  _context11.next = 2;
                  return roamsr.flagCard();

                case 2:
                  roamsr.stepToNext();

                case 3:
                case "end":
                  return _context11.stop();
              }
            }
          }, _callee11);
        }));

        function onclick() {
          return _onclick.apply(this, arguments);
        }

        return onclick;
      }()
    });
    var skipButton = Object.assign(document.createElement("button"), {
      className: "bp3-button roamsr-button",
      innerHTML: "Skip.",
      onclick: roamsr.stepToNext
    });
    flagButtonContainer.style.cssText = "justify-content: space-between;";
    flagButtonContainer.append(flagButton, skipButton);
    var responseArea = Object.assign(document.createElement("div"), {
      className: "flex-h-box roamsr-container__response-area"
    });
    container.append(roamsr.getCounter(), responseArea, flagButtonContainer);
    wrapper.append(container);
    var bodyDiv = document.querySelector(".roam-body-main");
    bodyDiv.append(wrapper);
  }
};

roamsr.removeContainer = function () {
  roamsr.removeSelector(".roamsr-wrapper");
};

roamsr.clearAndGetResponseArea = function () {
  var responseArea = document.querySelector(".roamsr-container__response-area");
  if (responseArea) responseArea.innerHTML = "";
  return responseArea;
};

roamsr.addShowAnswerButton = function () {
  var responseArea = roamsr.clearAndGetResponseArea();
  var showAnswerAndClozeButton = Object.assign(document.createElement("button"), {
    className: "bp3-button roamsr-container__response-area__show-answer-button roamsr-button",
    innerHTML: "Show answer.",
    onclick: function onclick() {
      roamsr.showAnswerAndCloze(false);
      roamsr.addResponseButtons();
    }
  });
  showAnswerAndClozeButton.style.cssText = "margin: 5px;";
  responseArea.append(showAnswerAndClozeButton);
};

roamsr.addResponseButtons = function () {
  var responseArea = roamsr.clearAndGetResponseArea(); // Add new responses

  var responses = roamsr.getCurrentCard().algorithm(roamsr.getCurrentCard().history);

  var _iterator2 = _createForOfIteratorHelper(responses),
      _step2;

  try {
    var _loop = function _loop() {
      response = _step2.value;
      var res = response;
      responseButton = Object.assign(document.createElement("button"), {
        id: "roamsr-response-" + res.signal,
        className: "bp3-button roamsr-container__response-area__response-button roamsr-button",
        innerHTML: res.responseText + "<sup>" + roamsr.getIntervalHumanReadable(res.interval) + "</sup>",
        onclick: function () {
          var _onclick2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
            return regeneratorRuntime.wrap(function _callee12$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    if (!(res.interval != 0)) {
                      _context12.next = 4;
                      break;
                    }

                    roamsr.responseHandler(roamsr.getCurrentCard(), res.interval, res.signal.toString());
                    _context12.next = 6;
                    break;

                  case 4:
                    _context12.next = 6;
                    return roamsr.responseHandler(roamsr.getCurrentCard(), res.interval, res.signal.toString());

                  case 6:
                    roamsr.stepToNext();

                  case 7:
                  case "end":
                    return _context12.stop();
                }
              }
            }, _callee12);
          }));

          function onclick() {
            return _onclick2.apply(this, arguments);
          }

          return onclick;
        }()
      });
      responseButton.style.cssText = "margin: 5px;";
      responseArea.append(responseButton);
    };

    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var responseButton;

      _loop();
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}; // RETURN BUTTON


roamsr.addReturnButton = function () {
  var returnButtonClass = "roamsr-return-button-container";
  if (document.querySelector(returnButtonClass)) return;
  var main = document.querySelector(".roam-main");
  var body = document.querySelector(".roam-body-main");
  var returnButtonContainer = Object.assign(document.createElement("div"), {
    className: "flex-h-box " + returnButtonClass
  });
  var returnButton = Object.assign(document.createElement("button"), {
    className: "bp3-button bp3-large roamsr-return-button",
    innerText: "Return.",
    onclick: roamsr.goToCurrentCard
  });
  returnButtonContainer.append(returnButton);
  main.insertBefore(returnButtonContainer, body);
};

roamsr.removeReturnButton = function () {
  roamsr.removeSelector(".roamsr-return-button-container");
}; // SIDEBAR WIDGET


roamsr.createWidget = function () {
  var widget = Object.assign(document.createElement("div"), {
    className: "log-button flex-h-box roamsr-widget"
  });
  widget.style.cssText = "align-items: center; justify-content: space-around; padding-top: 8px;";
  var reviewButton = Object.assign(document.createElement("div"), {
    className: "bp3-button bp3-minimal roamsr-widget__review-button",
    innerHTML: "<span style=\"padding-right: 8px;\"><svg width=\"16\" height=\"16\" version=\"1.1\" viewBox=\"0 0 4.2333 4.2333\" style=\"color:5c7080;\">\n  <g id=\"chat_1_\" transform=\"matrix(.26458 0 0 .26458 115.06 79.526)\">\n    <g transform=\"matrix(-.79341 0 0 -.88644 -420.51 -284.7)\" fill=\"currentColor\">\n      <path d=\"m6 13.665c-1.1 0-2-1.2299-2-2.7331v-6.8327h-3c-0.55 0-1 0.61495-1 1.3665v10.932c0 0.7516 0.45 1.3665 1 1.3665h9c0.55 0 1-0.61495 1-1.3665l-5.04e-4 -1.5989v-1.1342h-0.8295zm9-13.665h-9c-0.55 0-1 0.61495-1 1.3665v9.5658c0 0.7516 0.45 1.3665 1 1.3665h9c0.55 0 1-0.61495 1-1.3665v-9.5658c0-0.7516-0.45-1.3665-1-1.3665z\"\n        clip-rule=\"evenodd\" fill=\"currentColor\" fill-rule=\"evenodd\" />\n    </g>\n  </g></svg></span> REVIEW",
    //  <span class="bp3-icon bp3-icon-chevron-down expand-icon"></span>`
    onclick: roamsr.startSession
  });
  reviewButton.style.cssText = "padding: 2px 8px;";
  var counter = Object.assign(roamsr.getCounter(), {
    className: "bp3-button bp3-minimal roamsr-counter",
    onclick: function () {
      var _onclick3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                roamsr.state.limits = !roamsr.state.limits;
                _context13.next = 3;
                return roamsr.loadCards();

              case 3:
                roamsr.state.queue = _context13.sent;
                roamsr.updateCounters();

              case 5:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13);
      }));

      function onclick() {
        return _onclick3.apply(this, arguments);
      }

      return onclick;
    }()
  });
  var counterContainer = Object.assign(document.createElement("div"), {
    className: "flex-h-box roamsr-widget__counter"
  });
  counterContainer.style.cssText = "justify-content: center; width: 50%";
  counterContainer.append(counter);
  widget.append(reviewButton, counterContainer);
  return widget;
};

roamsr.addWidget = function () {
  if (!document.querySelector(".roamsr-widget")) {
    roamsr.removeSelector(".roamsr-widget-delimiter");
    var delimiter = Object.assign(document.createElement("div"), {
      className: "roamsr-widget-delimiter"
    });
    delimiter.style.cssText = "flex: 0 0 1px; background-color: rgb(57, 75, 89); margin: 8px 20px;";
    var widget = roamsr.createWidget();
    var sidebar = document.querySelector(".roam-sidebar-content");
    var starredPages = document.querySelector(".starred-pages-wrapper");
    sidebar.insertBefore(delimiter, starredPages);
    sidebar.insertBefore(widget, starredPages);
  }
};
/* ====== KEYBINDINGS ====== */


roamsr.processKey = function (e) {
  // console.log("alt: " + e.altKey + "  shift: " + e.shiftKey + "  ctrl: " + e.ctrlKey + "   code: " + e.code + "   key: " + e.key);
  if (document.activeElement.type == "textarea" || !location.href.includes(roamsr.getCurrentCard().uid)) {
    return;
  }

  var responses = roamsr.getCurrentCard().algorithm(roamsr.getCurrentCard().history);

  var handleNthResponse = /*#__PURE__*/function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(n) {
      var res;
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              console.log("Handling response: " + n);

              if (!(n >= 0 && n < responses.length)) {
                _context14.next = 10;
                break;
              }

              res = responses[n];

              if (!(res.interval != 0)) {
                _context14.next = 7;
                break;
              }

              roamsr.responseHandler(roamsr.getCurrentCard(), res.interval, res.signal.toString());
              _context14.next = 9;
              break;

            case 7:
              _context14.next = 9;
              return roamsr.responseHandler(roamsr.getCurrentCard(), res.interval, res.signal.toString());

            case 9:
              roamsr.stepToNext();

            case 10:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    }));

    return function handleNthResponse(_x8) {
      return _ref11.apply(this, arguments);
    };
  }(); // Bindings for 123456789


  if (e.code.includes("Digit")) {
    var n = Math.min(parseInt(e.code.replace("Digit", "")) - 1, responses.length - 1);
    handleNthResponse(n);
    return;
  } // Bindings for hjkl


  var letters = ["KeyH", "KeyJ", "KeyK", "KeyL"];

  if (letters.includes(e.code)) {
    var n = Math.min(letters.indexOf(e.code), responses.length - 1);
    handleNthResponse(n);
    return;
  }

  if (e.code == "Space") {
    roamsr.showAnswerAndCloze(false);
    roamsr.addResponseButtons();
    return;
  }

  if (e.code == "KeyF") {
    roamsr.flagCard().then(function () {
      roamsr.stepToNext();
    });
    return;
  }

  if (e.code == "KeyS") {
    roamsr.stepToNext();
    return;
  }

  if (e.code == "KeyD" && e.altKey) {
    roamsr.endSession();
    return;
  }
};

roamsr.processKeyAlways = function (e) {// Alt+enter TODO
};

roamsr.addKeyListener = function () {
  document.addEventListener("keydown", roamsr.processKey);
};

roamsr.removeKeyListener = function () {
  document.removeEventListener("keydown", roamsr.processKey);
};
/* ====== {{sr}} BUTTON ====== */


roamsr.buttonClickHandler = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(e) {
    var block, uid, q, results, children, _iterator3, _step3;

    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            if (!(e.target.tagName === "BUTTON" && e.target.textContent === roamsr.settings.mainTag)) {
              _context15.next = 13;
              break;
            }

            block = e.target.closest(".roam-block");

            if (!block) {
              _context15.next = 13;
              break;
            }

            uid = block.id.substring(block.id.length - 9);
            q = "[:find (pull ?page\n                    [{:block/children [:block/uid :block/string]}])\n                :in $ ?uid\n                :where [?page :block/uid ?uid]]";
            _context15.next = 7;
            return window.roamAlphaAPI.q(q, uid);

          case 7:
            results = _context15.sent;

            if (!(results.length == 0)) {
              _context15.next = 10;
              break;
            }

            return _context15.abrupt("return");

          case 10:
            children = results[0][0].children;
            _iterator3 = _createForOfIteratorHelper(children);

            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                child = _step3.value;
                window.roamAlphaAPI.updateBlock({
                  block: {
                    uid: child.uid,
                    string: child.string.trim() + " #" + roamsr.settings.mainTag
                  }
                });
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }

          case 13:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));

  return function (_x9) {
    return _ref12.apply(this, arguments);
  };
}();

document.addEventListener("click", roamsr.buttonClickHandler, false);
/* ====== CALLING FUNCTIONS DIRECTLY ====== */

console.log("🗃️ Loading roam/sr " + VERSION + ".");
roamsr.loadSettings();
roamsr.addBasicStyles();
roamsr.loadState(-1).then(function (res) {
  roamsr.addWidget();
});
console.log("🗃️ Successfully loaded roam/sr " + VERSION + ".");
},{"./ankiScheduler":"w1y6"}]},{},["PwIx"], null)