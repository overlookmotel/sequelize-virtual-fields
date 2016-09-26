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
        /*
         * Patches to unify function signature changes between Sequelize v2, v3 and v4
         */
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
        /*
         * In Sequelize v2 + v3:
         *   - models are instanceof Sequelize.Model
         *   - model instances are instanceof model.Instance
         *   - model.Instance is subclass of Sequelize.Instance
         *   - models instances have a property `.Model` referring to the model they are one of
         *
         * In Sequelize v4:
         *   - models are subclasses of Sequelize.Model
         *   - model instances are instanceof their Model + therefore also instanceof Sequelize.Model
         *   - Sequelize.Instance does not exist
         *
         * The patches below account for these changes.
         */
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
