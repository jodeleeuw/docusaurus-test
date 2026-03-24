# Plugin Development

This tutorial will walk through plugin development for jspsych-contrib, using a very simple example. We'll go step-by-step through writing a plugin that records mindless clicking data from a given participant. This simple demonstration will highlight key open-science principles behind what makes a distributable plugin, including:

- Setting up the developer environment with npm
- Blocking out timelineUnits and utils as exportable components
- Building the .createTimeline() export
- Designing parameters for configuring versions of the same task
- Testing builds
- Preparing documentation
- Finalizing a pull request with jspsych-timeline using GitHub

## Overview of `index.ts`

Our `index.ts` can be split into two modifiable sections: the `const info` and `class MindlessClickingPlugin`.

`info` is a constant that contains all of the plugin's metadata. This includes its package name, the plugin version, citations, and all inputs and outputs. Inputs are described in the `parameters` object, while `outputs` are described in the `data` object. 

```javascript
const info = <const>{
	name: "plugin-mindless-clicking",
	version: version,
	parameters: {
		//
	},
	data: {
		//
	},
	citations: '__CITATIONS__'
}
```

Both `parameters` and `data` are unique `info` objects because they're also used to automatically generate with plugin documentation, once merged into our repository. Notes for documentation are demarcated using a docstrings (`/**`) format, with descriptions of each parameter and data type. 

```javascript
parameters: {
/** Provide a clear description of the parameter_name that could be used as documentation. We will eventually use these comments to automatically build documentation and produce metadata. */
	parameter_name1: {
		//
	}
	parameter_name2: {
		//
	}
}
```

```javascript
data: {
	/** Provide a clear description of the data1 that could be used as documentation. We will eventually use these comments to automatically build documentation and produce metadata. */
	data1: {
		//
	}
	data2: {
		//
	}
}
```

We'll describe this more in our sections on Writing Parameters and Updating `data` Configuration.

Additionally, the `parameters` object is used when checking parameter inputs from the user and reading all required parameters to the plugin. First, this object is used by jsPsych to make sure any user inputs are the right type (e.g. strings, integers, images). Second, this object provides default parameter configurations that jsPsych reads into the plugin when they aren't defined by the user but still required for the plugin to work.

...

The `class` declaration, in this case `class MindlessClickingPlugin`, is the second modifiable portion of `index.ts`. This is where we get the plugin to do stuff! It holds three pieces: a `static info` object, a `constructor`, and the `trial()` function.

```javascript
class MindlessClickingPlugin implements JsPsychPlugin<Info> {
	static info = info;
	
	constructor(private jsPsych: JsPsych) { }

	trial(display_element: HTMLElement, trial: TrialType<Info>){
		...
	}
}
```

`static info` ... . Meanwhile, the `constructor` initializes the instance of jsPsych. We'll be able to call that instance throughout the `trial` function as `this.jsPsych`.

The `trial` function is the critical piece that builds the trial. It takes `display_element` and `trial` as arguments. `display_element` is the object that allows us to manipulate elements on the DOM (Document Object Model)---the webpage served to the participant. The `trial` argument uses the `TrialType` interface to read only the user's `parameters` from the `Info` object. We can reference these parameters as we write parts of the trial script that depend on these values.

The next four sections of this tutorial will focus exclusively on modifying the `trial` function to set up the trial behavior we want.

## Adding Elements to DOM

This section will go over how to update the webpage to display what we want to the participant.

The first thing we need to do before anything, though, is delete the `jsPsych.finishTrial()` call in the default template. We’ll return to this method later. For now we need to remove this call so that as we run new builds of our plugin, we can actually see changes to the DOM. Otherwise, the plugin execution ends instantly.

Now that we’ve done that, let’s write something for the participant to interact with: a basic button in HTML. We can assign a class to our button to style it with jsPsych’s built-in CSS:

```html
<div>
      <button class="jspsych-btn">Click Me!</button>
</div>
```

Now we need to add our button to `display_element` by assigning it as a string to `display_element.innerHTML`. `.innerHTML` is the `display_element` property that stores the HTML served to the participant. If you’re curious about any of the other properties in `display_element,` check out [Mozilla’s documentation]() on the `HTMLelement` type.

We could make this assignment directly. However, we should take this opportunity to instill some best practices. For instance, an element’s `innerHTML` property can prove vulnerable to malicious script. It’s generally a good idea to write our own atomized script to allow for checks between each step. With that in mind, we'll first store our string in a separate `html` constant before reading that constant to `display_element.innerHTML`.

```javascript
const html = `<div>
<button class="jspsych-btn">Click Me!</button>
</div>`;
display_element.innerHTML = html;
```

Great! As soon as we run our first plugin build, we can open `example.html` on localhost and find a very basic version of the stimulus we want participants to see and interact with.

We can also make our demand of the participant more explicit by adding a paragraph element underneath the button. 

```javascript
const html = `<div>
<button class="jspsych-btn">Click Me!</button>
<p>Click the button.</p>
</div>`;
display_element.innerHTML = html;
```

As a heads up for the rest of the demo, we're not adding this paragraph to be redundant. We'll actually use our paragraph element to show how to dynamically manipulate the DOM, as well as how to read in parameters from researchers a bit later on.

## Event Listeners & DOM Manipulation

So, we have a button available for the participant to see and click on. Now we want the button to actually do something when clicked. To get our button to dynamically respond to the participant's button presses, we need to use what’s called an event listener. This will be a pretty versatile tool in our Javascript kit, enabling us to do everything from changing the DOM to timing the ending of our trial to recording data in response to participant inputs.

In short, event listeners execute functions whenever an event---like a click---is delivered to a specified target---like the button. We can add a listener to any DOM element using the method `addEventListener`, which takes two arguments: the event, and the function.

Since `"click"` is already a mouse event built into Javascript, we can use that as our event argument. You can also check out [W3Schools' documentation](https://www.w3schools.com/js/js_events.asp) for a list of other events already referenced by Javascript, as well as ways to define your own `CustomEvents`.

With our event covered, we just have to write the function we want our listener to execute. Let's keep it simple stupid for now and write an empty function. We can add to it later as we think of things we want button clicks to do.

```javascript
function button_click_listener(){
}
```

However useless for the time being, we can now add our event listener to the button! The most direct way to do this would be with the `querySelector` method to pick an element out of the DOM object, `display_element`, then running `addEventListener` on the output. 

`querySelector` picks HTML elements based on CSS selectors, which are used to style bits of a web page. The simplest CSS selectors are element names themselves, like divs and buttons. Since we have just one button on our DOM, we could select the only "button" from `display_element` before adding our event listener. Since we’re atomizing our steps as a best practice, we’ll break that down into two steps, assigning the selected element to `const button` and then adding the listener to `button`.

```javascript
function button_click_listener(){
}

const button = display_element.querySelector("button");
button.addEventListener("click", button_click_listener);
```

While that works for now, it's not exactly flexible. `querySelector` will always pick out the first match. Say we have multiple buttons on our DOM, but we want a specific one to react to clicks. We'd only ever add our listener to the first "button" element in `display_element`.

We can fix this by just adding a different kind of CSS selector, an `id`, to our `html` constant from before. An `id` is unique, only be applied to one DOM element at a time, and referenced with a hash (#). Let's give our button the id `“jspsych-mindless-clicking-button”`, then use that ID, `”#jspsych-mindless-clicking-button”` as our `querySelector` argument.

```javascript
const html = `<div>
<button id="jspsych-mindless-clicking-button" class="jspsych-btn">Click Me!</button>
<p>Click the button.</p>
</div>`;
display_element.innerHTML = html;

function button_click_listener(){
}

const button = display_element.querySelector("#jspsych-mindless-clicking-button");
button.addEventListener("click", button_click_listener);
```

It’s worth noting that classes, like the `class=”jspsych-btn”` used for styling, also works as a CSS selector. Like IDs, they’re assigned to elements, but unlike IDs, they’re non-unique and can be re-applied across multiple elements.

With this knowledge of selectors and listeners, we can put a dynamic click counter on the DOM. Let's introduce a `var clicks` and set it to 0. Then, let's actually make our listener do something by having `button_click_listener` iterate on `clicks` by plus 1.

```javascript
var clicks = 0;

function button_click_listener(){
clicks++;
}
```

With the next build, our plugin will start counting participant clicks in the background by updating the `clicks` variable. We could verify that by writing `console.log(clicks)` into `button_click_listener`, running another build, opening index.html and watching the developer console while clicking the button.

We can make our DOM show this count directly to the participant. Let's use another `querySelector` to do that. We'll select the paragraph element, assign it to `const text_element`, then assign a string referencing `clicks` to its `innerHTML`.

```javascript
var clicks = 0;

function button_click_listener(){
clicks++;
const text_element = display_element.querySelector("p");
	text_element.innerHTML = `You've clicked the button ${clicks} times`;
}
```

We can once again make this more precise and flexible by giving our paragraph an `id` and reading that to the `querySelector`.

```javascript
const html = `<div>
<button id="jspsych-mindless-clicking-button" class="jspsych-btn">Click Me!</button>
<p id="jspsych-mindless-clicking-text">Click the button.</p>
</div>`;
display_element.innerHTML = html;

var clicks = 0;

function button_click_listener(){
clicks++;
const text_element = display_element.querySelector("#jspsych-mindless-clicking-text");
	text_element.innerHTML = `You've clicked the button ${clicks} times`;
}
```

We can instill another best practice here by compartmentalizing the steps that update our DOM into a helper function defined separate from `button_click_listener`. That way, if we want other events to update the DOM, we can call that same function iteratively without redundantly copying and rewriting it. Let's call this helper function `update_display`. 

```javascript
function update_display() {
const text_element = display_element.querySelector("#jspsych-mindless-clicking-text");
text_element.innerHTML = `You've clicked the button ${clicks} times`;
}

function button_click_listener(){
clicks++;
update_display();
}
```

Now we have a robust interface for the participant to interact with. She can not only click away at the button but get live feedback on her clicks.

These last two sections focused primarily on basic Javascript techniques. The next section will pivot back to some jsPsych specific methods that we can use to make our build into a fully functional plugin, ready for distribution and use by other researchers.

## Ending the Trial

Now the participant has a clicker to tap endlessly. Great! As a jsPsych plugin though, this isn't very useful. We aren’t recording anything the participant does when the session ends. Nor is there any way for the trial to end, leaving our participant in clicker limbo. Luckily, the solutions to both of these issues are pretty intertwined. 

As previously mentioned, the core jsPsych method for ending a plugin trial is `finishTrial`. This method always takes the `data` object as its argument. By working in the end of our trial, we also set our data up for storage.

Like any core method, we call `finishTrial` by referencing the plugin's jsPsych instance as `this.jsPsych.` That means we'll have to tweak the way we define our listener function. To break `this.jsPsych` down, `this` references the latest execution context, while jsPsych references any jsPsych instance in that context. If we call `this.jsPsych` in the function as is, `this` will reference the function, whose scope won’t include jsPsych by default.

To get around this, we can just declare `button_click_listener` as a constant that stores an arrow function. ... We can then use `this` to reference the plugin context, `trial`.

```javascript
const button_click_listener = () => {
	clicks++;
update_display();
	this.jsPsych.finishTrial(trial_data);
}
```

Now on the next build, we can click the button to immediately end the trial and see the default `data` object.

We can also couch `finishTrial` in a conditional if we want the participant to click more than once. Let's say the participant needs to click the button 5 times before the trial will end.

```javascript
const button_click_listener = () => {
    clicks++;
    update_display();
    if (clicks == 5){
        this.jsPsych.finishTrial(trial_data);
    }
}
```

As usual, we can compartmentalize this minimum clicks value into a separate `required_clicks` constant for some added flexibility.

```javascript
const required_clicks = 5

const button_click_listener = () => {
	clicks++;
    update_display();
    if (clicks == required_clicks){
        this.jsPsych.finishTrial(trial_data);
    }
}
```

Now, if we move our declaration of `required_clicks` to the top of `trial`, we can reference it between changes to the DOM to show that requirement to our participant. Let's reference `required_clicks` in both our `html` constant and our `update_display` function.

```javascript
const required_clicks = 5

const html = `<div>
<button id="jspsych-mindless-clicking-button" class="jspsych-button">Click Me!</button>
<p id="jspsych-mindless-clicking-text">Click the button ${required_clicks} times to continue.</p>
</div>`;
display_element.innerHTML = html;

function update_display() {
const text_element = display_element.querySelector("#jspsych-mindless-clicking-text");
text_element.innerHTML = `Click the button ${required_clicks - clicks} more times to continue.`;
}
```

To recap, we’ve gone over how to end the trial, and even set some conditions that the participant needs to meet before that happens. Now we need to replace the default `data` object with something that accurately reflects the behavior a researcher might want to study.

## Updating the Data Object

So far, we have a pretty complete stimulus. The plugin will show a button for the participant to click on and, eventually, end the trial. Our stimulus also shows a prompt that dynamically counts down the clicks required of the participant.

Now we need to log the participant’s interactions as data. First, let's clear out the default `trial_data` object provided in the template. Until now, it’s returned 99 and "hello world!" as arbitrary values for `data1` and `data2`. Let's replace both of those with just one property for now, called "clicks." We can set the default value to 0.

```javascript
var trial_data = {
	clicks: 0;
}
```

On next build, we'll see our `clicks` value on the data display when we end the trial. Now, we want the button press to actually update the value, or we'll only ever get that default 0. We can do that by returning to the `button_click_listener` function, accessing the `clicks` property on our trial_data object, and using that to store the `clicks` counter variable.

```javascript
const button_click_listener = () => {
	clicks++;
update_display();
trial_data.clicks = clicks
	if (clicks == required_clicks){
this.jsPsych.finishTrial(trial_data);
}
}
```

Now the next build will return however many clicks we require of the participant---in this case, 5. 

Having adjusted the `trial_data` object, it’s time for us to finally return to the `info` object at the top of `index.ts`. The `data` object in `info`---referenced as `info.data`---needs to reflect the changes to `trial_data`. As a reminder, this `data` object keeps metadata for the plugin. Let’s assume for example someone uses our plugin in a study. Another researcher downstream can review the data from that study by calling the plugin’s `info.data` object and checking what was logged directly from the plugin, without having to go into our code. She could use `info.data` to simulate data as well, without running her own experiment. Meanwhile, the docstrings---annotated with `/**`---are used to automatically write this information in jsPsych’s documentation.

Let’s change `info.data` with that in mind.

```javascript
data: {
	/** clicks records the number of times the participant clicks the button before ending the trial */
	clicks: {
		type: ParameterType.INT
	}
}
```

To recap one more time, we’ve built a stimulus that prompts interaction from the user to end the trial. That interaction is recorded in a `trial_data` object that reads as an argument for ending the trial. What’s recorded in `trial_data` is also reflected for other researchers to review in the `info.data` object.

The next section will continue to involve the `info` constant, this time `info.parameters`.

## Writing Parameters

By turning our attention to the `parameters` object, we’ll be able to introduce the kind of flexibility that makes a jsPsych plugin reusable. By writing parameters intentionally, researchers can influence the logic in the `trial` function without running new builds or ever opening our src.

Let's review our parameters out of the box. The template starts with two arbitrary parameters: `parameter_name1` and `parameter_name2`. As you can see, `parameter_name1` requires an integer and `parameter_name2` requires an image, while both have no defined default. 

Let's ignore `parameter_name2` for now and change `parameter_name1` to `required_clicks`. Since we'll only ever require an integer number of clicks, we can keep our type requirement as is. Let's also set our default in advance to 1.

```javascript
parameters: {
	required_clicks: {
		type: ParameterType.INT,
		default: 0,
	},
parameter_name2: {
		type: ParameterType.IMAGE,
		default: 0,
	}
}
```

On next build, we will be able to just declare our desired `required_clicks` parameter from example.html. So will our hypothetical user!

Now let's call `required_clicks` in our plugin instance to make it respond to this new input. To make that call, we need to call the parameter object `trial`, then its recently added `required_clicks` property. Let's do that now in our html constant and conditional.

```javascript

const html = `<div>
<button id="jspsych-mindless-clicking-button" class="jspsych-btn">Click Me!</button>
<p>Click the button ${trial.required_clicks} times to continue.</p>
</div>`;

const button_click_listener = () => {
	trial_data.clicks++;
	if (trial_data.clicks == trial.required_clicks){
this.jsPsych.finishTrial(trial_data);
}
}
```

On next build, we'll be able to define `required_clicks` from examples.html as many times as we want, without having to run another build.

We can also keep writing out and executing parameters with this workflow, first updating the parameters interface before calling it in the plugin instance. For example, we can add a `button_text` parameter to let the user adjust---you guessed it---the text on the button. 

Let's actually use that to replace `parameter_name2`. We'll first add this parameter in the interface, changing the type and default accordingly:

```javascript

parameters: {
	required_clicks: {
		type: ParameterType.INT,
		default: 0,
	},
button_text: {
		type: ParameterType.STRING,
		default: "Click Me!",
	}
}

```

Then we'll call that parameter in our plugin instance, in this case the html constant:

```javascript

const html = `<div>
<button id="jspsych-mindless-clicking-button" class="jspsych-btn">${trial.button_text}</button>
<p>Click the button ${trial.required_clicks} times to continue.</p>
</div>`;

```
...

Finally, let's test it out by running another build and updating the parameter from index.html:

```javascript

const trial = {
	type: jsPsychPluginMindlessClicking,
	required_clicks: 5,
	button_text: "Pretty please click on me"
}
```

Now we can see that our parameter inputs from the html file overwrite the default parameters in the info object, without us having to run a new build. This should be a convenient way for us to try out different parameter values, both as a developer and as a researcher deploying this plugin to the field.
