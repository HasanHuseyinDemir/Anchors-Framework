import { html,nodeList,simpleFor,HTML } from "../../../Versions/1.4.5-Store,States,nodeLists,createEffect,etc/anchors.mjs";

const todo=[{
task:"Hello World",completed:false
},{
    task:"Save World",completed:false
},{
    task:"World",completed:false
}]

const forTest=simpleFor(todo,(e,key)=>{
    return /*html*/`<div key=${key}>
    Task:${e.task}
    </div>`
})

const Page=()=>{
    let Main=html/*jsx*/`
    <>
        <h1>SimpleFor Test</h1>
    
        ${forTest}
        <input $oninput="gorev">
    </>
    `
    Main.methods({
        gorev(e){
            todo[0].task=e.value
            forTest.update();
        }
    })

    return Main
}

document.querySelectorAll("#app").render(Page)