# test-utils

`test-utils` contains functions that are useful when testing plugins with Jest. These functions are not accessible yet through a module object but are instead imported on their own from the `@jspsych` organizational package. In this documentation we've divided them up based on different kinds of functionality.

## Events

### dispatchEvent

```javascript
dispatchEvent(event, target)
```

#### Parameters

Parameter | Type | Description
----------|------|------------
event | Event | The event created by `dispatchEvent`.
target | Element | DOM Element where the event happens. Default is the entire `document.body`.

#### Return value

Returns a Promise that resolves any event handlers triggered by the specified event firing on its target.

#### Description

Wrapper for DOM API method `dispatchEvent`. This fires an event on a target and allows any event handlers to finish.

#### Example

```javascript
const button = displayElement.querySelector("button")

dispatchEvent(new MouseEvent("click"), button);
```

---

### keyDown

```javascript
keyDown(key)
```

#### Parameters

Parameter | Type | Description
----------|------|------------
key | string | The `.key` property of the corresponding key on the keyboard.


#### Return value

Returns a Promise that resolves an instance of the `dispatchEvent` wrapper, where the event is the key being pressed.

#### Description

Dispatches a `'keydown'` event for the specified `key`.

#### Example

```javascript
keyDown('space')
```

---

### keyUp

```javascript
keyUp(key)
```

#### Parameters

Parameter | Type | Description
----------|------|------------
key | string | The `.key` property of the corresponding key on the keyboard.

#### Return value

Returns a Promise that resolves an instance of the `dispatchEvent` wrapper, where the event is the key being released.

#### Description

Dispatches a `'keyup'` event for the specified `key`.

#### Example

```javascript
keyUp('space')
```

---

### pressKey

```javascript
pressKey(key)
```

#### Parameters

Parameter | Type | Description
----------|------|------------
key | string | The `.key` property of the corresponding key on the keyboard.

#### Return value

Returns a Promise that resolves an instance of the `dispatchEvent` wrapper, where the event is the key being pressed and released.

#### Description

Dispatches a `'keydown'` and `'keyup'` event for the specified `key` in sequence. 

#### Example

```javascript
pressKey('space')
```

---

### mouseDownMouseUpTarget

```javascript
mouseDownMouseUpTarget(target)
```

#### Parameters

Parameter | Type | Description
----------|------|------------
target | Element | The DOM element to fire `'mousedown'` and `'mouseup'` on.


#### Return value

Returns a Promise that resolves an instance of the `dispatchEvent` wrapper, where the event is the mouse being pressed down and released on the specified target.

#### Description

Dispatches a `'mousedown'` and `'mouseup'` event on the specified `target` in sequence. 

#### Example

```javascript
const img = displayElement.querySelector("img")

mouseDownMouseUpTarget(img)
```

---

### clickTarget

```javascript
clickTarget(target)
```

#### Parameters

Parameter | Type | Description
----------|------|------------
target | Element | The DOM element to fire `'click'` on.


#### Return value

Returns a Promise that resolves an instance of the `dispatchEvent` wrapper, where the event is the mouse being clicked on the specified target.

#### Description

Dispatches a `'click'` event on the specified `target`. The function exits without dispatching the event if target is not a form element or is otherwise disabled.

#### Example

```javascript
const button = displayElement.querySelector("button")

clickTarget(button)
```

---

## Timeline

### startTimeline

```javascript
startTimeline(timeline, jsPsych)
```

#### Parameters

Parameter | Type | Description
----------|------|------------
timeline | array | An array containing the trial object(s) from which a range of plugin behaviors need to be tested. This array can contain an entire experiment timeline, or any individual parts of a larger timeline, such as specific timeline nodes and trial objects.
jsPsych | jsPsychInstance | ...

#### Return value

Returns an object containing test helper functions, the jsPsych instance, and the jsPsych display element. Helper functions include the shorthand `getHTML` for `displayElement.innerHTML`, the shorthand `getData` for `jsPsychInstance.data.get()`, the Jest helper `expectFinished` that returns `True` if the jsPsych instance is no longer running, and the Jest helper `expectRunning` that returns `True` if the jsPsych instance is running.

#### Description

Runs the given timeline by calling `jsPsych.run()` on the provided JsPsych object. The object can be either a complete timeline or isolated timeline nodes for developers to test a plugin's behavior end-to-end, between parameter configurations and timeline builds.

#### Example

```javascript
startTimeline([
  {
    type: jsPsychHTMLButtonResponsePlugin
  }
])
```

---

### simulateTimeline

```javascript
simulateTimeline(timeline, simulation_mode, simulation_options, jsPsych)
```

#### Parameters

Parameter | Type | Description
----------|------|------------
timeline | array | An array containing the trial object(s) from which a range of plugin behaviors need to be tested. This array can contain an entire experiment timeline, or any individual parts of a larger timeline, such as specific timeline nodes and trial objects.
simulation_mode | `"data-only"` or `"visual"` | Either 'data-only' mode or 'visual' mode.
simulation_options | object | Options to pass to [`jsPsych.simulate()`](../overview/simulation#controlling-simulation-mode-with-simulation_options)
jsPsych | jsPsychInstance | The jsPsych instance to be used. If left empty, a new instance will be created. If a settings object is passed instead, the settings will be used to create the jsPsych instance.

#### Return value

Returns an object containing test helper functions, the jsPsych instance, and the jsPsych display element.

#### Description

Runs the given timeline by calling `jsPsych.simulate()` on the provided JsPsych object.

#### Example

```javascript
simulateTimeline(
  timeline: ([
    {

    }
  ]),
  simulation_mode?: "data-only",
  simulation_options: {
    //
  }
)
```

---