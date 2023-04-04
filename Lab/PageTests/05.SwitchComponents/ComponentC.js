import {html} from "./index.js"

export function C(){
    console.log("Component C Loaded")
    return html/*html*/`
    <div class="component">
    <h1 align="center">Component C</h1>
    <p>ComponentC.js</p>
    </div>
    `
}