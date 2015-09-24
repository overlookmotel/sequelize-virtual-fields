// --------------------
// Sequelize virtual fields
// Instance#get replacement function
// --------------------

// modules
var _ = require('lodash');

// exports
module.exports = function(Sequelize) {
	return function(key, options) {
		var sequelize = this.sequelize;

		// if Sequelize#initVirtualFields() not called yet, display usual Sequelize behaviour
		if (!sequelize.options.virtualFields.active) return this.getVirtual(key, options);

		// parse options
		if (options == undefined && typeof key == 'object') {
			options = key;
			key = undefined;
		} else if (options == undefined) {
			options = {};
		}

		// return specific value of Instance
		if (key) {
			if (!this.dataValues.hasOwnProperty(key) && this._customGetters[key]) return this._customGetters[key].call(this);

			var value = this.dataValues[key];
			if (options.plain && this.options.include && this.options.includeNames.indexOf(key) !== -1) {
				if (Array.isArray(value)) {
					return value.map(function(instance) {
						return instance.get({plain: options.plain});
					});
				}

				if (value instanceof Sequelize.Instance) return value.get({plain: options.plain});
			}

			return value;
		}

		// return all values of Instance
		if (options.plain && this.options.include) {
			return _.mapValues(this.dataValues, function(value, key) {
				if (this.options.includeNames.indexOf(key) !== -1) {
					if (Array.isArray(value)) {
						return value.map(function(instance) {
							return instance.get({plain: options.plain});
						});
					} else if (value instanceof Sequelize.Instance) {
						return value.get({plain: options.plain});
					}
				}

				return value;
			}.bind(this));
		}

		return this.dataValues;
	};
};
