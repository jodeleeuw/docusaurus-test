import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details>
<summary>example "Displaying trial until participant gives a response"</summary>
<Tabs>
<TabItem value="Code" label="Code" default>

        ```javascript
        var trial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: '<p style="font-size:48px; color:green;">BLUE</p>',
            choices: ['r', 'g', 'b'],
            prompt: "<p>Is the ink color (r)ed, (g)reen, or (b)lue?</p>"
        };
        ```
        
    
</TabItem>
<TabItem value="Demo" label="Demo" default>

        <div style={{textAlign:"center"}}>
            <iframe src="../../demos/jspsych-html-keyboard-response-demo1.html" width="90%;" height="500px;" frameBorder="0"></iframe>
        </div>

    <a target="_blank" rel="noopener noreferrer" href="../../demos/jspsych-html-keyboard-response-demo1.html">Open demo in new tab</a>
</TabItem>
</Tabs>
</details>

<details>
<summary>example "Showing a 1 second fixation cross; no response allowed"</summary>
<Tabs>
<TabItem value="Code" label="Code" default>

        ```javascript
        var trial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: '<p style="font-size: 48px;">+</p>',
            choices: "NO_KEYS",
            trial_duration: 1000,
        };		
        ```
	
</TabItem>
<TabItem value="Demo" label="Demo" default>

        <div style={{textAlign:"center"}}>
            <iframe src="../../demos/jspsych-html-keyboard-response-demo2.html" width="90%;" height="500px;" frameBorder="0"></iframe>
        </div>

    <a target="_blank" rel="noopener noreferrer" href="../../demos/jspsych-html-keyboard-response-demo2.html">Open demo in new tab</a>
</TabItem>
</Tabs>
</details>
