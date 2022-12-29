import { html, state } from "https://cdn.jsdelivr.net/gh/hasanhuseyindemir/Anchors-Framework/Versions/1.2-Setter%20Update/anchors.min.mjs";

const Main=()=>{
    
    let page = html/*html*/`
    <h1>X = {x}</h1>
    <button [[increase x]]>Increase {x}</button>
    `
    
    let xNode=page.getNodes("x")
    let IncreaseButton=page.getMark("increase x");
    
    const [x,setX]=state(0,xNode);

    IncreaseButton.onClick=()=>{
        setX(x()+1)
    }

    return page
}

document.querySelectorAll("#app").render(Main)