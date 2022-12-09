import { html } from "../../Versions/Render-Bug-Fix 1.0.1/Minified/anchors.min.mjs";
import { twoDigit } from "../../MiniUtiltyTools/twoDigit.js";

export function DigitalClock(){
    let page=html/*html*/`
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

    return page;
}