import {html,For,RegisterComponent} from "./anchors.mjs"

let array=["diffed","Not Diffed#2"];

let Test=()=>{
    return html`<h1>Test Çalışıyor</h1>`
}

RegisterComponent(Test)

let forList=For(array,(e)=>/*html*/`<p ${e=="text"?"class='text'":""}>${e} ${e=="test"?"<Test/>":""} <span>Not Diffed</span></p>`)

const Page=()=>{
    let Main=html/*jsx*/`
    <>
        <h1>For Test</h1>
        <Test/>
        <input $oninput="changeFirst">
        ${forList}
        
        <style>
            .text{
                background-color:gray;
            }
        </style>
    </>
    `

    Main.states({
        changeFirst(e){
            array[0]=e.value;
        }
    })
    return Main
}



app.render(Page)
