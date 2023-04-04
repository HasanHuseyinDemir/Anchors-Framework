import {html,c} from "https://cdn.jsdelivr.net/gh/hasanhuseyindemir/Anchors-Framework/Versions/Render-Bug-Fix%201.0.1/Minified/anchors.min.mjs"
import { xNodes } from "./index.js";

let x=0;
//x setter
function setX(newValue){
    x=newValue;
    //changes all {x} anchors
    xNodes.text=x;
}
export {x,setX}

export function Nested(){
    //this {x} is anchor and {x} can be updated
    return html/*html*/`
    <div>X : {x}</div>
    `
}