---
title: Survey instrument tutorial
description: Build a multi-page questionnaire from scratch with the survey plugin — question types, validation, pages, Likert matrices, conditional questions, and dynamic text.
---
# Survey instrument tutorial

This tutorial works through the creation of a complete survey instrument: a short "Technology & Well-being" questionnaire that collects some background information, measures attitudes on a Likert scale, and asks for open-ended feedback. Along the way it covers most of the mechanics of the [`survey` plugin](../guides/building-surveys.md), including:

* Loading the `survey` plugin and its stylesheet.
* Defining questions with the `survey_json` parameter.
* Mixing several question types on a single page.
* Making questions required and validating responses.
* Splitting a long survey across multiple pages.
* Building a Likert scale with the `matrix` question type.
* Showing a question conditionally based on an earlier answer.
* Personalizing questions with the `survey_function` parameter.
* Reading the data a survey trial produces.

The `survey` plugin is a wrapper around the [SurveyJS form library](https://surveyjs.io/form-library/documentation/overview), so most of what you write is SurveyJS configuration. If you want a conceptual overview first, or help deciding between the `survey` plugin and the simpler `survey-*` plugins, read [Building surveys](../guides/building-surveys.md) before starting here.

## Part 1: Create a blank experiment

Start by setting up an HTML file that loads jsPsych, the `survey` plugin, and their stylesheets. If you are unsure how to do this, follow the [Hello World tutorial](../../getting-started/hello-world.md) first.

The `survey` plugin needs two things that a typical plugin does not:

* its own stylesheet, `survey.min.css`, in addition to `jspsych.css`, and
* a viewport `meta` tag, so the survey renders responsively on phones and tablets.

```html {6,8,10}
<!DOCTYPE html>
<html>
  <head>
    <title>My experiment</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://unpkg.com/jspsych@8.2.2"></script>
    <script src="https://unpkg.com/@jspsych/plugin-survey@4.0.0"></script>
    <link href="https://unpkg.com/jspsych@8.2.2/css/jspsych.css" rel="stylesheet" type="text/css" />
    <link href="https://unpkg.com/@jspsych/plugin-survey@4.0.0/css/survey.min.css" rel="stylesheet" type="text/css" />
  </head>
  <body></body>
  <script>
  </script>
</html>
```

Inside the `<script>` tag, initialize jsPsych and create an empty timeline, just as in any other experiment. We'll display the data when the experiment finishes so we can inspect what the survey collects.

```js
const jsPsych = initJsPsych({
  on_finish: function () {
    jsPsych.data.displayData();
  }
});

const timeline = [];

jsPsych.run(timeline);
```

This is our starting point for the rest of the tutorial.

## Part 2: Your first survey question

A `survey` trial has `type: jsPsychSurvey`, and its content is defined by the `survey_json` parameter. At a minimum, `survey_json` needs an `elements` array containing at least one question.

To declare a survey trial with a single short-answer text question, we create an object with the question's `type`, `name`, and `title`:

```js
const intro_survey = {
  type: jsPsychSurvey,
  survey_json: {
    elements: [
      {
        type: "text",
        name: "first_name",
        title: "What is your first name?"
      }
    ]
  }
};
```

Each question is an object with three properties you'll use constantly:

* `type` — the kind of question (`"text"`, `"radiogroup"`, `"matrix"`, and so on).
* `name` — the identifier used as the key for this question's response in the data. Always set a `name`; otherwise the plugin assigns automatic names like `question1`.
* `title` — the prompt shown to the participant.

As usual, add the trial to the timeline:

```js
timeline.push(intro_survey);
```

:::note `survey_json` is an object, not a string
Despite the name, `survey_json` takes a regular JavaScript object, not a JSON string. The "JSON" label is a reminder that it should only contain data — no functions. When you need a function, use the [`survey_function` parameter](#part-8-personalize-questions-with-a-survey-function) instead.
:::

<details>
<summary><strong>The complete code so far</strong></summary>

```html runnable
<!DOCTYPE html>
<html>
  <head>
    <title>My experiment</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://unpkg.com/jspsych@8.2.2"></script>
    <script src="https://unpkg.com/@jspsych/plugin-survey@4.0.0"></script>
    <link href="https://unpkg.com/jspsych@8.2.2/css/jspsych.css" rel="stylesheet" type="text/css" />
    <link href="https://unpkg.com/@jspsych/plugin-survey@4.0.0/css/survey.min.css" rel="stylesheet" type="text/css" />
  </head>
  <body></body>
  <script>

    const jsPsych = initJsPsych({
      on_finish: function () {
        jsPsych.data.displayData();
      }
    });

    const timeline = [];

    const intro_survey = {
      type: jsPsychSurvey,
      survey_json: {
        elements: [
          {
            type: "text",
            name: "first_name",
            title: "What is your first name?"
          }
        ]
      }
    };
    timeline.push(intro_survey);

    jsPsych.run(timeline);

  </script>
</html>
```
</details>

## Part 3: Mix several question types on a page

One advantage of the `survey` plugin is that a single page can hold many different question types. Let's collect some background information by adding a few more questions to a new trial.

We'll use three new types:

* `radiogroup` — a single-choice question with radio buttons. Its `choices` array lists the options.
* `dropdown` — a single-choice question rendered as a dropdown menu, useful when there are many options.
* `comment` — a multi-line free-text box.

```js
const demographics = {
  type: jsPsychSurvey,
  survey_json: {
    elements: [
      {
        type: "text",
        name: "age",
        title: "How old are you?",
        inputType: "number"
      },
      {
        type: "radiogroup",
        name: "gender",
        title: "What is your gender?",
        choices: ["Woman", "Man", "Non-binary"],
        showOtherItem: true,
        otherText: "Prefer to self-describe"
      },
      {
        type: "dropdown",
        name: "device",
        title: "Which device do you use most often?",
        choices: ["Smartphone", "Laptop", "Desktop", "Tablet"]
      }
    ]
  }
};
timeline.push(demographics);
```

A few details worth noting:

* Setting `inputType: "number"` on a `text` question gives you a numeric input field.
* `showOtherItem: true` adds an "Other" choice with its own text box. The label is set with `otherText`. When a participant selects it, their typed answer is saved under `gender-Comment` in the data.

SurveyJS offers many more question types — `checkbox`, `rating`, `boolean`, `ranking`, `matrix`, and more. See the [SurveyJS question type examples](https://surveyjs.io/form-library/examples/overview) for the full set.

## Part 4: Make questions required and validate responses

By default, participants can leave any question blank and advance. To require an answer, set `isRequired: true` on the question.

You can also constrain *what* counts as a valid answer. For a numeric `text` question, `min` and `max` restrict the accepted range. Let's require the age and gender questions and bound the age:

```js {7-9,16}
const demographics = {
  type: jsPsychSurvey,
  survey_json: {
    elements: [
      {
        type: "text",
        name: "age",
        title: "How old are you?",
        inputType: "number",
        min: 18,
        max: 120,
        isRequired: true
      },
      {
        type: "radiogroup",
        name: "gender",
        title: "What is your gender?",
        choices: ["Woman", "Man", "Non-binary"],
        showOtherItem: true,
        otherText: "Prefer to self-describe",
        isRequired: true
      },
      {
        type: "dropdown",
        name: "device",
        title: "Which device do you use most often?",
        choices: ["Smartphone", "Laptop", "Desktop", "Tablet"]
      }
    ]
  }
};
```

Now the survey won't advance until age and gender are answered, and it shows an error if the age is outside the allowed range.

:::tip More complex validation
SurveyJS supports richer validation rules — regular expressions, value comparisons, and more — through a question's [`validators`](https://surveyjs.io/form-library/documentation/data-validation) property, still inside `survey_json`. If you need validation logic that JSON can't express, the `survey` plugin also provides a [`validation_function` parameter](../guides/building-surveys.md#deciding-between-json-and-function-parameters) for custom JavaScript checks.
:::

## Part 5: Split the survey across multiple pages

Long questionnaires are easier to complete when they're broken into pages. Instead of a top-level `elements` array, give `survey_json` a `pages` array. Each page is an object with its own `elements`, and optionally a `name` and `title`.

Participants can move forward and backward through pages with Next/Back buttons without losing their answers, and the survey is only submitted from the final page.

We'll also add some survey-level options that apply to the whole instrument: a `title`, custom button labels, and a `requiredText` marker.

```js
const survey_json = {
  title: "Technology & Well-being Questionnaire",
  showQuestionNumbers: "off",
  pageNextText: "Next",
  pagePrevText: "Back",
  completeText: "Submit",
  requiredText: "*",
  pages: [
    {
      name: "demographics",
      title: "About you",
      elements: [
        {
          type: "text",
          name: "age",
          title: "How old are you?",
          inputType: "number",
          min: 18,
          max: 120,
          isRequired: true
        },
        {
          type: "radiogroup",
          name: "gender",
          title: "What is your gender?",
          choices: ["Woman", "Man", "Non-binary"],
          showOtherItem: true,
          otherText: "Prefer to self-describe",
          isRequired: true
        },
        {
          type: "dropdown",
          name: "device",
          title: "Which device do you use most often?",
          choices: ["Smartphone", "Laptop", "Desktop", "Tablet"]
        }
      ]
    },
    {
      name: "feedback",
      title: "Your feedback",
      elements: [
        {
          type: "comment",
          name: "comment",
          title: "Is there anything else you'd like us to know?"
        }
      ]
    }
  ]
};

const questionnaire = {
  type: jsPsychSurvey,
  survey_json: survey_json
};
timeline.push(questionnaire);
```

From here on we'll keep building up this single `survey_json` object, since it defines our whole instrument. Survey-level options like `title` and `completeText` are all optional — set them only when you want to change a default. Some of them, such as `title`, can also be set per page.

<details>
<summary><strong>The complete code so far</strong></summary>

```html runnable
<!DOCTYPE html>
<html>
  <head>
    <title>My experiment</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://unpkg.com/jspsych@8.2.2"></script>
    <script src="https://unpkg.com/@jspsych/plugin-survey@4.0.0"></script>
    <link href="https://unpkg.com/jspsych@8.2.2/css/jspsych.css" rel="stylesheet" type="text/css" />
    <link href="https://unpkg.com/@jspsych/plugin-survey@4.0.0/css/survey.min.css" rel="stylesheet" type="text/css" />
  </head>
  <body></body>
  <script>

    const jsPsych = initJsPsych({
      on_finish: function () {
        jsPsych.data.displayData();
      }
    });

    const timeline = [];

    const survey_json = {
      title: "Technology & Well-being Questionnaire",
      showQuestionNumbers: "off",
      pageNextText: "Next",
      pagePrevText: "Back",
      completeText: "Submit",
      requiredText: "*",
      pages: [
        {
          name: "demographics",
          title: "About you",
          elements: [
            { type: "text", name: "age", title: "How old are you?", inputType: "number", min: 18, max: 120, isRequired: true },
            { type: "radiogroup", name: "gender", title: "What is your gender?", choices: ["Woman", "Man", "Non-binary"], showOtherItem: true, otherText: "Prefer to self-describe", isRequired: true },
            { type: "dropdown", name: "device", title: "Which device do you use most often?", choices: ["Smartphone", "Laptop", "Desktop", "Tablet"] }
          ]
        },
        {
          name: "feedback",
          title: "Your feedback",
          elements: [
            { type: "comment", name: "comment", title: "Is there anything else you'd like us to know?" }
          ]
        }
      ]
    };

    const questionnaire = {
      type: jsPsychSurvey,
      survey_json: survey_json
    };
    timeline.push(questionnaire);

    jsPsych.run(timeline);

  </script>
</html>
```
</details>

## Part 6: Build a Likert scale with the matrix question type

The heart of many survey instruments is a Likert scale: several statements that all share the same set of response options (for example, *Strongly disagree* to *Strongly agree*). The `matrix` question type is built for exactly this. It renders a table where each **row** is a statement and each **column** is a response option.

A `matrix` question takes a `columns` array (the scale points) and a `rows` array (the items). Each column and row can be a plain string, or an object with a `value` (stored in the data) and a `text` (shown to the participant) — using `value`/`text` keeps your data tidy while still showing readable labels.

We'll insert a new "Your views" page between the demographics and feedback pages:

```js
{
  name: "attitudes",
  title: "Your views",
  elements: [
    {
      type: "matrix",
      name: "attitudes",
      title: "How much do you agree with each statement?",
      isAllRowRequired: true,
      columns: [
        { value: 1, text: "Strongly disagree" },
        { value: 2, text: "Disagree" },
        { value: 3, text: "Neutral" },
        { value: 4, text: "Agree" },
        { value: 5, text: "Strongly agree" }
      ],
      rows: [
        { value: "connected", text: "Technology helps me feel connected to others." },
        { value: "distracted", text: "I feel distracted by my devices." },
        { value: "control", text: "I have control over how much I use technology." }
      ]
    }
  ]
}
```

Setting `isAllRowRequired: true` requires a response for every statement before the participant can continue. Because we gave each column a numeric `value`, the matrix records each rating as a number (1–5), which is convenient for analysis. The whole question is stored as a single object keyed by row name — we'll see its exact shape in [Part 9](#part-9-read-the-survey-data).

## Part 7: Show a question conditionally

Often you only want to ask a follow-up question when an earlier answer warrants it. SurveyJS handles this with the `visibleIf` property: a question (or page, or choice) appears only when its expression is true. The expression refers to other questions by name, wrapped in curly braces.

Let's replace the always-visible comment box with a two-step version: first ask whether the participant wants to add a comment, then show the text box only if they say yes. We'll use a `boolean` question, which renders a yes/no toggle and stores `true` or `false`.

```js
{
  name: "feedback",
  title: "Your feedback",
  elements: [
    {
      type: "boolean",
      name: "wants_followup",
      title: "Would you like to add a comment?"
    },
    {
      type: "comment",
      name: "comment",
      title: "What would you like us to know?",
      visibleIf: "{wants_followup} = true"
    }
  ]
}
```

The comment box now stays hidden until the participant answers "Yes". The same `{question_name}` syntax can also insert an earlier answer into a later question's text — for example, a title of `"You told us you mostly use a {device}. How do you feel about that?"` would substitute the participant's actual device. This kind of dynamic text works entirely within `survey_json`, as long as the value comes from a question *in the same survey trial*.

## Part 8: Personalize questions with a survey function

What if you want to use information from *outside* the current survey trial — like a response from an earlier trial in the experiment? JSON can't reach that, because the value doesn't exist yet when you write the JSON. For this you use the `survey_function` parameter.

`survey_function` receives the SurveyJS survey model as an argument, and you can modify it with JavaScript right before the trial runs. If you also provide `survey_json`, the function receives a survey already built from that JSON, so you can adjust just the dynamic parts and leave everything else in JSON.

Back in Part 2 we collected the participant's first name in a separate `intro_survey` trial. Let's greet them by name at the top of the questionnaire. We read the earlier response from the jsPsych data and set it as the survey's `title`:

```js
const set_personal_title = (survey) => {
  // Get the response object from the intro survey trial
  const intro_data = jsPsych.data.get().filter({ trial_type: "survey" }).values()[0];
  const first_name = intro_data.response.first_name;
  survey.title = `Thanks, ${first_name}! A few questions about you.`;
};

const questionnaire = {
  type: jsPsychSurvey,
  survey_json: survey_json,
  survey_function: set_personal_title
};
timeline.push(questionnaire);
```

`survey.getQuestionByName("...")` works the same way if you want to modify a specific question instead of a survey-level property. Anything you can configure in JSON, you can also set through the survey model in a `survey_function` — and only the function can run custom JavaScript, such as responding to survey events. See [Building surveys](../guides/building-surveys.md#using-javascript-to-create-or-modify-the-survey) for more on combining the two approaches.

## Part 9: Read the survey data

Each `survey` trial adds one entry to the jsPsych data with two key properties:

* `response` — an object with one key per question, using the question's `name`. The value's type depends on the question type.
* `rt` — the response time in milliseconds, from when the page first appears until the survey is submitted.

For our questionnaire, the `response` object looks like this:

```js
{
  "age": 27,
  "gender": "Non-binary",
  "device": "Laptop",
  "attitudes": {
    "connected": 4,
    "distracted": 2,
    "control": 5
  },
  "wants_followup": true,
  "comment": "The matrix question was easy to use."
}
```

Notice how the structure mirrors the questions you defined: simple questions map to a single value, the matrix maps to a nested object keyed by row name, and a hidden conditional question (if `wants_followup` were `false`) simply wouldn't appear. If a participant picks the "Other" gender option, their typed text is stored separately under `gender-Comment`.

Because we set `on_finish` to call `jsPsych.data.displayData()` back in Part 1, the full data set — including this `response` object — prints to the screen when the experiment ends, which is handy during development. In a real study you would instead [store the data](../guides/storing-data.md) on a server. To pull survey responses out for analysis, use the standard [data methods](../concepts/data.md), for example:

```js
// the response object from the questionnaire trial
const responses = jsPsych.data.get().filter({ trial_type: "survey" }).last(1).values()[0].response;
```

## The final code

Putting it all together, here is the complete survey instrument.

```html runnable
<!DOCTYPE html>
<html>
  <head>
    <title>My experiment</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://unpkg.com/jspsych@8.2.2"></script>
    <script src="https://unpkg.com/@jspsych/plugin-survey@4.0.0"></script>
    <link href="https://unpkg.com/jspsych@8.2.2/css/jspsych.css" rel="stylesheet" type="text/css" />
    <link href="https://unpkg.com/@jspsych/plugin-survey@4.0.0/css/survey.min.css" rel="stylesheet" type="text/css" />
  </head>
  <body></body>
  <script>

    /* initialize jsPsych */
    const jsPsych = initJsPsych({
      on_finish: function () {
        jsPsych.data.displayData();
      }
    });

    /* create timeline */
    const timeline = [];

    /* ask for the participant's first name up front */
    const intro_survey = {
      type: jsPsychSurvey,
      survey_json: {
        elements: [
          { type: "text", name: "first_name", title: "What is your first name?" }
        ]
      }
    };
    timeline.push(intro_survey);

    /* the main questionnaire */
    const survey_json = {
      title: "Technology & Well-being Questionnaire",
      showQuestionNumbers: "off",
      pageNextText: "Next",
      pagePrevText: "Back",
      completeText: "Submit",
      requiredText: "*",
      pages: [
        {
          name: "demographics",
          title: "About you",
          elements: [
            { type: "text", name: "age", title: "How old are you?", inputType: "number", min: 18, max: 120, isRequired: true },
            { type: "radiogroup", name: "gender", title: "What is your gender?", choices: ["Woman", "Man", "Non-binary"], showOtherItem: true, otherText: "Prefer to self-describe", isRequired: true },
            { type: "dropdown", name: "device", title: "Which device do you use most often?", choices: ["Smartphone", "Laptop", "Desktop", "Tablet"] }
          ]
        },
        {
          name: "attitudes",
          title: "Your views",
          elements: [
            {
              type: "matrix",
              name: "attitudes",
              title: "How much do you agree with each statement?",
              isAllRowRequired: true,
              columns: [
                { value: 1, text: "Strongly disagree" },
                { value: 2, text: "Disagree" },
                { value: 3, text: "Neutral" },
                { value: 4, text: "Agree" },
                { value: 5, text: "Strongly agree" }
              ],
              rows: [
                { value: "connected", text: "Technology helps me feel connected to others." },
                { value: "distracted", text: "I feel distracted by my devices." },
                { value: "control", text: "I have control over how much I use technology." }
              ]
            }
          ]
        },
        {
          name: "feedback",
          title: "Your feedback",
          elements: [
            { type: "boolean", name: "wants_followup", title: "Would you like to add a comment?" },
            { type: "comment", name: "comment", title: "What would you like us to know?", visibleIf: "{wants_followup} = true" }
          ]
        }
      ]
    };

    /* greet the participant by the name they entered earlier */
    const set_personal_title = (survey) => {
      const intro_data = jsPsych.data.get().filter({ trial_type: "survey" }).values()[0];
      const first_name = intro_data.response.first_name;
      survey.title = `Thanks, ${first_name}! A few questions about you.`;
    };

    const questionnaire = {
      type: jsPsychSurvey,
      survey_json: survey_json,
      survey_function: set_personal_title
    };
    timeline.push(questionnaire);

    /* start the experiment */
    jsPsych.run(timeline);

  </script>
</html>
```

## Where to go next

You've built a complete survey instrument and seen the main mechanics of the `survey` plugin. To go further:

* [Building surveys](../guides/building-surveys.md) — a fuller tour of the plugin's options, including programmatically generating questions and using timeline variables.
* The [SurveyJS examples](https://surveyjs.io/form-library/examples/overview) — copy-and-paste configurations for dozens of question types and features that drop straight into `survey_json`.
* [The data object](../concepts/data.md) and [Storing and exporting data](../guides/storing-data.md) — getting your responses out for analysis.
