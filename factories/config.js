/**
 * Created by Vadim on 12/10/15.
 */
'use strict';
var modules = [];

module.exports = {
    name: 'Configuration',
    entity: {
        addModule: function (name, module) {
            modules.push({
                name: name,
                module: module
            });
        },
        getModules: function () {
            return modules;
        },
        getAngularModules: function () {
            return modules.map(function (module) {
                return module.name;
            });
        }
    }
};