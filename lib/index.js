// --------------------
// Sequelize virtual fields
// --------------------

// imports
var errors = require('./errors');

// exports
module.exports = function(Sequelize) {
	// require Sequelize if not provided
	if (!Sequelize) Sequelize = require('sequelize');
	
	// add custom errors to Sequelize
	errors.init(Sequelize);
	
	// return Sequelize
	return Sequelize;
};
