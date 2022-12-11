import { html } from "../../Versions/Tests/Value-Update 1.1/anchors.mjs"

export let MainPage=html/*html*/`
<div>Selam</div>
{{x value}} {{x value}} 

[- Block Comment -][-This is invisible-]
<p [[Mark Test]]> Buraya Tıkla </p>
<p [[Mark Test]]> Buraya Tıkla </p>

<input [[oninputTest]]>
<input [[oninputTest]]>

<p [[t]]>Burası Değişecek</p>

<p >sss</p>
<p [[Test]] [Test] >sss</p>
[< Model >]
`

MainPage.getMark("oninputTest").onInput=(e)=>{console.log(e.target.value)}
