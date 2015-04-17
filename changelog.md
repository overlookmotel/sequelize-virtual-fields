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

## Next

* Update sequelize dependency to v2.0.0+
* Update dev dependencies in line with sequelize v2.0.5
* Update test support files in line with sequelize v2.0.5
* Field type conditionals use instanceof
* Code tidy in test/support.js
* Remove trailing tabs
* Travis runs tests against node 0.10 and 0.12
* Travis uses correct database users
* Travis runs on new container infrastructure
* README code examples tagged as Javascript
