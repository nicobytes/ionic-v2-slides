System.register('ionic/components/menu/menu-types', ['./menu', 'ionic/animations/animation'], function (_export) {
    /**
     * Menu Type
     * Base class which is extended by the various types. Each
     * type will provide their own animations for open and close
     * and registers itself with Menu.
     */
    'use strict';

    var Menu, Animation, MenuType, MenuRevealType, MenuPushType, MenuOverlayType, OPACITY, TRANSLATE_X;

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_menu) {
            Menu = _menu.Menu;
        }, function (_ionicAnimationsAnimation) {
            Animation = _ionicAnimationsAnimation.Animation;
        }],
        execute: function () {
            MenuType = (function () {
                function MenuType() {
                    _classCallCheck(this, MenuType);

                    this.open = new Animation();
                    this.close = new Animation();
                }

                /**
                 * Menu Reveal Type
                 * The content slides over to reveal the menu underneath.
                 * The menu itself, which is under the content, does not move.
                 */

                _createClass(MenuType, [{
                    key: 'setOpen',
                    value: function setOpen(shouldOpen) {
                        var _this = this;

                        return new Promise(function (resolve) {
                            if (shouldOpen) {
                                _this.open.playbackRate(1).onFinish(resolve, true).play();
                            } else {
                                _this.close.playbackRate(1).onFinish(resolve, true).play();
                            }
                        });
                    }
                }, {
                    key: 'setProgressStart',
                    value: function setProgressStart(isOpen) {
                        this.isOpening = !isOpen;
                        this.seek && this.seek.dispose();
                        // clone the correct animation depending on open/close
                        if (this.isOpening) {
                            this.seek = this.open.clone();
                        } else {
                            this.seek = this.close.clone();
                        }
                        // the cloned animation should not use an easing curve during seek
                        this.seek.easing('linear').progressStart();
                    }
                }, {
                    key: 'setProgess',
                    value: function setProgess(value) {
                        // adjust progress value depending if it opening or closing
                        if (!this.isOpening) {
                            value = 1 - value;
                        }
                        this.seek.progress(value);
                    }
                }, {
                    key: 'setProgressEnd',
                    value: function setProgressEnd(shouldComplete) {
                        var _this2 = this;

                        var resolve = undefined;
                        var promise = new Promise(function (res) {
                            resolve = res;
                        });
                        var isOpen = this.isOpening && shouldComplete;
                        if (!this.isOpening && !shouldComplete) {
                            isOpen = true;
                        }
                        this.seek.progressEnd(shouldComplete).then(function () {
                            _this2.isOpening = false;
                            resolve(isOpen);
                        });
                        return promise;
                    }
                }, {
                    key: 'onDestroy',
                    value: function onDestroy() {
                        this.open && this.open.dispose();
                        this.close && this.close.dispose();
                        this.seek && this.seek.dispose();
                    }
                }]);

                return MenuType;
            })();

            _export('MenuType', MenuType);

            MenuRevealType = (function (_MenuType) {
                _inherits(MenuRevealType, _MenuType);

                function MenuRevealType(menu) {
                    _classCallCheck(this, MenuRevealType);

                    _get(Object.getPrototypeOf(MenuRevealType.prototype), 'constructor', this).call(this);
                    var easing = 'ease';
                    var duration = 250;
                    var openedX = menu.width() * (menu.side == 'right' ? -1 : 1) + 'px';
                    var closedX = '0px';
                    this.open.easing(easing).duration(duration);
                    this.close.easing(easing).duration(duration);
                    var contentOpen = new Animation(menu.getContentElement());
                    contentOpen.fromTo(TRANSLATE_X, closedX, openedX);
                    this.open.add(contentOpen);
                    var contentClose = new Animation(menu.getContentElement());
                    contentClose.fromTo(TRANSLATE_X, openedX, closedX);
                    this.close.add(contentClose);
                }

                return MenuRevealType;
            })(MenuType);

            Menu.register('reveal', MenuRevealType);
            /**
             * Menu Push Type
             * The content slides over to reveal the menu underneath.
             * The menu itself also slides over to reveal its bad self.
             */

            MenuPushType = (function (_MenuType2) {
                _inherits(MenuPushType, _MenuType2);

                function MenuPushType(menu) {
                    _classCallCheck(this, MenuPushType);

                    _get(Object.getPrototypeOf(MenuPushType.prototype), 'constructor', this).call(this);
                    var easing = 'ease';
                    var duration = 250;
                    var contentClosedX = undefined,
                        contentOpenedX = undefined,
                        menuClosedX = undefined,
                        menuOpenedX = undefined;
                    if (menu.side == 'right') {
                        contentOpenedX = -menu.width() + 'px';
                        contentClosedX = '0px';
                        menuOpenedX = menu.platform.width() - menu.width() + 'px';
                        menuClosedX = menu.platform.width() + 'px';
                    } else {
                        contentOpenedX = menu.width() + 'px';
                        contentClosedX = '0px';
                        menuOpenedX = '0px';
                        menuClosedX = -menu.width() + 'px';
                    }
                    // left side
                    this.open.easing(easing).duration(duration);
                    this.close.easing(easing).duration(duration);
                    var menuOpen = new Animation(menu.getMenuElement());
                    menuOpen.fromTo(TRANSLATE_X, menuClosedX, menuOpenedX);
                    this.open.add(menuOpen);
                    var contentOpen = new Animation(menu.getContentElement());
                    contentOpen.fromTo(TRANSLATE_X, contentClosedX, contentOpenedX);
                    this.open.add(contentOpen);
                    var menuClose = new Animation(menu.getMenuElement());
                    menuClose.fromTo(TRANSLATE_X, menuOpenedX, menuClosedX);
                    this.close.add(menuClose);
                    var contentClose = new Animation(menu.getContentElement());
                    contentClose.fromTo(TRANSLATE_X, contentOpenedX, contentClosedX);
                    this.close.add(contentClose);
                }

                return MenuPushType;
            })(MenuType);

            Menu.register('push', MenuPushType);
            /**
             * Menu Overlay Type
             * The menu slides over the content. The content
             * itself, which is under the menu, does not move.
             */

            MenuOverlayType = (function (_MenuType3) {
                _inherits(MenuOverlayType, _MenuType3);

                function MenuOverlayType(menu) {
                    _classCallCheck(this, MenuOverlayType);

                    _get(Object.getPrototypeOf(MenuOverlayType.prototype), 'constructor', this).call(this);
                    var easing = 'ease';
                    var duration = 250;
                    var backdropOpacity = 0.35;
                    var closedX = undefined,
                        openedX = undefined;
                    if (menu.side == 'right') {
                        // right side
                        closedX = menu.platform.width() + 'px';
                        openedX = menu.platform.width() - menu.width() - 8 + 'px';
                    } else {
                        // left side
                        closedX = -menu.width() + 'px';
                        openedX = '8px';
                    }
                    this.open.easing(easing).duration(duration);
                    this.close.easing(easing).duration(duration);
                    var menuOpen = new Animation(menu.getMenuElement());
                    menuOpen.fromTo(TRANSLATE_X, closedX, openedX);
                    this.open.add(menuOpen);
                    var backdropOpen = new Animation(menu.getBackdropElement());
                    backdropOpen.fromTo(OPACITY, 0.01, backdropOpacity);
                    this.open.add(backdropOpen);
                    var menuClose = new Animation(menu.getMenuElement());
                    menuClose.fromTo(TRANSLATE_X, openedX, closedX);
                    this.close.add(menuClose);
                    var backdropClose = new Animation(menu.getBackdropElement());
                    backdropClose.fromTo(OPACITY, backdropOpacity, 0.01);
                    this.close.add(backdropClose);
                }

                return MenuOverlayType;
            })(MenuType);

            Menu.register('overlay', MenuOverlayType);
            OPACITY = 'opacity';
            TRANSLATE_X = 'translateX';
        }
    };
});