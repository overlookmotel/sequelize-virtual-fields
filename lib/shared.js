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
	}
};
