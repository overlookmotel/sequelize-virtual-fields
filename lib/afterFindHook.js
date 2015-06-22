// --------------------
// Sequelize virtual fields
// afterFind hook function
// --------------------

// modules
var Utils = require('sequelize').Utils,
	_ = require('lodash');

// exports
module.exports = function(results, options) {
	modifyResults(results, options);
};

function modifyResults(results, options) {
	// get values of all requested virtual fields and remove fields/includes added by beforeFind hook
	if (results == null) return;

	if (Array.isArray(results)) {
		_.forEach(results, function(item) {
			modifyFields(item, options);
		});
	} else {
		modifyFields(results, options);
	}
}

function modifyFields(item, options) {
	var virtual = options._virtual;
	if (virtual) {
		// get values of all requested virtual fields
		_.forEach(virtual.get, function(fieldName) {
			item.dataValues[fieldName] = item.get(fieldName);
		});

		// remove attributes which were added for virtual fields
		_.forEach(virtual.remove, function(fieldName) {
			delete item.dataValues[fieldName];
			_.pull(item.options.attributes, fieldName);
		});

		// remove includes which were added for virtual fields
		_.forEach(virtual.removeAssociation, function(association) {
			var model = association.model,
				index = _.findIndex(item.options.include, function(include) {
					return include.model == model && (association.as ? include.as == association.as : include.as == model.name || include.as == Utils.pluralize(model.name));
				});

			//xxx should be finding the association all the time but recent changes to Sequelize have broken this
			//xxx this line is a temporary fix to stop crashes until a permanent solution is implemented
			if (index == -1) return;

			var as = item.options.include.splice(index, 1)[0].as;

			delete item.options.includeMap[as];
			_.pull(item.options.includeNames, as);

			delete item.dataValues[as];
			delete item[as];
		});

		// update _previousDataValues to same as dataValues
		item._previousDataValues = _.clone(item.dataValues);
	}

	// iterate into includes
	if (options.include) {
		_.forEach(options.include, function(include) {
			var model = include.model;
			if (!include.as) {
				include = _.find(item.options.include, function(thisInclude) {
					return thisInclude.model == model && (thisInclude.as == model.name || thisInclude.as == Utils.pluralize(model.name));
				});
			}

			modifyResults(item[include.as], include);
		});
	}
}
