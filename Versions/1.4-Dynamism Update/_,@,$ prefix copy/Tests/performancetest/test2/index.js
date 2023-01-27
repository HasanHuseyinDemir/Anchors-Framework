import { html } from "../../../anchors.mjs"

let text=""
for(var i=0;i<=100;i++){
    console.log("Hello")
    text+=`<li>${i}</li>`
}

const Page=()=>{
    let Main=html/*html*/`
    <>
        <h1>Lots Of Components Render Tests</h1>
        <ul>
        ${html`${text}`}
        </ul>

    </>
    `

    return Main
}

console.time("Render")
document.querySelectorAll("#app").render(Page)
console.timeEnd("Render")