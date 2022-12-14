import {html,c} from "https://cdn.jsdelivr.net/gh/hasanhuseyindemir/Anchors-Framework/Versions/Render-Bug-Fix%201.0.1/Minified/anchors.min.mjs";
import {Counter} from "./counter.js";
import {DigitalClock} from "../First-Page/digital-clock.js";

function Main(){
    let page=html/*html*/`
    <div>
    
    {Anchors Can Be Empty}
    {Anchors Icon}
    {Anchors Title}
    ${DigitalClock()}
    ${Counter()}


    </div>
    `

    //Returns Array Of Selected Anchor Elements
    let Icon=page.getAnchor("Anchors Icon");
    //Need ForEach for declaring attributes
    Icon.forEach(element => {
        element.title="By H.H.D";
        element.onclick=()=>{console.log("Anchors JS")}
    });

    let CurlyBraces={
        left:"&lcub;",
        right:"&rcub;"
    }

    let Title=page.getAnchor("Anchors Title");
    Icon.render(html`<img src="../../Images/AnchorsTransparent.png">`)
    Title.render(html`<h1 align="center">${CurlyBraces.left} ANCHORS ${CurlyBraces.right}</h1>`)

    return page
}




document.getElementById("anchors").render(Main)