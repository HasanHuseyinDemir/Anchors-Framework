import {html} from "https://cdn.jsdelivr.net/gh/hasanhuseyindemir/Anchors-Framework/Versions/Value-Update%201.1/%231%20getnode%20fix/anchors.min.mjs"

function Counter(){
    let count=0;
    let page=html/*html*/`
    <div align="center" style="padding: 5px;background: orange;margin: 5px;">

    <h1>' {Count} '</h1>
    
    <div>
    <button [[Increase]]>{Count}++</button>
    <button [[Decrease]]>{Count}--</button>
    </div>

    </div>
    `
    let CountNode=page.getNodes("Count");
    let IncreaseButton=page.getMark("Increase");
    let DecreaseButton=page.getMark("Decrease");
    
    IncreaseButton.onClick=()=>{
        count++;
        update();
    }
    DecreaseButton.onClick=()=>{
        count--;
        update();
    }

    let update=()=>{
        CountNode.text=count;
    }
    update();
    console.log("Counter Loaded")
    return page
}

//Standalone Render
document.querySelectorAll("#Anchor-Counter").render(Counter);
