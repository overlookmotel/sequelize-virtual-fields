// --------------------
// Sequelize virtual fields
// Patches to unify Sequlize versions 2.x.x, 3.x.x and 4.x.x
// --------------------

// modules
var semverSelect = require('semver-select');

var sequelizeVersionImported = require('sequelize/package.json').version;

// exports

// function to define patches
module.exports = function(Sequelize) {
    // get Sequelize version
    var sequelizeVersion = Sequelize.version || sequelizeVersionImported;

    // define patches
    return semverSelect.object(sequelizeVersion, {
        instanceOptions: {
            '2.0.0 - 3.8.x': function(instance) {
                return instance.options;
            },
            '^3.9.0': function(instance) {
                return instance.$options;
            },
            '>=4.0.0-0': function(instance) {
                return instance._options;
            }
        },
        instancePrototype: {
            '2.0.0 - 3.x.x': (Sequelize.Instance || {}).prototype,
            '>=4.0.0-0': Sequelize.Model.prototype
        },
        isModel: {
            '2.0.0 - 3.x.x': function(model) {
                return model instanceof Sequelize.Model;
            },
            '>=4.0.0-0': function(model) {
                return model.prototype instanceof Sequelize.Model;
            }
        },
        isModelInstance: {
            '2.0.0 - 3.x.x': function(item) {
                return item instanceof Sequelize.Instance;
            },
            '>=4.0.0-0': function(item) {
                return item instanceof Sequelize.Model;
            }
        }
    });
};
