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
	_ = require('lodash');

// imports
var utils = require('../lib/utils');

// init
chai.use(promised);
chai.config.includeStack = true;

// tests

describe(Support.getTestDialectTeaser('Tests'), function () {
	describe('#initVirtualFields', function() {
		describe('parses', function() {
			beforeEach(function() {
				this.Company = this.sequelize.define('Company', {
					name: Sequelize.STRING
				});

				this.Person = this.sequelize.define('Person', {
					name: Sequelize.STRING
				});

				this.Task = this.sequelize.define('Task', {
					name: Sequelize.STRING,
					virt: {
						type: Sequelize.VIRTUAL,
						attributes: 'name',
						include: {model: 'Person', attributes: 'name', include: {model: 'Company', attributes: 'name'}},
						order: [['name'], ['Person', 'name'], ['Person', 'Company', 'name']]
					}
				});

				this.Person.belongsTo(this.Company);
				this.Company.hasMany(this.Person);

				this.Task.belongsTo(this.Person);
				this.Person.hasMany(this.Task);

				this.sequelize.initVirtualFields();
			});

			it('attributes and include', function() {
				expect(this.Task.attributes.virt.attributes).to.deep.equal(['name']);
				expect(this.Task.attributes.virt.include).to.deep.equal([{
					model: this.Person,
					attributes: ['name'],
					include: [{
						model: this.Company,
						attributes: ['name']
					}]
				}]);
			});

			it('order', function() {
				expect(this.Task.attributes.virt.order).to.deep.equal([
					['name', 'ASC'],
					[{model: this.Person}, 'name', 'ASC'],
					[{model: this.Person}, {model: this.Company}, 'name', 'ASC']
				]);
			});
		});

		describe('resolves', function() {
			beforeEach(function() {
				this.Company = this.sequelize.define('Company', {
					name: Sequelize.STRING,
					virt: {
						type: Sequelize.VIRTUAL,
						attributes: ['name'],
						order: [['name']]
					}
				});

				this.Person = this.sequelize.define('Person', {
					name: Sequelize.STRING,
					virt: {
						type: Sequelize.VIRTUAL,
						attributes: ['name'],
						include: {model: 'Company', attributes: ['virt']},
						order: [['name'], ['Company', 'virt']]
					}
				});

				this.Task = this.sequelize.define('Task', {
					name: Sequelize.STRING,
					virt: {
						type: Sequelize.VIRTUAL,
						attributes: ['name'],
						include: {model: 'Person', attributes: ['virt']},
						order: [['name'], ['Person', 'virt']]
					},
					virt2: {
						type: Sequelize.VIRTUAL,
						attributes: ['virt'],
						order: [['virt']]
					}
				});

				this.Person.belongsTo(this.Company);
				this.Company.hasMany(this.Person);

				this.Task.belongsTo(this.Person);
				this.Person.hasMany(this.Task);

				this.sequelize.initVirtualFields();
			});

			it('attributes/include referring to virtual fields', function() {
				expect(this.Task.attributes.virt2.attributes).to.deep.equal(['name']);
				expect(this.Task.attributes.virt2.include).to.deep.equal([{
					model: this.Person,
					attributes: ['name'],
					include: [{
						model: this.Company,
						attributes: ['name']
					}]
				}]);
			});

			it('order referring to virtual fields', function() {
				expect(this.Task.attributes.virt2.order).to.deep.equal([
					['name', 'ASC'],
					[{model: this.Person}, 'name', 'ASC'],
					[{model: this.Person}, {model: this.Company}, 'name', 'ASC']
				]);
			});
		});

		describe('throws error on', function() {
			it('nonexistent attribute', function() {
				this.Task = this.sequelize.define('Task', {
					virt: {
						type: Sequelize.VIRTUAL,
						attributes: 'name'
					}
				});

				expect(function() {
					this.sequelize.initVirtualFields();
				}.bind(this)).to.throw(Sequelize.SequelizeVirtualFieldsError, "Attribute of virtual field 'Task'.'virt' refers to a nonexistent field 'Task'.'name'");
			});

			it('nonexistent model', function() {
				this.Task = this.sequelize.define('Task', {
					virt: {
						type: Sequelize.VIRTUAL,
						include: 'Foo'
					}
				});

				expect(function() {
					this.sequelize.initVirtualFields();
				}.bind(this)).to.throw(Sequelize.SequelizeVirtualFieldsError, "Include of virtual field 'Task'.'virt' points to unknown model 'Foo'");
			});

			it('nonexistent attribute on included model', function() {
				this.Person = this.sequelize.define('Person', {
					name: Sequelize.STRING
				});

				this.Task = this.sequelize.define('Task', {
					virt: {
						type: Sequelize.VIRTUAL,
						include: {model: 'Person', attributes: ['foo']}
					}
				});

				this.Task.belongsTo(this.Person);
				this.Person.hasMany(this.Task);

				expect(function() {
					this.sequelize.initVirtualFields();
				}.bind(this)).to.throw(Sequelize.SequelizeVirtualFieldsError, "Attribute of virtual field 'Task'.'virt' refers to a nonexistent field 'Person'.'foo'");
			});

			it('un-associated model', function() {
				this.Person = this.sequelize.define('Person', {
					name: Sequelize.STRING
				});

				this.Task = this.sequelize.define('Task', {
					virt: {
						type: Sequelize.VIRTUAL,
						include: {model: 'Person', attributes: ['name']}
					}
				});

				expect(function() {
					this.sequelize.initVirtualFields();
				}.bind(this)).to.throw(Sequelize.SequelizeVirtualFieldsError, "Include of virtual field 'Task'.'virt' includes invalid association from 'Task' to 'Person'");
			});

			it('un-associated model with as', function() {
				this.Person = this.sequelize.define('Person', {
					name: Sequelize.STRING
				});

				this.Task = this.sequelize.define('Task', {
					virt: {
						type: Sequelize.VIRTUAL,
						include: {model: 'Person', attributes: ['name']}
					}
				});

				this.Task.belongsTo(this.Person, {as: 'Owner'});
				this.Person.hasMany(this.Task);

				expect(function() {
					this.sequelize.initVirtualFields();
				}.bind(this)).to.throw(Sequelize.SequelizeVirtualFieldsError, "Include of virtual field 'Task'.'virt' includes invalid association from 'Task' to 'Person'");
			});

			it('circular dependency', function() {
				this.Person = this.sequelize.define('Person', {
					name: Sequelize.STRING,
					virt: {
						type: Sequelize.VIRTUAL,
						include: {model: 'Task', attributes: ['virt']}
					}
				});

				this.Task = this.sequelize.define('Task', {
					virt: {
						type: Sequelize.VIRTUAL,
						include: {model: 'Person', attributes: ['virt']}
					},
					virt2: {
						type: Sequelize.VIRTUAL,
						include: {model: 'Person', attributes: ['name']}
					}
				});

				this.Task.belongsTo(this.Person);
				this.Person.hasMany(this.Task);

				expect(function() {
					this.sequelize.initVirtualFields();
				}.bind(this)).to.throw(Sequelize.SequelizeVirtualFieldsError, "Circular dependency in virtual fields at 'Task'.'virt'");
			});
		});
	});

	describe('find', function() {
		beforeEach(function() {
			this.Company = this.sequelize.define('Company', {
				name: Sequelize.STRING,
				virt: {
					type: Sequelize.VIRTUAL,
					get: function() { return this.get('name'); },
					attributes: ['name'],
					order: [['name']]
				}
			});

			this.Person = this.sequelize.define('Person', {
				name: Sequelize.STRING,
				virt: {
					type: Sequelize.VIRTUAL,
					get: function() { return this.get('name') + ' - ' + this.Company.get('virt'); },
					attributes: ['name'],
					include: {model: 'Company', attributes: ['virt']},
					order: [['name'], ['Company', 'virt']]
				}
			});

			this.Task = this.sequelize.define('Task', {
				name: Sequelize.STRING,
				virt: {
					type: Sequelize.VIRTUAL,
					get: function() { return this.get('name') + ' - ' + this.Person.get('virt'); },
					attributes: ['name'],
					include: {model: 'Person', attributes: ['virt']},
					order: [['name'], ['Person', 'virt']]
				},
				virt2: {
					type: Sequelize.VIRTUAL,
					get: function() { return this.get('virt'); },
					attributes: ['virt'],
					order: [['virt']]
				}
			});

			this.Person.belongsTo(this.Company);
			this.Company.hasMany(this.Person);

			this.Task.belongsTo(this.Person);
			this.Person.hasMany(this.Task);

			this.sequelize.initVirtualFields();

			return Promise.bind(this).then(function() {
				return this.sequelize.sync();
			}).then(function() {
				return Promise.props({
					company: this.Company.create({name: 'company'}),
					person: this.Person.create({name: 'person'}),
					task: this.Task.create({name: 'task'})
				});
			}).then(function(results) {
				_.extend(this, results);

				return Promise.all([
					this.task.setPerson(this.person),
					this.person.setCompany(this.company)
				]);
			});
		});

		it('replaces virtual fields in attributes', function() {
			return this.Task.find({where: {name: 'task'}, attributes: ['virt2']})
			.then(function(task) {
				expect(task.virt2).to.equal('task - person - company');
			});
		});

		it('replaces virtual fields in order', function() {
			var expectedSql = ({
				mysql: 'ORDER BY `Task`.`name` ASC, `Person`.`name` ASC, `Person.Company`.`name` ASC LIMIT 1;',
				sqlite: 'ORDER BY `Task`.`name` ASC, `Person`.`name` ASC, `Person.Company`.`name` ASC LIMIT 1;',
				postgres: 'ORDER BY "Task"."name" ASC, "Person"."name" ASC, "Person.Company"."name" ASC LIMIT 1;',
				mariadb: 'ORDER BY `Task`.`name` ASC, `Person`.`name` ASC, `Person.Company`.`name` ASC LIMIT 1;'
			})[Support.getTestDialect()];

			return this.Task.find({where: {name: 'task'}, attributes: ['virt2'], order: [['virt2']]})
			.on('sql', function(sql) {
				expect(utils.endsWith(sql, expectedSql)).to.be.true;
			});
		});
	});
});
