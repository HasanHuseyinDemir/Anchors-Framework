import { html } from "./anchors.mjs";

const Page=()=>{
    let Main=html/*jsx*/`
    <>
        <h1>selam {x}</h1>
    </>
    
    `

    Main.states({
        x:5
    })
    return Main
}

document.querySelectorAll("#app").render(Page)