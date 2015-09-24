// --------------------
// Sequelize virtual fields
// Patched versions of sequelize methods which unify interface across Sequlize versions 2.x.x and 3.x.x
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
            '^3.9.0': function(instance) {
                return instance.$options;
            },
            '*': function(instance) {
                return instance.options;
            }
        }
    });
};
