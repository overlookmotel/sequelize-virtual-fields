// --------------------
// Sequelize virtual fields
// Errors - ES6 version using subclassing for Sequelize v4
// In separate file to avoid error when run on Node before v4
// --------------------

'use strict';

/* jshint esnext:true */

// exports
module.exports = function(Sequelize) {
	// define errors
	class VirtualFieldsError extends Sequelize.Error {
		constructor(message) {
			super(message);
			this.name = 'VirtualFieldsError';
		}
	}

	return {VirtualFieldsError};
};
