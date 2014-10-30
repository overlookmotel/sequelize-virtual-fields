// --------------------
// Sequelize virtual fields
// Instance#get replacement function
// --------------------

// modules
var _ = require('lodash');

// exports
module.exports = function(key, options) {
	var Sequelize = this.sequelize.Sequelize;
	
	if (options == undefined && typeof key == 'object') {
		options = key;
		key = undefined;
	} else if (options == undefined) {
		options = {};
	}
	
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
