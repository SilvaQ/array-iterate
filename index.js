/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module array-iterate
 * @fileoverview `forEach` with the possibility to change the next position.
 */

'use strict';

/* eslint-env commonjs */

/*
 * Methods.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Callback given to `iterate`.
 *
 * @callback iterate~callback
 * @this {*} - `context`, when given to `iterate`.
 * @param {*} value - Current iteration.
 * @param {number} index - Position of `value` in `values`.
 * @param {{length: number}} values - Currently iterated over.
 * @return {number?} - Position to go to next.
 */

/**
 * `Array#forEach()` with the possibility to change
 * the next position.
 *
 * @param {{length: number}} values - Values.
 * @param {arrayIterate~callback} callback - Callback given to `iterate`.
 * @param {*?} [context] - Context object to use when invoking `callback`.
 */
function iterate(values, callback, context) {
    var index = -1;
    var result;

    if (!values) {
        throw new Error(
            'TypeError: Iterate requires that |this| ' +
            'not be ' + values
        );
    }

    if (!has.call(values, 'length')) {
        throw new Error(
            'TypeError: Iterate requires that |this| ' +
            'has a `length`'
        );
    }

    if (typeof callback !== 'function') {
        throw new Error(
            'TypeError: callback must be a function'
        );
    }

    /*
     * The length might change, so we do not cache it.
     */

    while (++index < values.length) {
        /*
         * Skip missing values.
         */

        if (!(index in values)) {
            continue;
        }

        result = callback.call(context, values[index], index, values);

        /*
         * If `callback` returns a `number`, move `index` over to
         * `number`.
         */

        if (typeof result === 'number') {
            /*
             * Make sure that negative numbers do not
             * break the loop.
             */

            if (result < 0) {
                index = 0;
            }

            index = result - 1;
        }
    }
}

/*
 * Expose.
 */

module.exports = iterate;
