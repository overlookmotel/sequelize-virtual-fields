// --------------------
// Sequelize virtual fields
// Sequelize#initVirtualFields() method
// --------------------

// modules
var _ = require('lodash'),
	toposort = require('toposort-extended');

// imports
var shared = require('./shared'),
	mergeClauses = shared.mergeClauses,
	mergeOrders = shared.mergeOrders,
	patchesFn = require('./patches');

// exports
module.exports = function(Sequelize) {
	var patches = patchesFn(Sequelize);

	// return `Sequelize.prototype.initVirtualFields()` method
	return function(options) {
		// record options in sequelize
		options = options || {};
		options.active = true;
		this.options.virtualFields = options;

		// parse virtual fields for all models
		var models = this.models;
		_.forIn(models, function(model) {
			_.forEach(model.attributes, function(field, fieldName) {
				if (field.type instanceof Sequelize.VIRTUAL) parseField(field, fieldName, model);
			});
		});

		// inherit attributes, include and order where virtual fields refer to other virtual fields
		inheritInclude(models);
		inheritOrder(models);

		// return sequelize (for chaining)
		return this;
	};

	// ----------
	// functions

	// parse a virtual field to check attributes, include and order are valid
	function parseField(field, fieldName, model) {
		// parse & check attributes and include
		parseIncludes(field, fieldName, model.name, model);

		// parse & check order
		parseOrders(field, fieldName, model);
	}

	// parses attributes and include
	// ensuring attributes & includes are valid, formatting includes in {model: model} format
	// and checking associations between models are valid
	function parseIncludes(field, fieldName, modelName, parent) {
		// check all attributes are strings and valid fields
		if (!field.attributes) {
			field.attributes = [];
		} else {
			if (!Array.isArray(field.attributes)) field.attributes = [field.attributes];

			_.forEach(field.attributes, function(attribute) {
				if (!_.isString(attribute)) throw new Sequelize.VirtualFieldsError("Attribute of virtual field '" + modelName + "'.'" + fieldName + "' is not a string");

				if (!parent.attributes[attribute]) throw new Sequelize.VirtualFieldsError("Attribute of virtual field '" + modelName + "'.'" + fieldName + "' refers to a nonexistent field '" + parent.name + "'.'" + attribute + "'");
			});
		}

		// format includes as {model: model, as: as} and convert strings to models
		if (field.include) {
			if (!Array.isArray(field.include)) field.include = [field.include];

			_.forEach(field.include, function(include, index) {
				include = parseClause(field.include, index, 'Include', modelName, fieldName, parent);

				parseIncludes(include, fieldName, modelName, include.model);
			});
		}
	}

	// parses order attribute converting all models to {model: model} format, adding ASC/DESC order
	// and checking attributes are valid and model associations are valid
	function parseOrders(field, fieldName, model) {
		var orders = field.order;
		if (!orders) return;
		if (!Array.isArray(orders)) orders = field.order = [orders];

		_.forEach(orders, function(order, index) {
			// if just a string, leave alone - is raw query
			if (_.isString(order)) return;

			// if an object (e.g. {raw: ...}), add 'ASC' sort order
			if (!Array.isArray(order)) {
				orders[index] = [order, 'ASC'];
				return;
			}

			// add 'ASC' sort order if no sort order defined
			if (order.length == 0) throw new Sequelize.VirtualFieldsError("Invalid virtual field order in '" + model.name + "'.'" + fieldName + "'");
			if (order.length == 1) {
				order[1] = 'ASC';
			} else {
				// ensure direction is ASC or DESC
				if (['ASC', 'DESC'].indexOf(order[order.length - 1].toUpperCase()) == -1) {
					order.push('ASC');
				} else {
					order[order.length - 1] = order[order.length - 1].toUpperCase();
				}
			}

			// make preceeding models into {model: model} form
			var parent = model;
			for (var i = 0; i < order.length - 2; i++) {
				parseClause(order, i, 'Order', model.name, fieldName, parent);
				parent = order[i].model;
			}

			// check attribute is valid
			var attribute = order[order.length - 2];
			if (_.isString(attribute) && !parent.attributes[attribute]) throw new Sequelize.VirtualFieldsError("Order of virtual field '" + model.name + "'.'" + fieldName + "' refers to a nonexistent field '" + parent.name + "'.'" + attribute + "'");
		});
	}

	// formats a clause into {model: model} format
	// and checks association to parent is valid
	function parseClause(array, index, clauseType, modelName, fieldName, parent) {
		var item = array[index];

		if (_.isString(item) || patches.isModel(item)) {
			item = array[index] = {model: item};
		} else if (!item.model) {
			throw new Sequelize.VirtualFieldsError(clauseType + " of virtual field '" + modelName + "'.'" + fieldName + "' is invalid");
		}

		if (_.isString(item.model)) {
			var model = parent.sequelize.models[item.model];
			if (!model) throw new Sequelize.VirtualFieldsError(clauseType + " of virtual field '" + modelName + "'.'" + fieldName + "' points to unknown model '" + item.model + "'");
			item.model = model;
		} else if (!patches.isModel(item.model)) {
			throw new Sequelize.VirtualFieldsError(clauseType + " of virtual field '" + modelName + "'.'" + fieldName + "' is invalid");
		}

		if (item.as !== undefined && !_.isString(item.as)) throw new Sequelize.VirtualFieldsError(clauseType + " of virtual field '" + modelName + "'.'" + fieldName + "' has invalid as clause '" + item.as + "'");

		// check if is valid association from parent
		if (!parent.getAssociation(item.model, item.as)) throw new Sequelize.VirtualFieldsError(clauseType + " of virtual field '" + modelName + "'.'" + fieldName + "' includes invalid association from '" + parent.name + "' to '" + item.model.name + (item.as ? ' (' + item.as + ')' : '') + "'");

		return item;
	}

	function inheritInclude(models) {
		// find virtual fields that refer to other virtual fields
		var dependencies = [];
		_.forIn(models, function(model, modelName) {
			_.forEach(model.attributes, function(field, fieldName) {
				if (!(field.type instanceof Sequelize.VIRTUAL)) return;

				(function findVirtual(field, thisModel) {
					_.forEach(field.attributes, function(thisFieldName) {
						if (thisModel.attributes[thisFieldName].type instanceof Sequelize.VIRTUAL) {
							dependencies.push([
								{model: modelName, field: fieldName},
								{model: thisModel.name, field: thisFieldName}
							]);
						}
					});

					_.forEach(field.include, function(include) {
						findVirtual(include, include.model);
					});
				})(field, model);
			});
		});

		// order fields in order of dependency + check for circular dependency
		try {
			dependencies = toposort.dependents(dependencies).reverse();
		} catch(err) {
			if (!(err instanceof toposort.Error)) throw err;
			throw new Sequelize.VirtualFieldsError("Circular dependency in virtual fields at '" + err.edge.model + "'.'" + err.edge.field + "'");
		}

		// extend definition of virtual fields to include dependent attributes and includes
		_.forEach(dependencies, function(dependent) {
			var model = models[dependent.model],
				field = model.attributes[dependent.field];

			(function mergeVirtual(field, model) {
				for (var i = 0; i < field.attributes.length; i++) {
					var referencedField = model.attributes[field.attributes[i]];
					if (referencedField.type instanceof Sequelize.VIRTUAL) {
						field.attributes.splice(i, 1);
						i--;

						mergeClauses(field, referencedField);
					}
				}

				_.forEach(field.include, function(include) {
					mergeVirtual(include, include.model);
				});
			})(field, model);
		});
	}

	function inheritOrder(models) {
		// extend order clauses where refer to virtual fields
		var dependencies = [];
		_.forIn(models, function(model, modelName) {
			_.forEach(model.attributes, function(field, fieldName) {
				if (!(field.type instanceof Sequelize.VIRTUAL) || !field.order) return;

				_.forEach(field.order, function(order) {
					var orderModel = (order.length > 2) ? order[order.length - 3].model : model,
						orderFieldName = order[order.length - 2];

					if (orderModel.attributes[orderFieldName].type instanceof Sequelize.VIRTUAL) {
						dependencies.push([
							{model: modelName, field: fieldName},
							{model: orderModel.name, field: orderFieldName}
						]);
					}
				});
			});
		});

		// order fields in order of dependency + check for circular dependency
		try {
			dependencies = toposort.dependents(dependencies).reverse();
		} catch(err) {
			if (!(err instanceof toposort.Error)) throw err;
			throw new Sequelize.VirtualFieldsError("Circular dependency in virtual fields at '" + err.edge.model + "'.'" + err.edge.field + "' in order clause");
		}

		// replace order clauses referring to virtual fields with real fields
		_.forEach(dependencies, function(dependent) {
			var model = models[dependent.model],
				fieldName = dependent.field,
				orders = model.attributes[fieldName].order;

			try {
				mergeOrders(orders, model);
			} catch(err) {
				if (!(err instanceof Sequelize.VirtualFieldsError)) throw err;
				throw new Sequelize.VirtualFieldsError("Order clause in virtual field '" + model.name + "'.'" + fieldName + "'" + err.message.slice(12));
			}
		});
	}
};
