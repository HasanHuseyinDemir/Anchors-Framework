import {html,c} from "https://cdn.jsdelivr.net/gh/hasanhuseyindemir/Anchors-Framework/Versions/Render-Bug-Fix%201.0.1/Minified/anchors.min.mjs"

import {DigitalClock } from "./digital-clock.js"

function Main(){
    let page=html/*html*/`
    <h1 align="center">Digital Clock</h1>
    ${DigitalClock()} 
    `
    return page
}

document.querySelector("#anchors").render(Main)