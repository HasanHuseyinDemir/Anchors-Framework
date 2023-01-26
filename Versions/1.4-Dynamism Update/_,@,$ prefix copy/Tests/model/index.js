import { html } from "../../anchors.mjs"

let store={
    text:""
}

const Page=()=>{
    let Main=html/*html*/`
    <>
    <h1>Model = {{model}}</h1>
        <div>
        <h2>@model</h2>
        <input @model="model">
        </div>

        <div>
        <h2>_model</h2>
        <input _model="model">
        </div>

        <div>
        <h2>$model</h2>
        <input $model="model">
        </div>
        ${()=>new Date().getSeconds()}
    </>
    `

    Main.states({
        model:""
    })

    return Main
}

document.querySelectorAll("#app").render(Page)
document.querySelectorAll("#app2").render(Page)