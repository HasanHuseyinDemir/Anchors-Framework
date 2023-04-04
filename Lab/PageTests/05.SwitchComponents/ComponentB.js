import {html} from "./index.js"

export function B(){
    console.log("Component B Loaded")
    return html/*html*/`
    <div class="component">
    <h1 align="center">Component B</h1>
    <p>ComponentB.js</p>
    </div>
    `
}