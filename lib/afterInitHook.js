// --------------------
// Sequelize virtual fields
// beforeFind hook function
// --------------------

// modules
var _ = require('lodash');

// exports
module.exports = function(Sequelize, beforeFindHook) {
	return function(sequelize) {
		// initialize options
		sequelize.options.virtualFields = {active: false};
		
		// set find hooks
		sequelize.addHook('beforeFindAfterExpandIncludeAll', beforeFindHook);
	}
};
