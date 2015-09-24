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

		// general error for all virtual fields errors
		errors.VirtualFieldsError = function(message) {
			Sequelize.Error.call(this, message);
			this.name = 'SequelizeVirtualFieldsError';
		};
		util.inherits(errors.VirtualFieldsError, Sequelize.Error);

		// alias for error for backward-compatibility
		errors.SequelizeVirtualFieldsError = errors.VirtualFieldsError;

		// add errors to Sequelize
		_.extend(Sequelize, errors);
		_.extend(Sequelize.prototype, errors);
	}
};
