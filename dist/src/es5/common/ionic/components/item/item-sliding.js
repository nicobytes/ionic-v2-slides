"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _angular2Angular2 = require('angular2/angular2');

var _ionicGesturesDragGesture = require('ionic/gestures/drag-gesture');

var _ionicGesturesHammer = require('ionic/gestures/hammer');

var _ionicComponentsListList = require('ionic/components/list/list');

var _ionicUtilDom = require('ionic/util/dom');

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
var ItemSlidingOptionButton = (function () {
    function ItemSlidingOptionButton(elementRef) {
        _classCallCheck(this, ItemSlidingOptionButton);
    }

    _createClass(ItemSlidingOptionButton, [{
        key: "clicked",
        value: function clicked(event) {
            // Don't allow the click to propagate
            event.preventDefault();
            event.stopPropagation();
        }
    }]);

    return ItemSlidingOptionButton;
})();
exports.ItemSlidingOptionButton = ItemSlidingOptionButton;
exports.ItemSlidingOptionButton = ItemSlidingOptionButton = __decorate([(0, _angular2Angular2.Directive)({
    selector: 'ion-item-options > button,ion-item-options > [button]',
    host: {
        '(click)': 'clicked($event)'
    }
}), __metadata('design:paramtypes', [typeof (_a = typeof _angular2Angular2.ElementRef !== 'undefined' && _angular2Angular2.ElementRef) === 'function' && _a || Object])], ItemSlidingOptionButton);
/**
 * @name ionItem
 * @description
 * Creates a list-item that can easily be swiped,
 * deleted, reordered, edited, and more.
 *
 * @usage
 * ```html
 * <ion-list>
 *   <ion-item-sliding *ng-for="#item of items" (click)="itemTapped($event, item)">
 *     {{item.title}}
 *     <div class="item-note" item-right>
 *       {{item.note}}
 *     </div>
 *   </ion-item>
 * </ion-list>
 *  ```
 */
var ItemSliding = (function () {
    /**
     * TODO
     * @param {ElementRef} elementRef  A reference to the component's DOM element.
     */

    function ItemSliding(elementRef, renderer, list, zone) {
        _classCallCheck(this, ItemSliding);

        this._zone = zone;
        renderer.setElementClass(elementRef, 'item', true);
        renderer.setElementAttribute(elementRef, 'tappable', '');
        this._isOpen = false;
        this._isSlideActive = false;
        this._isTransitioning = false;
        this._transform = '';
        this.list = list;
        this.elementRef = elementRef;
        this.swipeButtons = {};
        this.optionButtons = {};
    }

    _createClass(ItemSliding, [{
        key: "onInit",
        value: function onInit() {
            var _this = this;

            var ele = this.elementRef.nativeElement;
            this.itemSlidingContent = ele.querySelector('ion-item-sliding-content');
            this.itemOptions = ele.querySelector('ion-item-options');
            this.openAmount = 0;
            this._zone.runOutsideAngular(function () {
                _this.gesture = new ItemSlideGesture(_this, _this.itemSlidingContent, _this._zone);
            });
        }
    }, {
        key: "onDestroy",
        value: function onDestroy() {
            this.gesture && this.gesture.unlisten();
            this.itemSlidingContent = this.itemOptionsContent = null;
        }
    }, {
        key: "close",
        value: function close(andStopDrag) {
            var _this2 = this;

            this.openAmount = 0;
            // Enable it once, it'll get disabled on the next drag
            (0, _ionicUtilDom.raf)(function () {
                _this2.enableAnimation();
                if (_this2.itemSlidingContent) {
                    _this2.itemSlidingContent.style[_ionicUtilDom.CSS.transform] = 'translateX(0)';
                }
            });
        }
    }, {
        key: "open",
        value: function open(amt) {
            var el = this.itemSlidingContent;
            this.openAmount = amt || 0;
            if (this.list) {
                this.list.setOpenItem(this);
            }
            if (amt === '') {
                el.style[_ionicUtilDom.CSS.transform] = '';
            } else {
                el.style[_ionicUtilDom.CSS.transform] = 'translateX(' + -amt + 'px)';
            }
        }
    }, {
        key: "isOpen",
        value: function isOpen() {
            return this.openAmount > 0;
        }
    }, {
        key: "getOpenAmt",
        value: function getOpenAmt() {
            return this.openAmount;
        }
    }, {
        key: "disableAnimation",
        value: function disableAnimation() {
            this.itemSlidingContent.style[_ionicUtilDom.CSS.transition] = 'none';
        }
    }, {
        key: "enableAnimation",
        value: function enableAnimation() {
            // Clear the explicit transition, allow for CSS one to take over
            this.itemSlidingContent.style[_ionicUtilDom.CSS.transition] = '';
        }

        /**
         * User did a touchstart
         */
    }, {
        key: "didTouch",
        value: function didTouch() {
            if (this.isOpen()) {
                this.close();
                this.didClose = true;
            } else {
                var openItem = this.list.getOpenItem();
                if (openItem && openItem !== this) {
                    this.didClose = true;
                }
                if (this.list) {
                    this.list.closeOpenItem();
                }
            }
        }
    }]);

    return ItemSliding;
})();
exports.ItemSliding = ItemSliding;
exports.ItemSliding = ItemSliding = __decorate([(0, _angular2Angular2.Component)({
    selector: 'ion-item-sliding',
    inputs: ['sliding'],
    template: '<ng-content select="ion-item-options"></ng-content>' + '<ion-item-sliding-content>' + '<ng-content select="[item-left]"></ng-content>' + '<ng-content select="[item-right]"></ng-content>' + '<ion-item-content>' + '<ng-content></ng-content>' + '</ion-item-content>' + '</ion-item-sliding-content>'
}), __param(2, (0, _angular2Angular2.Optional)()), __param(2, (0, _angular2Angular2.Host)()), __metadata('design:paramtypes', [typeof (_b = typeof _angular2Angular2.ElementRef !== 'undefined' && _angular2Angular2.ElementRef) === 'function' && _b || Object, typeof (_c = typeof _angular2Angular2.Renderer !== 'undefined' && _angular2Angular2.Renderer) === 'function' && _c || Object, typeof (_d = typeof _ionicComponentsListList.List !== 'undefined' && _ionicComponentsListList.List) === 'function' && _d || Object, typeof (_e = typeof _angular2Angular2.NgZone !== 'undefined' && _angular2Angular2.NgZone) === 'function' && _e || Object])], ItemSliding);

var ItemSlideGesture = (function (_DragGesture) {
    _inherits(ItemSlideGesture, _DragGesture);

    function ItemSlideGesture(item, el, zone) {
        var _this3 = this;

        _classCallCheck(this, ItemSlideGesture);

        _get(Object.getPrototypeOf(ItemSlideGesture.prototype), "constructor", this).call(this, el, {
            direction: 'x',
            threshold: el.offsetWidth
        });
        this.item = item;
        this.canDrag = true;
        this.listen();
        zone.runOutsideAngular(function () {
            var touchStart = function touchStart(e) {
                _this3.item.didTouch();
                (0, _ionicUtilDom.raf)(function () {
                    _this3.item.itemOptionsWidth = _this3.item.itemOptions && _this3.item.itemOptions.offsetWidth || 0;
                });
            };
            el.addEventListener('touchstart', touchStart);
            el.addEventListener('mousedown', touchStart);
            var touchEnd = function touchEnd(e) {
                // If we have a touch end and the item is closing,
                // prevent default to stop a click from triggering
                if (_this3.item.didClose) {
                    e.preventDefault();
                }
                _this3.item.didClose = false;
            };
            el.addEventListener('touchend', touchEnd);
            el.addEventListener('mouseup', touchEnd);
            el.addEventListener('mouseout', touchEnd);
            el.addEventListener('mouseleave', touchEnd);
            el.addEventListener('touchcancel', touchEnd);
        });
    }

    _createClass(ItemSlideGesture, [{
        key: "onDragStart",
        value: function onDragStart(ev) {
            if (this.item.didClose) {
                return;
            }
            if (!this.item.itemOptionsWidth) {
                return;
            }
            this.slide = {};
            this.slide.offsetX = this.item.getOpenAmt();
            this.slide.startX = ev.center[this.direction];
            this.slide.started = true;
            this.item.disableAnimation();
        }
    }, {
        key: "onDrag",
        value: function onDrag(ev) {
            if (!this.slide || !this.slide.started) return;
            this.slide.x = ev.center[this.direction];
            this.slide.delta = this.slide.x - this.slide.startX;
            var newX = Math.max(0, this.slide.offsetX - this.slide.delta);
            var buttonsWidth = this.item.itemOptionsWidth;
            if (newX > this.item.itemOptionsWidth) {
                // Calculate the new X position, capped at the top of the buttons
                newX = -Math.min(-buttonsWidth, -buttonsWidth + (this.slide.delta + buttonsWidth) * 0.4);
            }
            this.item.open(newX);
        }
    }, {
        key: "onDragEnd",
        value: function onDragEnd(ev) {
            var _this4 = this;

            if (!this.slide || !this.slide.started) return;
            var buttonsWidth = this.item.itemOptionsWidth;
            // If we are currently dragging, we want to snap back into place
            // The final resting point X will be the width of the exposed buttons
            var restingPoint = this.item.itemOptionsWidth;
            // Check if the drag didn't clear the buttons mid-point
            // and we aren't moving fast enough to swipe open
            if (this.item.openAmount < buttonsWidth / 2) {
                // If we are going left but too slow, or going right, go back to resting
                if (ev.direction & _ionicGesturesHammer.Hammer.DIRECTION_RIGHT) {
                    // Left
                    restingPoint = 0;
                } else if (Math.abs(ev.velocityX) < 0.3) {
                    // Right
                    restingPoint = 0;
                }
            }
            (0, _ionicUtilDom.raf)(function () {
                if (restingPoint === 0) {
                    // Reset to zero
                    _this4.item.open('');
                    var buttons = _this4.item.itemOptions;
                    clearTimeout(_this4.hideButtonsTimeout);
                    _this4.hideButtonsTimeout = setTimeout(function () {
                        buttons && buttons.classList.add('invisible');
                    }, 250);
                } else {
                    _this4.item.open(restingPoint);
                }
                _this4.item.enableAnimation();
                _this4.slide = null;
            });
        }
    }]);

    return ItemSlideGesture;
})(_ionicGesturesDragGesture.DragGesture);

var _a, _b, _c, _d, _e;