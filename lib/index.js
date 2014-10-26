// --------------------
// Sequelize virtual fields
// --------------------

// imports
var errors = require('./errors'),
	init = require('./init');

// exports
module.exports = function(Sequelize) {
	// require Sequelize if not provided
	if (!Sequelize) Sequelize = require('sequelize');
	
	// prep imports
	init = init(Sequelize);
	
	// add custom errors to Sequelize
	errors.init(Sequelize);
	
	// create initVirtualFields method
	Sequelize.prototype.initVirtualFields = init;
	
	// return Sequelize
	return Sequelize;
};
