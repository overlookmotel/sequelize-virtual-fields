// --------------------
// Sequelize virtual fields
// Shared functions
// --------------------

// modules
var _ = require('lodash');

// exports
module.exports = {
	mergeClauses: function mergeClauses(item, fromItem) {
		// merge attributes
		if (item.attributes) {
			item.attributes = _.union(item.attributes, fromItem.attributes);
		}
		
		// merge includes
		if (fromItem.include) {
			if (!item.include) {
				item.include = cloneIncludes(fromItem.include);
			} else {
				_.forEach(fromItem.include, function(fromInclude) {
					var toInclude = _.find(item.include, function(toInclude) {
						return toInclude.model == fromInclude.model && toInclude.as == fromInclude.as;
					});

					if (toInclude) {
						mergeClauses(toInclude, fromInclude);
					} else {
						item.include.push(cloneClause(fromInclude));
					}
				});
			}
		}
	},
	
	mergeOrders: function(orders, model) {
		var Sequelize = model.sequelize.Sequelize;
		
		for (var i = 0; i < orders.length; i++) {
			var order = orders[i],
				fromModel = (order.length > 2) ? order[order.length - 3].model : model,
				fromFieldName = order[order.length - 2],
				fromField = fromModel.attributes[fromFieldName];
			
			if (fromField.type != Sequelize.VIRTUAL) continue;
			
			var fromOrders = fromField.order;
			if (!fromOrders || fromOrders.length == 0) throw new Sequelize.SequelizeVirtualFieldsError("Order clause refers to virtual field '" + fromModel.name + "'.'" + fromFieldName + "' which has no order clause defined");
			
			// replace virtual field order clause with referenced virtual field's own order clauses
			var orderClauseBase = order.slice(0, -2);
			fromOrders.forEach(function(fromOrder) {
				var orderClause = orderClauseBase.concat(fromOrder.slice(0, -2)).map(cloneClause);
				orderClause.push(fromOrder[fromOrder.length - 2]);
				orderClause.push((fromOrder[fromOrder.length - 1] == order[order.length - 1]) ? 'ASC' : 'DESC');
				
				orders.splice(i, 0, orderClause);
				i++;
			});
			
			orders.splice(i, 1);
			i--;
		}
	}
};
