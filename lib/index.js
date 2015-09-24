// --------------------
// Sequelize virtual fields
// --------------------

// imports
var errors = require('./errors'),
	afterInitHookFn = require('./afterInitHook'),
	init = require('./init'),
	instanceGetFn = require('./instanceGet');

// exports
module.exports = function(Sequelize) {
	// require Sequelize if not provided
	if (!Sequelize) Sequelize = require('sequelize');

	var afterInitHook = afterInitHookFn(Sequelize),
		instanceGet = instanceGetFn(Sequelize);

	// add custom errors to Sequelize
	errors.init(Sequelize);

	// create afterInitHook
	Sequelize.addHook('afterInit', afterInitHook);

	// create initVirtualFields method
	Sequelize.prototype.initVirtualFields = init;

	// replace Instance#get method
	Sequelize.Instance.prototype.getVirtual = Sequelize.Instance.prototype.get;
	Sequelize.Instance.prototype.get = instanceGet;

	// return Sequelize
	return Sequelize;
};
