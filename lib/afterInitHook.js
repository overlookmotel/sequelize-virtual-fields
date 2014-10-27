// --------------------
// Sequelize virtual fields
// beforeFind hook function
// --------------------

// modules
var _ = require('lodash');

// imports
var beforeFindHook = require('./beforeFindHook');

// exports
module.exports = function(sequelize) {
	// initialize options
	sequelize.options.virtualFields = {active: false};
	
	// set find hooks
	sequelize.addHook('beforeFindAfterExpandIncludeAll', beforeFindHook);
};
