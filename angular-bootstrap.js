/**
 * Created by Vadim on 12/15/15.
 */
'use strict';

//preload system
angular.module('dolphin-system', $dolphin.getObject('systemAngularModules'));

//preload all
angular.module('dolphin', $dolphin.getObject('angularModules'));

//run
angular.element(document).ready(function () {
    //Then init the app
    angular.bootstrap(document, ['dolphin-system', 'dolphin']);
});