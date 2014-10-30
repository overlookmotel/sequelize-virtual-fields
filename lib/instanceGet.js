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
		if (this._customGetters[key]) return this._customGetters[key].call(this, key);
		
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
	
	if (this._hasCustomGetters || (options.plain && this.options.include)) {
		var values = {};
		
		if (this._hasCustomGetters) {
			_.forIn(this._customGetters, function(func, key) { // jshint ignore:line
				values[key] = this.get(key);
			}.bind(this));
		}
		
		_.forIn(this.dataValues, function(value, key) {
			if (values.hasOwnProperty(key)) return;
			
			if (options.plain && this.options.include && this.options.includeNames.indexOf(key) !== -1) {
				if (Array.isArray(value)) {
					value = value.map(function(instance) {
						return instance.get({plain: options.plain});
					});
				} else if (value instanceof Sequelize.Instance) {
					value = value.get({plain: options.plain});
				}
			}
			
			values[key] = value;
		}.bind(this));
		
		return values;
	}
	
	return this.dataValues;
};
