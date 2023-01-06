import {html,state,pattern,c} from "../../anchors.mjs"

const ReversedText=()=>{
    const [text,setText]=state("krowemarf srohcna");

    const reverse=()=>text().split("").reverse().join("")
    const reversed=pattern(reverse)

    let Page=html/*html*/`
    <div>
    <h1 align="center">Reversed Text Pattern</h1>
    <input [[text input]]>

    <p>Text = {text}</p>
    <p>Reversed = {reversed text}</p>
    </div>
    `

    //Node Get
    let textNode=Page.getNodes("text");
    let reversedNode=Page.getNodes("reversed text");

    //Node Push
    reversed("push",reversedNode)
    text("push",textNode)

    //Input Event Handle
    let textInput=Page.getMark("text input");
    //"Values" same as value but for multiple elements 
    textInput.Values=text();
    textInput.onInput=(e)=>{
        setText(e.target.value)
    }

    return Page
}

document.querySelectorAll("#app").render(ReversedText)