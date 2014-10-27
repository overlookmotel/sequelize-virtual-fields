// --------------------
// Sequelize virtual fields
// --------------------

// imports
var errors = require('./errors'),
	beforeFindHook = require('./beforeFindHook'),
	afterInitHook = require('./afterInitHook'),
	init = require('./init');

// exports
module.exports = function(Sequelize) {
	// require Sequelize if not provided
	if (!Sequelize) Sequelize = require('sequelize');
	
	// prep imports
	beforeFindHook = beforeFindHook(Sequelize);
	afterInitHook = afterInitHook(Sequelize, beforeFindHook);
	init = init(Sequelize);
	
	// add custom errors to Sequelize
	errors.init(Sequelize);
	
	// create afterInitHook
	Sequelize.addHook('afterInit', afterInitHook);
	
	// create initVirtualFields method
	Sequelize.prototype.initVirtualFields = init;
	
	// return Sequelize
	return Sequelize;
};
