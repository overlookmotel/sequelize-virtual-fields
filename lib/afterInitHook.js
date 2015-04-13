// --------------------
// Sequelize virtual fields
// afterInit hook function
// --------------------

// imports
var beforeFindHook = require('./beforeFindHook'),
	afterFindHook = require('./afterFindHook');

// exports
module.exports = function(sequelize) {
	// initialize options
	sequelize.options.virtualFields = {active: false};

	// set find hooks
	sequelize.addHook('beforeFindAfterExpandIncludeAll', beforeFindHook);
	sequelize.addHook('afterFind', afterFindHook);
};
