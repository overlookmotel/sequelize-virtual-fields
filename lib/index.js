// --------------------
// Sequelize virtual fields
// --------------------

// imports
var errors = require('./errors'),
	afterInitHookFn = require('./afterInitHook'),
	init = require('./init'),
	instanceGetFn = require('./instanceGet'),
	patchesFn = require('./patches');

// exports
module.exports = function(Sequelize) {
	// require Sequelize if not provided
	if (!Sequelize) Sequelize = require('sequelize');

	var afterInitHook = afterInitHookFn(Sequelize),
		instanceGet = instanceGetFn(Sequelize),
		patches = patchesFn(Sequelize);

	// add custom errors to Sequelize
	errors(Sequelize);

	// create afterInitHook
	Sequelize.addHook('afterInit', afterInitHook);

	// create initVirtualFields method
	Sequelize.prototype.initVirtualFields = init(Sequelize);

	// replace Instance#get method
	var instancePrototype = patches.instancePrototype;
	instancePrototype.getVirtual = instancePrototype.get;
	instancePrototype.get = instanceGet;

	// return Sequelize
	return Sequelize;
};
