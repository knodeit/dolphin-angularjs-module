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
var CSS_FOLDER = 'assets/css';
var STATIC_FOLDER = 'assets/static';
var VIEWS_FOLDER = 'views';

myModule.configureFactories(function (AssetManagerConfigurationFactory) {
    AssetManagerConfigurationFactory.addPromise(deferred.promise);
    AssetManagerConfigurationFactory.addCustomScript(myModule.resolvePath('angular-bootstrap.js'));
});

function loadAllAssets(module, AssetManagerConfigurationFactory) {
    var deferred = Q.defer();
    //load js
    FSUtil.readDir(module.resolvePath(PathUtil.join(PUBLIC_FOLDER, '/**/*.js'))).then(function (files) {
        files.forEach(function (file) {
            AssetManagerConfigurationFactory.addCustomScript(file);
        });

        //load css
        FSUtil.readDir(module.resolvePath(PathUtil.join(PUBLIC_FOLDER, CSS_FOLDER, '/**/*'))).then(function (files) {
            files.forEach(function (file) {
                AssetManagerConfigurationFactory.addCustomStyles(file);
            });

            //copy assets
            AssetManagerConfigurationFactory.addAssetFolder(module.resolvePath(PathUtil.join(PUBLIC_FOLDER, STATIC_FOLDER, '/**/*')));

            //exit
            deferred.resolve();
        });
    });
    return deferred.promise;
}

myModule.run(function (AngularJsConfigurationFactory, AssetManagerConfigurationFactory, WebServerConfigurationFactory) {
    var funcs = [];
    var modules = AngularJsConfigurationFactory.getModules();
    for (var i in modules) {
        funcs.push(loadAllAssets(modules[i].module, AssetManagerConfigurationFactory));

        //static views
        //url: name_of_module/views/
        WebServerConfigurationFactory.addStaticSource({url: '/' + modules[i].module.name + '/' + VIEWS_FOLDER, path: modules[i].module.resolvePath(PathUtil.join(PUBLIC_FOLDER, VIEWS_FOLDER))});
    }
    Q.all(funcs).then(function () {
        deferred.resolve();
    });
});
