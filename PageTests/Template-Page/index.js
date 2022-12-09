import { html } from "../../Versions/Render-Bug-Fix 1.0.1/Minified/anchors.min.mjs";
import {Counter} from "./counter.js"

function Main(){
    let page=html/*html*/`
    <div>
    
    {Anchors Are Hidden}
    {Anchors Icon}
    {Anchors Title}

    ${/*This Renders Counter*/Counter()}

    </div>
    `

    //Returns Array Of Elements
    let Icon=page.getAnchor("Anchors Icon");
    //Need ForEach for declaring attributes
    Icon.forEach(element => {
        element.title="By H.H.D";
        element.onclick=()=>{console.log("Anchors JS")}
    });

    let Title=page.getAnchor("Anchors Title");
    Icon.render(html`<img src="../../Images/AnchorsTransparent.png">`)
    Title.render(html`<h1 align="center">Anchors</h1>`)

    return page
}




document.getElementById("anchors").render(Main)