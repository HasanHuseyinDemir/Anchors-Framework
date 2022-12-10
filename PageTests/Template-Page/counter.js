import {html} from "../../Versions/Render-Bug-Fix 1.0.1/Minified/anchors.min.mjs";

export function Counter(){
    let count=0;
    let page=html/*html*/`

    <h2 align="center"> ' {count} ' </h2>
    <button anchor="Increase Count">Increase {count}</button>
    <button anchor="Decrease Count">Decrease {count}</button>
    `
    
    //TextNodes
    let countNodes=page.getNodes("count");
    countNodes.text=count;//TextNode Value
    
    //'getAnchor' Returns array of Increase Buttons
    //anchor="Increase Count" same as {Increase Count} 
    let IncreaseButtons=page.getAnchor("Increase Count");
    IncreaseButtons.forEach((item)=>{
        item.onclick=()=>{
        increase();
        }
    })

    let DecreaseButtons=page.getAnchor("Decrease Count");
    DecreaseButtons.forEach((item)=>{
        item.onclick=()=>{
            decrease();
        }
    })

    const increase=()=>{
        count++;
        countNodes.text=count;
    }
    const decrease=()=>{
        count--;
        countNodes.text=count;
    }

    return page
}