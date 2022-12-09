import { html } from "../../Versions/Render-Bug-Fix 1.0.1/Minified/anchors.min.mjs";
import {DigitalClock } from "./digital-clock.js"

function Main(){
    let page=html/*html*/`
    <h1 align="center">Digital Clock</h1>
    ${DigitalClock()} 
    `
    return page
}

document.querySelector("#anchors").render(Main)