import { html } from "./anchors.mjs"
import { data } from "./store.js"

export const Page=(props,slot)=>{
    let Main=html/*html*/`
    <div id="${props.id}">
    ${props.title?`<h1>${props.title}</h1>`:""}
    ${slot}
    {{x}}
    <button @onclick="increase_x(1)">Increase {{x}}</button>
    </div>
    `
    Main.states({
        x(){
            return data.x
        },
        increase_x(arg){
            console.log(arg)
            data.increase_x()
        }
    })

    return Main
}