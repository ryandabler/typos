"use strict";

const types = require("./constants");
const SLICE_START = '[object '.length;

/**
 * Determines the type of any JavaScript element.
 * 
 * Takes the output from Object.prototype.toString() which is of the form
 * "[object @@@@@]" and returns "@@@@@".
 * 
 * @param {*} obj Item to determine the type of
 * @returns {string}
 */
const typeOf = obj =>
    Object.prototype.toString.call(obj)
        .slice(SLICE_START, -1)

/**
 * Determines whether supplied item is iterable.
 * 
 * @param {*} obj Item to determine iterability for
 * @returns {boolean}
 */
const isIterable = obj =>
    obj ? typeOf(obj[Symbol.iterator]) === types.FUNCTION : false

/**
 * Determines whether supplied param is a primitive type.
 * @param {*} param 
 * @returns {boolean}
 */
const isPrimitive = param => isOneOf(
        types.NUMBER,
        types.STRING,
        types.NULL,
        types.UNDEFINED,
        types.BOOLEAN,
        types.SYMBOL
    )(param)

/**
 * Checks whether an arbitrary set of parameters are of the
 * same type.
 * @param {*} params Arbitrary set of parameters
 * @returns {boolean}
 */
const areSameType = (...params) =>
    params.map(typeOf)
        .reduce((accum, type) => accum.add(type), new Set())
        .size === 1

/**
 * Accepts a type and returns a function whose single parameter
 * is an item whose type should be checked against `type`
 * @param {string} type 
 * @returns {boolean}
 */
const is = type => itemToCheck => typeOf(itemToCheck) === type;

/**
 * Accepts a type and returns a variadic function whose parameters
 * are items whose type should be checked against `type`
 * @param {string} type 
 * @returns {Function}
 */
const are = type => (...itemsToCheck) => itemsToCheck.every(is(type));

/**
 * Accepts an arbitrary list of types and returns a function whose parameter
 * should be of a type in that list
 * @param {...string} types
 * @returns {Function}
 */
const isOneOf = (...types) =>
    itemToCheck => types.includes(typeOf(itemToCheck));

/**
 * Accepts an arbitrary list of types and returns a function whose parameters
 * should all be of types in that list
 * @param {...string} types
 * @returns {Function}
 */
const areOneOf = (...types) =>
    (...itemsToCheck) => itemsToCheck.every(isOneOf(...types));

/**
 * Accepts an arbitrary list of classes and returns a function whose parameter
 * should be an instance of a class in that list
 * @param {...Function} types
 * @returns {Function}
 */
const isInstanceOf = (..._classes) =>
    itemToCheck => _classes.some(_class => itemToCheck instanceof _class);

/**
 * Accepts an arbitrary list of classes and returns a function whose parameters
 * should be instances of any class in that list
 * @param {...Function} types
 * @returns {Function}
 */
const areInstancesOf = (..._classes) =>
    (...itemsToCheck) => itemsToCheck.every(isInstanceOf(..._classes));

/**
 * Accepts an arbitrary list of values and returns a function which accepts a value
 * and checks that that value exists in the enumerated list.
 * @param  {...any} enumValues 
 * @returns {Function}
 */
const isEnum = (...enumValues) => value => enumValues.some(enumValue => enumValue === value);

module.exports = {
    typeOf,
    isIterable,
    isPrimitive,
    areSameType,
    is,
    are,
    isOneOf,
    areOneOf,
    isInstanceOf,
    areInstancesOf,
    isEnum
}