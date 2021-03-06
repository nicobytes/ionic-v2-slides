"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _angular2Angular2 = require('angular2/angular2');

var _contentContent = require('../content/content');

var _ionicUtil = require('ionic/util');

var util = _interopRequireWildcard(_ionicUtil);

var _ionicUtilDom = require('ionic/util/dom');

/**
 * Allows you to add pull-to-refresh to an Content component.
 *
 * Place it as the first child of your Content or Scroll element.
 *
 * When refreshing is complete, call `refresher.complete()` from your controller.
 *
 *  @usage
 *  ```ts
 *  <ion-refresher (starting)="doStarting()" (refresh)="doRefresh($event, refresher)" (pulling)="doPulling($event, amt)">
 *
 *
 *  doRefresh(refresher) {
 *    console.log('Refreshing!', refresher);
 *
 *    setTimeout(() => {
 *      console.log('Pull to refresh complete!', refresher);
 *      refresher.complete();
 *    })
 *  }
 *
 *  doStarting() {
 *    console.log('Pull started!');
 *  }
 *
 *  doPulling(amt) {
 *    console.log('You have pulled', amt);
 *  }
 *  ```
 */
var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2:
            return decorators.reduceRight(function (o, d) {
                return d && d(o) || o;
            }, target);
        case 3:
            return decorators.reduceRight(function (o, d) {
                return d && d(target, key), void 0;
            }, void 0);
        case 4:
            return decorators.reduceRight(function (o, d) {
                return d && d(target, key, o) || o;
            }, desc);
    }
};
var __metadata = undefined && undefined.__metadata || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = undefined && undefined.__param || function (paramIndex, decorator) {
    return function (target, key) {
        decorator(target, key, paramIndex);
    };
};
var Refresher = (function () {
    /**
     * TODO
     * @param {Content} content  TODO
     * @param {ElementRef} elementRef  TODO
     */

    function Refresher(content, element) {
        _classCallCheck(this, Refresher);

        this.ele = element.nativeElement;
        this.ele.classList.add('content');
        this.content = content;
        this.refresh = new _angular2Angular2.EventEmitter('refresh');
        this.starting = new _angular2Angular2.EventEmitter('starting');
        this.pulling = new _angular2Angular2.EventEmitter('pulling');
    }

    _createClass(Refresher, [{
        key: "onInit",
        value: function onInit() {
            this.initEvents();
        }

        /**
         * Initialize touch and scroll event listeners.
         */
    }, {
        key: "initEvents",
        value: function initEvents() {
            var sp = this.content.getNativeElement();
            var sc = this.content.scrollElement;
            this.isDragging = false;
            this.isOverscrolling = false;
            this.dragOffset = 0;
            this.lastOverscroll = 0;
            this.ptrThreshold = 60;
            this.activated = false;
            this.scrollTime = 500;
            this.startY = null;
            this.deltaY = null;
            this.canOverscroll = true;
            this.scrollHost = sp;
            this.scrollChild = sc;
            util.defaults(this, {
                pullingIcon: 'ion-android-arrow-down',
                refreshingIcon: 'ion-ionic'
            });
            this.showSpinner = !util.isDefined(this.refreshingIcon) && this.spinner != 'none';
            this.showIcon = util.isDefined(this.refreshingIcon);
            this._touchMoveListener = this._handleTouchMov.bind(this);
            this._touchEndListener = this._handleTouchEnd.bind(this);
            this._handleScrollListener = this._handleScroll.bind(this);
            sc.addEventListener('touchmove', this._touchMoveListener);
            sc.addEventListener('touchend', this._touchEndListener);
            sc.addEventListener('scroll', this._handleScrollListener);
        }
    }, {
        key: "onDehydrate",
        value: function onDehydrate() {
            console.log('DEHYDRATION');
            var sc = this.content.scrollElement;
            sc.removeEventListener('touchmove', this._touchMoveListener);
            sc.removeEventListener('touchend', this._touchEndListener);
            sc.removeEventListener('scroll', this._handleScrollListener);
        }

        /**
         * TODO
         * @param {TODO} val  TODO
         */
    }, {
        key: "overscroll",
        value: function overscroll(val) {
            this.scrollChild.style[_ionicUtilDom.CSS.transform] = 'translateY(' + val + 'px)';
            this.lastOverscroll = val;
        }

        /**
         * TODO
         * @param {TODO} target  TODO
         * @param {TODO} newScrollTop  TODO
         */
    }, {
        key: "nativescroll",
        value: function nativescroll(target, newScrollTop) {
            // creates a scroll event that bubbles, can be cancelled, and with its view
            // and detail property initialized to window and 1, respectively
            target.scrollTop = newScrollTop;
            var e = document.createEvent("UIEvents");
            e.initUIEvent("scroll", true, true, window, 1);
            target.dispatchEvent(e);
        }

        /**
         * TODO
         * @param {TODO} enabled  TODO
         */
    }, {
        key: "setScrollLock",
        value: function setScrollLock(enabled) {
            var _this = this;

            // set the scrollbar to be position:fixed in preparation to overscroll
            // or remove it so the app can be natively scrolled
            if (enabled) {
                (0, _ionicUtilDom.raf)(function () {
                    _this.scrollChild.classList.add('overscroll');
                    _this.show();
                });
            } else {
                (0, _ionicUtilDom.raf)(function () {
                    _this.scrollChild.classList.remove('overscroll');
                    _this.hide();
                    _this.deactivate();
                });
            }
        }

        /**
         * TODO
         */
    }, {
        key: "activate",
        value: function activate() {
            //this.ele.classList.add('active');
            this.isActive = true;
            //this.starting.next();
        }

        /**
         * TODO
         */
    }, {
        key: "deactivate",
        value: function deactivate() {
            var _this2 = this;

            // give tail 150ms to finish
            setTimeout(function () {
                _this2.isActive = false;
                _this2.isRefreshing = false;
                _this2.isRefreshingTail = false;
                // deactivateCallback
                if (_this2.activated) _this2.activated = false;
            }, 150);
        }
    }, {
        key: "start",
        value: function start() {
            // startCallback
            this.isRefreshing = true;
            this.refresh.next(this);
            //$scope.$onRefresh();
        }

        /**
         * TODO
         */
    }, {
        key: "show",
        value: function show() {
            // showCallback
            this.ele.classList.remove('invisible');
        }

        /**
         * TODO
         */
    }, {
        key: "hide",
        value: function hide() {
            // showCallback
            this.ele.classList.add('invisible');
        }

        /**
         * TODO
         */
    }, {
        key: "tail",
        value: function tail() {
            // tailCallback
            this.ele.classList.add('refreshing-tail');
        }

        /**
         * TODO
         */
    }, {
        key: "complete",
        value: function complete() {
            var _this3 = this;

            setTimeout(function () {
                (0, _ionicUtilDom.raf)(_this3.tail.bind(_this3));
                // scroll back to home during tail animation
                _this3.scrollTo(0, _this3.scrollTime, _this3.deactivate.bind(_this3));
                // return to native scrolling after tail animation has time to finish
                setTimeout(function () {
                    if (_this3.isOverscrolling) {
                        _this3.isOverscrolling = false;
                        _this3.setScrollLock(false);
                    }
                }, _this3.scrollTime);
            }, this.scrollTime);
        }

        /**
         * TODO
         * @param {TODO} Y  TODO
         * @param {TODO} duration  TODO
         * @param {Function} callback  TODO
         */
    }, {
        key: "scrollTo",
        value: function scrollTo(Y, duration, callback) {
            // scroll animation loop w/ easing
            // credit https://gist.github.com/dezinezync/5487119
            var start = Date.now(),
                from = this.lastOverscroll;
            if (from === Y) {
                callback();
                return; /* Prevent scrolling to the Y point if already there */
            }
            // decelerating to zero velocity
            function easeOutCubic(t) {
                return --t * t * t + 1;
            }
            // scroll loop
            function scroll() {
                var currentTime = Date.now(),
                    time = Math.min(1, (currentTime - start) / duration),

                // where .5 would be 50% of time on a linear scale easedT gives a
                // fraction based on the easing method
                easedT = easeOutCubic(time);
                this.overscroll(parseInt(easedT * (Y - from) + from, 10));
                if (time < 1) {
                    (0, _ionicUtilDom.raf)(scroll.bind(this));
                } else {
                    if (Y < 5 && Y > -5) {
                        this.isOverscrolling = false;
                        this.setScrollLock(false);
                    }
                    callback && callback();
                }
            }
            // start scroll loop
            (0, _ionicUtilDom.raf)(scroll.bind(this));
        }

        /**
         * @private
         * TODO
         * @param {Event} e  TODO
         */
    }, {
        key: "_handleTouchMove",
        value: function _handleTouchMove(e) {
            //console.log('TOUCHMOVE', e);
            // if multitouch or regular scroll event, get out immediately
            if (!this.canOverscroll || e.touches.length > 1) {
                return;
            }
            //if this is a new drag, keep track of where we start
            if (this.startY === null) {
                this.startY = parseInt(e.touches[0].screenY, 10);
            }
            // how far have we dragged so far?
            this.deltaY = parseInt(e.touches[0].screenY, 10) - this.startY;
            // if we've dragged up and back down in to native scroll territory
            if (this.deltaY - this.dragOffset <= 0 || this.scrollHost.scrollTop !== 0) {
                if (this.isOverscrolling) {
                    this.isOverscrolling = false;
                    this.setScrollLock(false);
                }
                if (this.isDragging) {
                    this.nativescroll(this.scrollHost, parseInt(this.deltaY - this.dragOffset, 10) * -1);
                }
                // if we're not at overscroll 0 yet, 0 out
                if (this.lastOverscroll !== 0) {
                    this.overscroll(0);
                }
                return;
            } else if (this.deltaY > 0 && this.scrollHost.scrollTop === 0 && !this.isOverscrolling) {
                // starting overscroll, but drag started below scrollTop 0, so we need to offset the position
                this.dragOffset = this.deltaY;
            }
            // prevent native scroll events while overscrolling
            e.preventDefault();
            // if not overscrolling yet, initiate overscrolling
            if (!this.isOverscrolling) {
                this.isOverscrolling = true;
                this.setScrollLock(true);
            }
            this.isDragging = true;
            // overscroll according to the user's drag so far
            this.overscroll(parseInt((this.deltaY - this.dragOffset) / 3, 10));
            // Pass an incremental pull amount to the EventEmitter
            this.pulling.next(this.lastOverscroll);
            // update the icon accordingly
            if (!this.activated && this.lastOverscroll > this.ptrThreshold) {
                this.activated = true;
                (0, _ionicUtilDom.raf)(this.activate.bind(this));
            } else if (this.activated && this.lastOverscroll < this.ptrThreshold) {
                this.activated = false;
                (0, _ionicUtilDom.raf)(this.deactivate.bind(this));
            }
        }

        /**
         * @private
         * TODO
         * @param {Event} e  TODO
         */
    }, {
        key: "_handleTouchEnd",
        value: function _handleTouchEnd(e) {
            console.log('TOUCHEND', e);
            // if this wasn't an overscroll, get out immediately
            if (!this.canOverscroll && !this.isDragging) {
                return;
            }
            // reset Y
            this.startY = null;
            // the user has overscrolled but went back to native scrolling
            if (!this.isDragging) {
                this.dragOffset = 0;
                this.isOverscrolling = false;
                this.setScrollLock(false);
            } else {
                this.isDragging = false;
                this.dragOffset = 0;
                // the user has scroll far enough to trigger a refresh
                if (this.lastOverscroll > this.ptrThreshold) {
                    this.start();
                    this.scrollTo(this.ptrThreshold, this.scrollTime);
                } else {
                    this.scrollTo(0, this.scrollTime, this.deactivate.bind(this));
                    this.isOverscrolling = false;
                }
            }
        }

        /**
         * @private
         * TODO
         * @param {Event} e  TODO
         */
    }, {
        key: "_handleScroll",
        value: function _handleScroll(e) {
            console.log('SCROLL', e.target.scrollTop);
        }
    }]);

    return Refresher;
})();
exports.Refresher = Refresher;
exports.Refresher = Refresher = __decorate([(0, _angular2Angular2.Component)({
    selector: 'ion-refresher',
    inputs: ['pullingIcon', 'pullingText', 'refreshingIcon', 'refreshingText', 'spinner', 'disablePullingRotation'],
    outputs: ['refresh', 'starting', 'pulling'],
    host: {
        '[class.active]': 'isActive',
        '[class.refreshing]': 'isRefreshing',
        '[class.refreshingTail]': 'isRefreshingTail'
    },
    template: '<div class="refresher-content" [class.refresher-with-text]="pullingText || refreshingText">' + '<div class="icon-pulling">' + '<i class="icon" [ng-class]="pullingIcon"></i>' + '</div>' + '<div class="text-pulling" [inner-html]="pullingText" *ng-if="pullingText"></div>' + '<div class="icon-refreshing">' + '<i class="icon" [ng-class]="refreshingIcon"></i>' + '</div>' + '<div class="text-refreshing" [inner-html]="refreshingText" *ng-if="refreshingText"></div>' + '</div>',
    directives: [_angular2Angular2.NgIf, _angular2Angular2.NgClass]
}), __param(0, (0, _angular2Angular2.Host)()), __metadata('design:paramtypes', [typeof (_a = typeof _contentContent.Content !== 'undefined' && _contentContent.Content) === 'function' && _a || Object, typeof (_b = typeof _angular2Angular2.ElementRef !== 'undefined' && _angular2Angular2.ElementRef) === 'function' && _b || Object])], Refresher);
var _a, _b;