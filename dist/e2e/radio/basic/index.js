System.register("index", ["ionic/ionic", "angular2/angular2"], function (_export) {
    "use strict";

    var App, Control, ControlGroup, __decorate, __metadata, IonicApp;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    return {
        setters: [function (_ionicIonic) {
            App = _ionicIonic.App;
        }, function (_angular2Angular2) {
            Control = _angular2Angular2.Control;
            ControlGroup = _angular2Angular2.ControlGroup;
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

            IonicApp = (function () {
                function IonicApp() {
                    _classCallCheck(this, IonicApp);

                    this.fruits = new Control("");
                    this.fruitsForm = new ControlGroup({
                        "fruits": this.fruits
                    });
                }

                _createClass(IonicApp, [{
                    key: "setApple",
                    value: function setApple() {
                        this.fruits.updateValue("apple");
                    }
                }, {
                    key: "setBanana",
                    value: function setBanana() {
                        this.fruits.updateValue("banana");
                    }
                }, {
                    key: "setCherry",
                    value: function setCherry() {
                        this.fruits.updateValue("cherry");
                    }
                }, {
                    key: "doSubmit",
                    value: function doSubmit(event) {
                        console.log('Submitting form', this.fruitsForm.value);
                        event.preventDefault();
                    }
                }]);

                return IonicApp;
            })();

            IonicApp = __decorate([App({
                templateUrl: 'main.html'
            }), __metadata('design:paramtypes', [])], IonicApp);
        }
    };
});