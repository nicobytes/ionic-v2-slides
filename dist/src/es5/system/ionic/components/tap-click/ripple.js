System.register('ionic/components/tap-click/ripple', ['./activator', '../../util/dom', '../../animations/animation'], function (_export) {
    'use strict';

    var Activator, removeElement, raf, Animation, RippleActivator, TOUCH_DOWN_ACCEL, EXPAND_DOWN_PLAYBACK_RATE, EXPAND_OUT_PLAYBACK_RATE, OPACITY_OUT_DURATION;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    return {
        setters: [function (_activator) {
            Activator = _activator.Activator;
        }, function (_utilDom) {
            removeElement = _utilDom.removeElement;
            raf = _utilDom.raf;
        }, function (_animationsAnimation) {
            Animation = _animationsAnimation.Animation;
        }],
        execute: function () {
            RippleActivator = (function (_Activator) {
                _inherits(RippleActivator, _Activator);

                function RippleActivator(app, config) {
                    _classCallCheck(this, RippleActivator);

                    _get(Object.getPrototypeOf(RippleActivator.prototype), 'constructor', this).call(this, app, config);
                    this.ripples = {};
                }

                _createClass(RippleActivator, [{
                    key: 'downAction',
                    value: function downAction(ev, activatableEle, pointerX, pointerY) {
                        var _this = this;

                        if (this.disableActivated(ev)) return;
                        _get(Object.getPrototypeOf(RippleActivator.prototype), 'downAction', this).call(this, ev, activatableEle, pointerX, pointerY);
                        // create a new ripple element
                        var clientRect = activatableEle.getBoundingClientRect();
                        var clientPointerX = pointerX - clientRect.left;
                        var clientPointerY = pointerY - clientRect.top;
                        var x = Math.max(Math.abs(clientRect.width - clientPointerX), clientPointerX) * 2;
                        var y = Math.max(Math.abs(clientRect.height - clientPointerY), clientPointerY) * 2;
                        var diameter = Math.max(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)), 64);
                        var radius = Math.sqrt(clientRect.width + clientRect.height);
                        var duration = 1000 * Math.sqrt(radius / TOUCH_DOWN_ACCEL) + 0.5;
                        var rippleEle = document.createElement('md-ripple');
                        var eleStyle = rippleEle.style;
                        eleStyle.width = eleStyle.height = diameter + 'px';
                        eleStyle.marginTop = eleStyle.marginLeft = -(diameter / 2) + 'px';
                        eleStyle.left = clientPointerX + 'px';
                        eleStyle.top = clientPointerY + 'px';
                        activatableEle.appendChild(rippleEle);
                        var ripple = this.ripples[Date.now()] = {
                            ele: rippleEle,
                            radius: radius,
                            duration: duration
                        };
                        // expand the circle from the users starting point
                        // start slow, and when they let up, then speed up the animation
                        ripple.expand = new Animation(rippleEle, { renderDelay: 0 });
                        ripple.expand.fromTo('scale', '0.001', '1').duration(duration).playbackRate(EXPAND_DOWN_PLAYBACK_RATE).onFinish(function () {
                            // finished expanding
                            ripple.expand && ripple.expand.dispose();
                            ripple.expand = null;
                            ripple.expanded = true;
                            _this.next();
                        }).play();
                        this.next();
                    }
                }, {
                    key: 'upAction',
                    value: function upAction(forceFadeOut) {
                        var _this2 = this;

                        this.deactivate();
                        var rippleId = undefined,
                            ripple = undefined;
                        for (rippleId in this.ripples) {
                            ripple = this.ripples[rippleId];
                            if (!ripple.fade || forceFadeOut) {
                                // ripple has not been let up yet
                                clearTimeout(ripple.fadeStart);
                                ripple.fadeStart = setTimeout(function () {
                                    // speed up the rate if the animation is still going
                                    ripple.expand && ripple.expand.playbackRate(EXPAND_OUT_PLAYBACK_RATE);
                                    ripple.fade = new Animation(ripple.ele);
                                    ripple.fade.fadeOut().duration(OPACITY_OUT_DURATION).playbackRate(1).onFinish(function () {
                                        ripple.fade && ripple.fade.dispose();
                                        ripple.fade = null;
                                        ripple.faded = true;
                                        _this2.next();
                                    }).play();
                                });
                            }
                        }
                        this.next();
                    }
                }, {
                    key: 'next',
                    value: function next(forceComplete) {
                        var _this3 = this;

                        var rippleId = undefined,
                            ripple = undefined;
                        for (rippleId in this.ripples) {
                            ripple = this.ripples[rippleId];
                            if (ripple.expanded && ripple.faded && ripple.ele || forceComplete) {
                                // finished expanding and the user has lifted the pointer
                                ripple.remove = true;
                                raf(function () {
                                    _this3.remove();
                                });
                            }
                        }
                    }
                }, {
                    key: 'clearState',
                    value: function clearState() {
                        this.deactivate();
                        this.next(true);
                    }
                }, {
                    key: 'remove',
                    value: function remove() {
                        var rippleId = undefined,
                            ripple = undefined;
                        for (rippleId in this.ripples) {
                            ripple = this.ripples[rippleId];
                            if (ripple.remove || parseInt(rippleId, 10) + 4000 < Date.now()) {
                                ripple.expand && ripple.expand.dispose();
                                ripple.fade && ripple.fade.dispose();
                                removeElement(ripple.ele);
                                ripple.ele = ripple.expand = ripple.fade = null;
                                delete this.ripples[rippleId];
                            }
                        }
                    }
                }]);

                return RippleActivator;
            })(Activator);

            _export('RippleActivator', RippleActivator);

            TOUCH_DOWN_ACCEL = 512;
            EXPAND_DOWN_PLAYBACK_RATE = 0.35;
            EXPAND_OUT_PLAYBACK_RATE = 3;
            OPACITY_OUT_DURATION = 750;
        }
    };
});