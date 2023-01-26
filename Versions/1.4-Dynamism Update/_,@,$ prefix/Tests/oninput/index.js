import { html } from "../../anchors.mjs"

let store={
    text:""
}

const Page=()=>{
    let Main=html/*html*/`
    <>
    <h1>Model = {{textModel}}</h1>
        <div>
        <h2>@model</h2>
        <input @oninput="textModel">
        </div>

        <div>
        <h2>_model</h2>
        <input _oninput="textModel">
        </div>

        <div>
        <h2>$model</h2>
        <input $oninput="textModel">
        </div>
    </>
    `

    Main.states({
        textModel(arg){
            if(arg){
                store.text=arg.value
            }
            return store.text
        },
    })

    return Main
}

document.querySelectorAll("#app").render(Page)
document.querySelectorAll("#app2").render(Page)