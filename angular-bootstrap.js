/**
 * Created by Vadim on 12/15/15.
 */
'use strict';
angular.module('dolphin', $dolphin.getObject('angularModules'));

angular.element(document).ready(function () {
    //Then init the app
    angular.bootstrap(document, ['dolphin']);
});