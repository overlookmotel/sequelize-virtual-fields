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
			if (!fromItem.attributes) {
				delete item.attributes;
			} else {
				item.attributes = _.union(item.attributes, fromItem.attributes);
			}
		}
		
		// merge includes
		if (fromItem.include) {
			if (!item.include) {
				item.include = fromItem.include;
			} else {
				_.forEach(fromItem.include, function(fromInclude) {
					var toInclude = _.find(item.include, function(toInclude) {
						return toInclude.model == fromInclude.model && toInclude.as == fromInclude.as;
					});

					if (toInclude) {
						mergeClauses(toInclude, fromInclude);
					} else {
						item.include.push(fromInclude);
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
			var orderClauseBase = order.slice(0, -2),
				directionReverse = order[order.length - 1] == 'DESC';
			fromOrders.forEach(function(fromOrder) {
				var orderClause = orderClauseBase.concat(fromOrder);
				if (directionReverse) orderClause[orderClause.length - 1] = ((orderClause[orderClause.length - 1] == 'ASC') ? 'DESC' : 'ASC');
				orders.splice(i, 0, orderClause);
				i++;
			});
			
			orders.splice(i, 1);
			i--;
		}
	}
};
