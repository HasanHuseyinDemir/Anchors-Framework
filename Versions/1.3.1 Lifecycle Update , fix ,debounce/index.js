import { html } from "./anchors.mjs";

const MainPage=()=>{
    let test=`
    color:green;
    `
    let text="";
    let Main=html/*html*/`
    <div>
    <h1 _id="hello">Debounce Render Test</h1>
    <input placeholder="Insert Text" [[input]]>
    <input type="number" placeholder="DB Rate (Default:30ms)" [[rate]]>

    <p id="colorize">${()=>text} selam</p>
    <style>
        #colorize{
            ${test}
        }
    </style>
    </div>
    `

    let input=Main.getMark("input");
    let inputRate=Main.getMark("rate");
    inputRate.onInput=(e)=>{
        Main.setRate(e.target.value);
        console.log({input:e.target.value,rate:Main.details.rate})
    }
    input.onInput=(e)=>{
        text=e.target.value;
        Main.localUpdate();
    }
    Main.onEffect(()=>{
        console.log("Hello")

    })

    return Main
}

document.querySelectorAll("#app").render(MainPage)