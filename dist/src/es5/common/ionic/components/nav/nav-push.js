"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _angular2Angular2 = require('angular2/angular2');

var _navController = require('./nav-controller');

var _navRegistry = require('./nav-registry');

/**
 * Directive for declaratively linking to a new page instead of using
 * [NavController.push()](../NavController/#push). Similar to ui-router's `ui-sref`.
 *
 * Basic usage:
 * ```html
 * <button [nav-push]="pushPage"></button>
 * ```
 * To specify parameters you can use array syntax or the `nav-params` property:
 * ```html
 * <button [nav-push]="pushPage" [nav-params]="params"></button>
 * ```
 * Where `pushPage` and `params` are specified in your component, and `pushPage`
 * contains a reference to a [@Page component](../../../config/Page/):
 *
 * ```ts
 * import {LoginPage} from 'login';
 * @Page({
 *   template: `<button [nav-push]="pushPage" [nav-params]="params"></button>`
 * })
 * class MyPage {
 *   constructor(){
 *     this.pushPage = LoginPage;
 *     this.params = { id: 42 };
 *   }
 * }
 * ```
 *
 * ### Alternate syntax
 * You can also use syntax similar to Angular2's router, passing an array to
 * NavPush:
 * ```html
 * <button [nav-push]="[pushPage, params]"></button>
 * ```
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
var NavPush = (function () {
    /**
     * TODO
     * @param {NavController} nav  TODO
     */

    function NavPush(nav, registry) {
        _classCallCheck(this, NavPush);

        this.nav = nav;
        this.registry = registry;
        if (!nav) {
            console.error('nav-push must be within a NavController');
        }
    }

    _createClass(NavPush, [{
        key: "onClick",
        value: function onClick() {
            var destination = undefined,
                params = undefined;
            if (this.instruction instanceof Array) {
                if (this.instruction.length > 2) {
                    throw 'Too many [nav-push] arguments, expects [View, { params }]';
                }
                destination = this.instruction[0];
                params = this.instruction[1] || this.params;
            } else {
                destination = this.instruction;
                params = this.params;
            }
            if (typeof destination === "string") {
                destination = this.registry.get(destination);
            }
            this.nav && this.nav.push(destination, params);
        }
    }]);

    return NavPush;
})();
exports.NavPush = NavPush;
exports.NavPush = NavPush = __decorate([(0, _angular2Angular2.Directive)({
    selector: '[nav-push]',
    inputs: ['instruction: navPush', 'params: navParams'],
    host: {
        '(click)': 'onClick()',
        'role': 'link'
    }
}), __param(0, (0, _angular2Angular2.Optional)()), __metadata('design:paramtypes', [typeof (_a = typeof _navController.NavController !== 'undefined' && _navController.NavController) === 'function' && _a || Object, typeof (_b = typeof _navRegistry.NavRegistry !== 'undefined' && _navRegistry.NavRegistry) === 'function' && _b || Object])], NavPush);
/**
 * TODO
 */
var NavPop = (function () {
    /**
     * TODO
     * @param {NavController} nav  TODO
     */

    function NavPop(nav) {
        _classCallCheck(this, NavPop);

        this.nav = nav;
        if (!nav) {
            console.error('nav-pop must be within a NavController');
        }
    }

    _createClass(NavPop, [{
        key: "onClick",
        value: function onClick() {
            this.nav && this.nav.pop();
        }
    }]);

    return NavPop;
})();
exports.NavPop = NavPop;
exports.NavPop = NavPop = __decorate([(0, _angular2Angular2.Directive)({
    selector: '[nav-pop]',
    host: {
        '(click)': 'onClick()',
        'role': 'link'
    }
}), __param(0, (0, _angular2Angular2.Optional)()), __metadata('design:paramtypes', [typeof (_c = typeof _navController.NavController !== 'undefined' && _navController.NavController) === 'function' && _c || Object])], NavPop);
var _a, _b, _c;