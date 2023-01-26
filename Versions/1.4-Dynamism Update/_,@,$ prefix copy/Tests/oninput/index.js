import { html } from "../../anchors_stable.mjs"

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
        <button _onclick="effect">Effect</button>
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
        effect(){
            Main.effect();
        }
    })

    return Main
}

document.querySelectorAll("#app").render(Page)
document.querySelectorAll("#app2").render(Page)