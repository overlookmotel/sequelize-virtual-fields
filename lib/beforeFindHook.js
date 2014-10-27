// --------------------
// Sequelize virtual fields
// beforeFind hook function
// --------------------

// modules
var _ = require('lodash');

// imports
var shared = require('./shared'),
	mergeClauses = shared.mergeClauses;

// exports
module.exports = function(Sequelize) {
	return function(options) {
		var model = this,
			sequelize = model.sequelize;
		
		if (!sequelize.options.virtualFields.active) return;
		
		replaceVirtualFields(options, model);
	}
	
	// ----------
	// functions
	
	function replaceVirtualFields(options, model) {
		if (options.attributes) {
			for (var i = 0; i < options.attributes.length; i++) { // not using _.forEach as array is altered during looping
				var fieldName = options.attributes[i],
					field = model.attributes[fieldName];
				
				if (field.type != Sequelize.VIRTUAL) continue;
				
				// field is virtual - add attributes & includes from virtualField
				addVirtualFieldOptions(options, field, fieldName);
			
				// delete virtual attribute
				options.attributes.splice(i, 1);
				i--;
			}
		} else {
			// no attributes specified - all attributes of model will load so check all virtualFields
			_.forIn(model.attributes, function(field, fieldName) {
				if (field.type != Sequelize.VIRTUAL) return;
				
				// add attributes & includes from virtual field
				addVirtualFieldOptions(options, field, fieldName);
			});
		}
		
		// repeat process for all includes recursively
		var includes = options.include;
		if (includes) {
			_.forEach(includes, function(include, index) {
				// if include given as model with no attributes/include, convert to {model: model} notation
				if (include instanceof Sequelize.Model) include = includes[index] = {model: include};
				
				// recurse through this include
				replaceVirtualFields(include, include.model);
			});
		}
	};
	
	function addVirtualFieldOptions(options, field, fieldName) {
		// record in options.virtuals
		options.virtuals = options.virtuals || [];
		options.virtuals.push(fieldName);
		
		// merge attributes + includes from virtual field
		mergeClauses(options, field);
	}
};
