# Changelog

## 0.0.1

* Initial release

## 0.1.0

* Sequelize#initVirtualFields() method
* Tests for Sequelize#initVirtualFields() method
* Model#find() automatically loads attributes and includes needed by virtual fields
* Model#find() can order by virtual fields
* Tests for Model#find()

## 0.1.1

* `npm test` runs tests on all dialects
* Updated README

## 0.1.2

* Bug fixes
* JSHint included in tests
* Set versions for mocha & chai dependencies
* Travis integration
* Updated README

## 0.1.3

* Updated README

## 0.1.4

* Travis loads sequelize dependency from Github repo master branch not npm
* Tests db user sequelize_test
* Travis uses db user travis
* Updated README

## 0.1.5

* Tests amended to handle all SQL dialects

## 0.2.0

Major change to behaviour.
Now working on all Sequelize dialects.

* Virtual fields populated in `dataValues` before returning results from `Model#find()` and dependent attributes/includes removed from result
* Travis tests both master and dev branches
* README update

## 0.2.1

* `Instance#get()` behaves as normal until `Sequelize#initVirtualFields()` is called

## 0.2.2

* [FIX] Correctly handles plural results for includes

## 0.2.3

* [FIX] Handle empty result sets
* Update db library dependencies in line with Sequelize
* Refactor code in `afterFind` hook
* Amend travis config file to use `npm install` to install Sequelize's dependencies after getting latest master from git
* Added `editorconfig` file

## 0.2.4

* Error thrown in beforeFind hook if try to reference a non-existent field in virtual field definition

## 0.2.5

* Error thrown in mergeOrders if try to reference a non-existent field in virtual field definition
* Convert order by models to {model: model} form

## 0.2.6

* Specify to use latest Sequelize version from Github in package.json rather than .travis.yml

## 0.2.7

* Updated sequelize dependency to v2.0.0-rc3

## 0.2.8

* Temporary fix for failing removal of virtually included includes
* JSHint ignores redefinition of `Promise`

## 0.2.9

* Lock sequelize dependency to 2.0.0-rc3 (errors with rc4)

## 0.2.10

* Lock sequelize dev dependency to 2.0.0-rc3

## 0.2.11

* Update sequelize dependency to v2.0.0+
* Update dev dependencies in line with sequelize v2.0.5
* Update test support files in line with sequelize v2.0.5
* Field type conditionals use instanceof
* Partial support for Microsoft SQL Server
* Code tidy in test/support.js
* Remove trailing tabs
* Travis runs tests against node 0.10 and 0.12
* Travis uses correct database users
* Travis runs on new container infrastructure
* README code examples tagged as Javascript

## 0.2.12

* Loosen sequelize dependency version to v2.x.x
* Update mysql module dependency in line with sequelize v2.1.0
* Update lodash dependency
* Update dev dependencies
* Specify toposort-extended dependency version
* Remove reliance on `.on()` in tests (support for `.on()` removed in sequelize v2.1.0)
* Remove unused utils functions
* README contribution section

## 0.2.13

* Remove relative path to sequelize in tests

## 0.3.0

* Support for Sequelize v3.x.x
* Update dependencies
* Update dev dependencies in line with Sequelize v3.2.0
* Travis runs tests with Sequelize v3 and v2
* Test code coverage & Travis sends to coveralls
* Run jshint on tests
* Disable Travis dependency cache
* Update README badges to use shields.io

## 0.3.1

* Get Utils direct from Sequelize

## 0.3.2

* MSSQL config for tests

## 0.3.3

* Use `Sequelize.version` for version number where available (closes #5)
* Update dependency mysql in line with Sequelize v3.8.0
* Update dependency lodash
* Update dependency toposort-extended
* Update dev dependencies

## 0.3.4

* Patch for `instance.options` renamed `$options` in Sequelize v3.9.0
* Use `Utils` from passed Sequelize instance
* Update `semver-select` dependency
* Update dev dependencies

## 0.3.5

* Use `instance.options` patch in `instanceGet`
* Use Sequelize instance in `instanceGet`

## 0.3.6

* Rename `SequelizeVirtualFieldsError` to `VirtualFieldsError`
* Documentation for errors

## 0.3.8

* Update `lodash` dependency
* Update dev dependencies
* Replace `Makefile` with npm scripts
* Travis CI runs on node v4 + v6
* Travis CI runs on all branches except release tags (to support `greenkeeper.io`)
* `.DS_Store` in `.gitignore`
* Update `.npmignore`
* README update
* Update license

## 1.0.0

* Support only Node v4 upwards
* Support Sequelize v4.x.x
* Refactor `lib/errors` to be function not object
* Refactor `lib/init` to be function returning function
* Refactor `lib/beforeFindHook` to be function returning function
* Drop testing on Travis CI for `mariadb` + `mssql` dialects

## 1.1.0

* Remove Sequelize peer dependency to fix Travis fails
* Code comments

## 1.1.1

* Don't mutate virtual field's includes [fix]
* Dev: Remove Travis CI
* Dev: Update `editorconfig`
* Docs: Update license year
* Docs: Remove license indent
