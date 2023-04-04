import {html,c} from "https://cdn.jsdelivr.net/gh/hasanhuseyindemir/Anchors-Framework/Versions/Render-Bug-Fix%201.0.1/Minified/anchors.min.mjs"
import { x,setX } from "./nested.js"

export function increaseButton(){

    //this {x} is anchor
    let button = html/*html*/`<button>{x}++</button>`;
    button.selectElement("button").onclick=()=>{
        setX(x+1);
    }
    return button;

}