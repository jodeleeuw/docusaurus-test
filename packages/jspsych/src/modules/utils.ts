/**
 * General-purpose utility functions used throughout jsPsych and available for
 * use in your own experiments via `jsPsych.utils`.
 *
 * @module
 */

/**
 * Finds all of the unique items in an array.
 *
 * @typeParam T - The type of the elements in `arr` (inferred from the argument).
 * @param arr The array to extract unique values from
 * @returns A new array containing one copy of each unique item in `arr`
 *
 * @example
 * ```js
 * jsPsych.utils.unique(["a", "b", "b", 1, 1, 2]); // returns ["a", "b", 1, 2]
 * ```
 */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

/**
 * Recursively copies a value so that nested objects and arrays are duplicated
 * rather than shared by reference. Primitive values are returned unchanged.
 *
 * @typeParam T - The type of the value being copied; the return value has the same type.
 * @param obj The object, array, or primitive value to copy
 * @returns A deep copy of `obj`
 *
 * @example
 * ```js
 * const original = { nested: ["array", "of", "elements"] };
 * const copy = jsPsych.utils.deepCopy(original);
 * copy.nested[2] = "thingies";
 * console.log(original.nested[2]); // still logs "elements"
 * ```
 */
export function deepCopy<T>(obj: T): T {
  if (!obj) return obj;
  let out;
  if (Array.isArray(obj)) {
    out = [];
    for (const x of obj) {
      out.push(deepCopy(x));
    }
    return out;
  } else if (typeof obj === "object" && obj !== null) {
    out = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        out[key] = deepCopy(obj[key]);
      }
    }
    return out;
  } else {
    return obj;
  }
}

/**
 * Recursively merges two objects into a new object. When both objects define
 * the same (possibly nested) property, the value from `obj2` takes precedence.
 *
 * @param obj1 The base object
 * @param obj2 The object whose properties override and extend `obj1`
 * @returns A new object with the deeply-merged properties of `obj1` and `obj2`
 *
 * @example
 * ```js
 * const object1 = { a: 1, b: { c: 1, d: 2 } };
 * const object2 = { b: { c: 2 }, e: 3 };
 * jsPsych.utils.deepMerge(object1, object2); // returns { a: 1, b: { c: 2, d: 2 }, e: 3 }
 * ```
 */
export function deepMerge(obj1: Record<string, any>, obj2: Record<string, any>): Record<string, any> {
  let merged: Record<string, any> = {};
  for (const key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      if (typeof obj1[key] === "object" && obj2.hasOwnProperty(key)) {
        merged[key] = deepMerge(obj1[key], obj2[key]);
      } else {
        merged[key] = obj1[key];
      }
    }
  }
  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (!merged.hasOwnProperty(key)) {
        merged[key] = obj2[key];
      } else if (typeof obj2[key] === "object") {
        merged[key] = deepMerge(merged[key], obj2[key]);
      } else {
        merged[key] = obj2[key];
      }
    }
  }

  return merged;
}
