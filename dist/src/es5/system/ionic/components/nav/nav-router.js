System.register("ionic/components/nav/nav-router", ["angular2/angular2", "angular2/router", "./nav"], function (_export) {
    /**
     * TODO
     */
    "use strict";

    var Directive, ElementRef, DynamicComponentLoader, Attribute, RouterOutlet, Router, Instruction, Nav, __decorate, __metadata, __param, NavRouter, _a, _b, _c, _d;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    return {
        setters: [function (_angular2Angular2) {
            Directive = _angular2Angular2.Directive;
            ElementRef = _angular2Angular2.ElementRef;
            DynamicComponentLoader = _angular2Angular2.DynamicComponentLoader;
            Attribute = _angular2Angular2.Attribute;
        }, function (_angular2Router) {
            RouterOutlet = _angular2Router.RouterOutlet;
            Router = _angular2Router.Router;
            Instruction = _angular2Router.Instruction;
        }, function (_nav) {
            Nav = _nav.Nav;
        }],
        execute: function () {
            __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
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

            __metadata = undefined && undefined.__metadata || function (k, v) {
                if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
            };

            __param = undefined && undefined.__param || function (paramIndex, decorator) {
                return function (target, key) {
                    decorator(target, key, paramIndex);
                };
            };

            NavRouter = (function (_RouterOutlet) {
                _inherits(NavRouter, _RouterOutlet);

                /**
                 * TODO
                 * @param {ElementRef} _elementRef  TODO
                 * @param {DynamicComponentLoader} _loader  TODO
                 * @param {Router} _parentRouter  TODO
                 * @param {string} nameAttr  Value of the element's 'name' attribute
                 * @param {Nav} nav  TODO
                 */

                function NavRouter(_elementRef, _loader, _parentRouter, nameAttr, nav) {
                    _classCallCheck(this, NavRouter);

                    _get(Object.getPrototypeOf(NavRouter.prototype), "constructor", this).call(this, _elementRef, _loader, _parentRouter, nameAttr);
                    // Nav is Ionic's NavController, which we injected into this class
                    this.nav = nav;
                    // register this router with Ionic's NavController
                    // Ionic's NavController will call this NavRouter's "stateChange"
                    // method when the NavController has...changed its state
                    nav.registerRouter(this);
                }

                /**
                 * @private
                 * TODO
                 * @param {ComponentInstruction} instruction  TODO
                 */

                _createClass(NavRouter, [{
                    key: "activate",
                    value: function activate(nextInstruction) {
                        var previousInstruction = this._currentInstruction;
                        this._currentInstruction = nextInstruction;
                        var componentType = nextInstruction.componentType;
                        var childRouter = this._parentRouter.childRouter(componentType);
                        // prevent double navigations to the same view
                        var lastView = this.nav.last();
                        if (lastView && lastView.componentType === componentType && lastView.params.data === nextInstruction.params) {
                            return Promise.resolve();
                        }
                        // tell the NavController which componentType, and it's params, to navigate to
                        return this.nav.push(componentType, nextInstruction.params);
                    }
                }, {
                    key: "reuse",
                    value: function reuse(nextInstruction) {
                        return Promise.resolve();
                    }

                    /**
                     * TODO
                     * @param {TODO} type  TODO
                     * @param {TODO} viewCtrl  TODO
                     */
                }, {
                    key: "stateChange",
                    value: function stateChange(type, viewCtrl) {
                        // stateChange is called by Ionic's NavController
                        // type could be "push" or "pop"
                        // viewCtrl is Ionic's ViewController class, which has the properties "componentType" and "params"
                        // only do an update if there's an actual view change
                        if (!viewCtrl || this._activeViewId === viewCtrl.id) return;
                        this._activeViewId = viewCtrl.id;
                        // get the best PathRecognizer for this view's componentType
                        var pathRecognizer = this.getPathRecognizerByComponent(viewCtrl.componentType);
                        if (pathRecognizer) {
                            // generate a componentInstruction from the view's PathRecognizer and params
                            var componentInstruction = pathRecognizer.generate(viewCtrl.params.data);
                            // create an Instruction from the componentInstruction
                            var instruction = new Instruction(componentInstruction, null);
                            this._parentRouter.navigateByInstruction(instruction);
                        }
                    }

                    /**
                     * TODO
                     * @param {TODO} componentType  TODO
                     * @returns {TODO} TODO
                     */
                }, {
                    key: "getPathRecognizerByComponent",
                    value: function getPathRecognizerByComponent(componentType) {
                        // given a componentType, figure out the best PathRecognizer to use
                        var rules = this._parentRouter.registry._rules;
                        var pathRecognizer = null;
                        rules.forEach(function (rule) {
                            pathRecognizer = rule.matchers.find(function (matcherPathRecognizer) {
                                return matcherPathRecognizer.handler.componentType === componentType;
                            });
                        });
                        return pathRecognizer;
                    }
                }]);

                return NavRouter;
            })(RouterOutlet);

            _export("NavRouter", NavRouter);

            _export("NavRouter", NavRouter = __decorate([Directive({
                selector: 'ion-nav'
            }), __param(3, Attribute('name')), __metadata('design:paramtypes', [typeof (_a = typeof ElementRef !== 'undefined' && ElementRef) === 'function' && _a || Object, typeof (_b = typeof DynamicComponentLoader !== 'undefined' && DynamicComponentLoader) === 'function' && _b || Object, typeof (_c = typeof Router !== 'undefined' && Router) === 'function' && _c || Object, String, typeof (_d = typeof Nav !== 'undefined' && Nav) === 'function' && _d || Object])], NavRouter));
        }
    };
});