// --------------------
// Sequelize virtual fields
// afterInit hook function
// --------------------

// imports
var beforeFindHook = require('./beforeFindHook'),
	afterFindHookFn = require('./afterFindHook');

// exports
module.exports = function(Sequelize) {
	var afterFindHook = afterFindHookFn(Sequelize);
	
	return function(sequelize) {
		// initialize options
		sequelize.options.virtualFields = {active: false};

		// set find hooks
		sequelize.addHook('beforeFindAfterExpandIncludeAll', beforeFindHook);
		sequelize.addHook('afterFind', afterFindHook);
	};
};
