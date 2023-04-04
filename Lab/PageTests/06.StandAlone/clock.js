import {html} from "https://cdn.jsdelivr.net/gh/hasanhuseyindemir/Anchors-Framework/Versions/Value-Update%201.1/%231%20getnode%20fix/anchors.min.mjs"
import { twoDigit } from "../../MiniUtiltyTools/twoDigit.js";

export function DigitalClock(){
    let page=html/*html*/`
    <h1 align="center">Digital Clock</h1>
    <h1 align="center">{Hour} : {Minute} : {Second}</h1>
    `

    let TimeNodes={
        hour:page.getNodes("Hour"),
        minute:page.getNodes("Minute"),
        second:page.getNodes("Second")
    }

    //Updates text of selected nodes
    function update(){
        let date=new Date();

        let hour=parseInt(date.getHours());
        let minute=parseInt(date.getMinutes());
        let second=parseInt(date.getSeconds());

        TimeNodes.hour.text=twoDigit(hour);
        TimeNodes.minute.text=twoDigit(minute);
        TimeNodes.second.text=twoDigit(second);
    }
    update();
    
    setInterval(()=>{
        update();
    },1000)

    console.log("Digital Clock Loaded")
    return page;
}

//Standalone Render
document.querySelectorAll("#Anchor-DigitalClock").render(DigitalClock)
