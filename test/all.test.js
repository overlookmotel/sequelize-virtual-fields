// --------------------
// Sequelize virtual fields
// Tests
// --------------------

// modules
var chai = require('chai'),
	expect = chai.expect,
	promised = require('chai-as-promised'),
	Support = require(__dirname + '/support'),
	Sequelize = Support.Sequelize,
	Promise = Sequelize.Promise,
	Utils = Sequelize.Utils,
	_ = Utils._;

// init

chai.use(promised);
chai.config.includeStack = true;

// tests

describe(Support.getTestDialectTeaser('Tests'), function () {
});
