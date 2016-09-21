// --------------------
// Sequelize virtual fields
// afterInit hook function
// --------------------

// imports
var beforeFindHookFn = require('./beforeFindHook'),
	afterFindHookFn = require('./afterFindHook');

// exports
module.exports = function(Sequelize) {
	var beforeFindHook = beforeFindHookFn(Sequelize),
		afterFindHook = afterFindHookFn(Sequelize);

	return function(sequelize) {
		// initialize options
		sequelize.options.virtualFields = {active: false};

		// set find hooks
		sequelize.addHook('beforeFindAfterExpandIncludeAll', beforeFindHook);
		sequelize.addHook('afterFind', afterFindHook);
	};
};
