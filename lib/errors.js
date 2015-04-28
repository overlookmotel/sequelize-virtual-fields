// --------------------
// Sequelize virtual fields
// Errors
// --------------------

// modules
var _ = require('lodash'),
	util = require('util');

// exports
module.exports = {
	init: function(Sequelize) {
		// define errors
		var errors = {};

		errors.SequelizeVirtualFieldsError = function(message) {
			Sequelize.Error.call(this, message);
			this.name = 'SequelizeVirtualFieldsError';
		};
		util.inherits(errors.SequelizeVirtualFieldsError, Sequelize.Error);

		// add errors to Sequelize
		_.extend(Sequelize, errors);
		_.extend(Sequelize.prototype, errors);
	}
};
