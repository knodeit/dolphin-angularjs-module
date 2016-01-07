/**
 * Created by Vadim on 12/14/15.
 */
'use strict';
var Module = require('dolphin-core-modules').Module;
var FSUtil = require('dolphin-core-utils').FS;
var PathUtil = require('path');
var Q = require('q');
var myModule = new Module('AngularJs', __dirname);
var deferred = Q.defer();
var PUBLIC_FOLDER = 'public';
var ANGULAR_PATH = ['controllers/**/*.js', 'directives/**/*.js', 'routes/**/*.js', 'filters/**/*.js', 'providers/**/*.js', 'services/**/*.js', 'vendor/**/*.js'];
var CSS_FOLDER = 'assets/css';
var STATIC_FOLDER = 'assets/static';
var VIEWS_FOLDER = 'views';

myModule.configureFactories(function (AssetManagerConfigurationFactory, JsExporterConfigurationFactory) {
    AssetManagerConfigurationFactory.addPromise(deferred.promise);
    AssetManagerConfigurationFactory.addCustomScriptBefore(myModule.resolvePath('angular-bootstrap.js'));
});

function loadAllAssets(module, AssetManagerConfigurationFactory) {
    var deferred = Q.defer();

    //load all angular modules
    readFolder(module.resolvePath(PathUtil.join(PUBLIC_FOLDER, '*.js'))).then(function (files) {
        files.forEach(function (file) {
            AssetManagerConfigurationFactory.addCustomScriptBefore(file);
        });

        var funcs = [];
        for (var i in ANGULAR_PATH) {
            funcs.push(readFolder(module.resolvePath(PathUtil.join(PUBLIC_FOLDER, ANGULAR_PATH[i]))));
        }

        Q.all(funcs).then(function (jsResult) {
            jsResult.forEach(function (files) {
                files.forEach(function (file) {
                    AssetManagerConfigurationFactory.addCustomScript(file);
                });
            });

            //load css
            FSUtil.readDir(module.resolvePath(PathUtil.join(PUBLIC_FOLDER, CSS_FOLDER, '/**/*'))).then(function (files) {
                files.forEach(function (file) {
                    AssetManagerConfigurationFactory.addCustomStyle(file);
                });

                //copy assets
                AssetManagerConfigurationFactory.addAssetFolder(module.resolvePath(PathUtil.join(PUBLIC_FOLDER, STATIC_FOLDER, '/**/*')));

                //exit
                deferred.resolve();
            });
        });
    });
    return deferred.promise;
}

function readFolder(path) {
    var deferred = Q.defer();
    FSUtil.readDir(path).then(function (files) {
        deferred.resolve(files);
    });
    return deferred.promise;
}

myModule.run(function (AngularJsConfigurationFactory, AssetManagerConfigurationFactory, WebServerConfigurationFactory, JsExporterConfigurationFactory) {
    var funcs = [];
    var modules = AngularJsConfigurationFactory.getModules();
    for (var i in modules) {
        funcs.push(loadAllAssets(modules[i].module, AssetManagerConfigurationFactory));

        //static views
        //url: name_of_module/views/
        WebServerConfigurationFactory.addStaticSource({url: '/' + modules[i].module.name + '/' + VIEWS_FOLDER, path: modules[i].module.resolvePath(PathUtil.join(PUBLIC_FOLDER, VIEWS_FOLDER))});
    }
    Q.all(funcs).then(function () {
        JsExporterConfigurationFactory.addObject('angularModules', AngularJsConfigurationFactory.getAngularModules());
        deferred.resolve();
    });
});
