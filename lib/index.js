// --------------------
// Sequelize virtual fields
// --------------------

// imports
var errors = require('./errors');

// exports
module.exports = function(Sequelize) {
	if (!Sequelize) Sequelize = require('sequelize');
	
	// add custom errors to Sequelize
	errors.init(Sequelize);
	
	return Sequelize;
};
