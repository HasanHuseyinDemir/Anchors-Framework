import {html} from "./index.js"

export function A(){
    console.log("Component A Loaded")
    return html/*html*/`
    <div class="component">
    <h1 align="center">Component A</h1>
    <p>ComponentA.js</p>
    </div>
    `
}