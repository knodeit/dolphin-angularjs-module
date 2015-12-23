/**
 * Created by Vadim on 12/15/15.
 */
'use strict';

// Dynamically add angular modules declared by packages
var packageModules = [];
for (var i in window.dolphin.modules) {
    angular.module(window.dolphin.modules[i], []);
    packageModules.push(window.dolphin.modules[i]);
}
angular.module('dolphin', packageModules);

angular.element(document).ready(function () {
    //Then init the app
    angular.bootstrap(document, ['dolphin']);
});