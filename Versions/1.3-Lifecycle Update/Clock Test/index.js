import {html,HTML,value,For,simpleFor,c} from "../anchors.mjs"
export {html,HTML,value,For,simpleFor,c}
import { Clock } from "./clock.js"
import { Plain } from "./plain.js"

const Page=()=>{
    let Main=html/*html*/`
    <div>
    <h1>Lifecycle Components</h1>

    [- Both are Same 'except' last -]
    <Page />
    ${Clock}
    ${Clock()}
    ${Clock}
    ${Clock("Test")}
    <hr>
    ${Plain}
    {TESTS}



    </div>
    `

    let test=Main.getAnchor("TESTS");
    console.log(this)
    
    return Main
}

document.querySelectorAll("#app").render(Page)