import { html, c, value } from "./core/anchors.mjs";

const Page=function(){
    let text=value("Hello");

    let Main=html/*html*/`
    <h1>Function Tests</h1>
    ${text}
    ${text}

    <br>
    ${c("input",{oninput:(e)=>{text.value=e.target.value}},)}
    `

    Main.effect();
    Main.onEffect(()=>console.log("Effect"))
    Main.onUnmount(()=>{console.log("Sayfa uçtu")})
    return Main;
}


document.querySelectorAll("#app").render(Page);

