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

## Next

* Update db library dependencies in line with Sequelize
