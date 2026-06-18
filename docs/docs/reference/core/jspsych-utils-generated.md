---
title: jsPsych.utils (generated v5)
---

> :white_check_mark: **Progressive-disclosure layout, muted spec block.** Description + example lead; TypeScript types collapsed into a theme-matched, de-emphasized block.


General-purpose utility functions used throughout jsPsych and available for
use in your own experiments via `jsPsych.utils`.

## jsPsych.utils.deepCopy()

```js
jsPsych.utils.deepCopy(obj)
```

Recursively copies a value so that nested objects and arrays are duplicated
rather than shared by reference. Primitive values are returned unchanged.

### Example

```js
const original = { nested: ["array", "of", "elements"] };
const copy = jsPsych.utils.deepCopy(original);
copy.nested[2] = "thingies";
console.log(original.nested[2]); // still logs "elements"
```

### Parameters

| Parameter | Description |
| ------ | ------ |
| `obj` | The object, array, or primitive value to copy |

### Returns

A deep copy of `obj`

<details className="api-types">
<summary>TypeScript signature and types</summary>

```ts
function deepCopy<T>(obj): T
```

**Type parameters**

- `T` — The type of the value being copied; the return value has the same type.

**Parameter types**

- `obj`: `T`

**Returns:** `T`

Defined in: [utils.ts:40](https://github.com/jspsych/jsPsych/blob/main/packages/jspsych/src/modules/utils.ts#L40)

</details>

## jsPsych.utils.deepMerge()

```js
jsPsych.utils.deepMerge(obj1, obj2)
```

Recursively merges two objects into a new object. When both objects define
the same (possibly nested) property, the value from `obj2` takes precedence.

### Example

```js
const object1 = { a: 1, b: { c: 1, d: 2 } };
const object2 = { b: { c: 2 }, e: 3 };
jsPsych.utils.deepMerge(object1, object2); // returns { a: 1, b: { c: 2, d: 2 }, e: 3 }
```

### Parameters

| Parameter | Description |
| ------ | ------ |
| `obj1` | The base object |
| `obj2` | The object whose properties override and extend `obj1` |

### Returns

A new object with the deeply-merged properties of `obj1` and `obj2`

<details className="api-types">
<summary>TypeScript signature and types</summary>

```ts
function deepMerge(obj1, obj2): Record<string, any>
```

**Parameter types**

- `obj1`: `Record`\<`string`, `any`\>
- `obj2`: `Record`\<`string`, `any`\>

**Returns:** `Record`\<`string`, `any`\>

Defined in: [utils.ts:77](https://github.com/jspsych/jsPsych/blob/main/packages/jspsych/src/modules/utils.ts#L77)

</details>

## jsPsych.utils.unique()

```js
jsPsych.utils.unique(arr)
```

Finds all of the unique items in an array.

### Example

```js
jsPsych.utils.unique(["a", "b", "b", 1, 1, 2]); // returns ["a", "b", 1, 2]
```

### Parameters

| Parameter | Description |
| ------ | ------ |
| `arr` | The array to extract unique values from |

### Returns

A new array containing one copy of each unique item in `arr`

<details className="api-types">
<summary>TypeScript signature and types</summary>

```ts
function unique<T>(arr): T[]
```

**Type parameters**

- `T` — The type of the elements in `arr` (inferred from the argument).

**Parameter types**

- `arr`: `T`[]

**Returns:** `T`[]

Defined in: [utils.ts:20](https://github.com/jspsych/jsPsych/blob/main/packages/jspsych/src/modules/utils.ts#L20)

</details>
