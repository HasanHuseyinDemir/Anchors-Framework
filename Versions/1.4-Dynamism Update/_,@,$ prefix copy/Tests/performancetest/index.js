import { html } from "../../anchors.mjs"
import { Component } from "./component.js";

let text=new DocumentFragment();
for(var i=0;i<=1000;i++){
    console.log("Hello")
    text.append(html`<component-test ${i%2==0?"local='true'":""}>Hello world ${i}</component-test>`.content) 
}

const Page=()=>{
    let Main=html/*html*/`
    <>
        <h1>Lots Of Components Render Tests</h1>

        ${text}
    </>
    `
    Main.component("component-test",Component)
    return Main
}

console.time("Render")
document.querySelectorAll("#app").render(Page)
console.timeEnd("Render")