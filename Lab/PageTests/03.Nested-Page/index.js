import {html,c} from "https://cdn.jsdelivr.net/gh/hasanhuseyindemir/Anchors-Framework/Versions/Render-Bug-Fix%201.0.1/Minified/anchors.min.mjs"
import { increaseButton } from "./increase.js";
import {Nested,x} from "./nested.js";

//Main Page
let page=html/*HTML*/`
    <div>
    <h1 align="center">${Nested()}</h1>
    ${increaseButton()}
    </div>
`

//gets all {x} anchorNodes
export let xNodes=page.getNodes("x");
//changes all Textnodes
xNodes.text=x;

document.querySelector("#app").append(page);