/**
 * Created by Vadim on 12/10/15.
 */
'use strict';
var _ = require('lodash');

var modules = [];
var systemAngulaModules = [];

module.exports = {
    name: 'Configuration',
    entity: {
        addSystemAngularModule: function (name) {
            if (!_.isArray(name)) {
                name = [name];
            }

            name.forEach(function (m) {
                systemAngulaModules.push(m);
            });
        },
        getSystemAngularModules: function () {
            return systemAngulaModules;
        },
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