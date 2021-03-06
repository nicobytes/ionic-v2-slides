System.register('ionic/config/config', ['../platform/platform', '../util/util'], function (_export) {
    /**
    * @ngdoc service
    * @name Config
    * @module ionic
    * @description
    * Config allows you to set the modes of your components
    */

    /**
     * Config lets you change multiple or a single value in an apps mode configuration. Things such as tab placement, icon changes, and view animations can be set here.
     *
     * ```ts
     * import {Config} from 'ionic/ionic';
     * @App({
     *   template: `<ion-nav [root]="root"></ion-nav>`
     *   config: {
     *     backButtonText: 'Go Back',
     *     iconMode: 'ios',
     *     modalEnter: 'modal-slide-in',
     *     modalLeave: 'modal-slide-out',
     *     tabbarPlacement: 'bottom',
     *     viewTransition: 'ios',
     *   }
     * })
     * ```
     *
     * Config can be overwritting at multiple levels, allowing deeper configuration. Taking the example from earlier, we can override any setting we want based on a platform.
     * ```ts
     * import {Config} from 'ionic/ionic';
     * @App({
     *   template: `<ion-nav [root]="root"></ion-nav>`
     *   config: {
     *     'tabbarPlacement': 'bottom',
     *     platform: {
     *      ios: {
     *        'tabbarPlacement': 'top',
     *      }
     *     }
     *   }
     * })
     * ```
     *
     * We could also configure these values at a component level. Take `tabbarPlacement`, we can configure this as a property on our `ion-tabs`.
     *
     * ```html
     * <ion-tabs tabbar-placement="top">
     *    <ion-tab tab-title="Dash" tab-icon="pulse" [root]="DashRoot"></ion-tab>
     *  </ion-tabs>
     * ```
     *
     * The property will override anything else set in the apps.
     *
     * The last way we could configure is through URL query strings. This is useful for testing while in the browser.
     * Simply add `?ionic<PROPERTYNAME>=<value>` to the url.
     *
     * ```
     * http://localhost:8100/?IonictabbarPlacement=bottom
     * ```
    **/
    'use strict';

    var Platform, isObject, isDefined, isFunction, isArray, Config, modeConfigs;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_platformPlatform) {
            Platform = _platformPlatform.Platform;
        }, function (_utilUtil) {
            isObject = _utilUtil.isObject;
            isDefined = _utilUtil.isDefined;
            isFunction = _utilUtil.isFunction;
            isArray = _utilUtil.isArray;
        }],
        execute: function () {
            Config = (function () {
                /**
                 * TODO
                 * @param  {Object} config   The config for your app
                 */

                function Config(config) {
                    _classCallCheck(this, Config);

                    this._s = config && isObject(config) && !isArray(config) ? config : {};
                    this._c = {}; // cached values
                }

                /**
                 * For setting and getting multiple config values
                 */
                /**
                 * @private
                 * @name settings()
                 * @description
                 */

                _createClass(Config, [{
                    key: 'settings',
                    value: function settings() {
                        var args = arguments;
                        switch (args.length) {
                            case 0:
                                return this._s;
                            case 1:
                                // settings({...})
                                this._s = args[0];
                                this._c = {}; // clear cache
                                break;
                            case 2:
                                // settings('ios', {...})
                                this._s.platforms = this._s.platforms || {};
                                this._s.platforms[args[0]] = args[1];
                                this._c = {}; // clear cache
                                break;
                        }
                        return this;
                    }

                    /**
                    * For setting a single config values
                    */
                    /**
                     * @private
                     * @name set()
                     * @description
                     */
                }, {
                    key: 'set',
                    value: function set() {
                        var args = arguments;
                        var arg0 = args[0];
                        var arg1 = args[1];
                        switch (args.length) {
                            case 2:
                                // set('key', 'value') = set key/value pair
                                // arg1 = value
                                this._s[arg0] = arg1;
                                delete this._c[arg0]; // clear cache
                                break;
                            case 3:
                                // setting('ios', 'key', 'value') = set key/value pair for platform
                                // arg0 = platform
                                // arg1 = key
                                // arg2 = value
                                this._s.platforms = this._s.platforms || {};
                                this._s.platforms[arg0] = this._s.platforms[arg0] || {};
                                this._s.platforms[arg0][arg1] = args[2];
                                delete this._c[arg1]; // clear cache
                                break;
                        }
                        return this;
                    }

                    /**
                     * For getting a single config values
                     */
                    /**
                     * @private
                     * @name get()
                     * @description
                     */
                }, {
                    key: 'get',
                    value: function get(key) {
                        if (!isDefined(this._c[key])) {
                            // if the value was already set this will all be skipped
                            // if there was no user config then it'll check each of
                            // the user config's platforms, which already contains
                            // settings from default platform configs
                            var userPlatformValue = undefined;
                            var userDefaultValue = this._s[key];
                            var userPlatformModeValue = undefined;
                            var userDefaultModeValue = undefined;
                            var platformValue = undefined;
                            var platformModeValue = undefined;
                            var configObj = null;
                            if (this._platform) {
                                var queryStringValue = this._platform.query('ionic' + key.toLowerCase());
                                if (isDefined(queryStringValue)) {
                                    return this._c[key] = queryStringValue === 'true' ? true : queryStringValue === 'false' ? false : queryStringValue;
                                }
                                // check the platform settings object for this value
                                // loop though each of the active platforms
                                // array of active platforms, which also knows the hierarchy,
                                // with the last one the most important
                                var activePlatformKeys = this._platform.platforms();
                                // loop through all of the active platforms we're on
                                for (var i = 0, l = activePlatformKeys.length; i < l; i++) {
                                    // get user defined platform values
                                    if (this._s.platforms) {
                                        configObj = this._s.platforms[activePlatformKeys[i]];
                                        if (configObj) {
                                            if (isDefined(configObj[key])) {
                                                userPlatformValue = configObj[key];
                                            }
                                            configObj = Config.getModeConfig(configObj.mode);
                                            if (configObj && isDefined(configObj[key])) {
                                                userPlatformModeValue = configObj[key];
                                            }
                                        }
                                    }
                                    // get default platform's setting
                                    configObj = Platform.get(activePlatformKeys[i]);
                                    if (configObj && configObj.settings) {
                                        if (isDefined(configObj.settings[key])) {
                                            // found a setting for this platform
                                            platformValue = configObj.settings[key];
                                        }
                                        configObj = Config.getModeConfig(configObj.settings.mode);
                                        if (configObj && isDefined(configObj[key])) {
                                            // found setting for this platform's mode
                                            platformModeValue = configObj[key];
                                        }
                                    }
                                }
                            }
                            configObj = Config.getModeConfig(this._s.mode);
                            if (configObj && isDefined(configObj[key])) {
                                userDefaultModeValue = configObj[key];
                            }
                            // cache the value
                            this._c[key] = isDefined(userPlatformValue) ? userPlatformValue : isDefined(userDefaultValue) ? userDefaultValue : isDefined(userPlatformModeValue) ? userPlatformModeValue : isDefined(userDefaultModeValue) ? userDefaultModeValue : isDefined(platformValue) ? platformValue : isDefined(platformModeValue) ? platformModeValue : null;
                        }
                        // return key's value
                        // either it came directly from the user config
                        // or it was from the users platform configs
                        // or it was from the default platform configs
                        // in that order
                        if (isFunction(this._c[key])) {
                            return this._c[key](this._platform);
                        }
                        return this._c[key];
                    }

                    /**
                     * TODO
                     * @param  {Object} platform   The platform
                     */
                }, {
                    key: 'setPlatform',
                    value: function setPlatform(platform) {
                        this._platform = platform;
                    }
                }], [{
                    key: 'setModeConfig',
                    value: function setModeConfig(mode, config) {
                        modeConfigs[mode] = config;
                    }
                }, {
                    key: 'getModeConfig',
                    value: function getModeConfig(mode) {
                        return modeConfigs[mode] || null;
                    }
                }]);

                return Config;
            })();

            _export('Config', Config);

            modeConfigs = {};
        }
    };
});