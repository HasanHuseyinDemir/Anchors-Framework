import { html } from "../../../Versions/1.4-Dynamism Update/anchors.mjs"
import { store } from "./store.js"

//<ChildComponent/> ($1,$2) => $1:props $2:slot
export const ChildComponent=(props,slot)=>{
    let Main=html/*html*/`
    <div style="background-color:${props.color||"white"}">
    <h1>${props.title||"Title is not defined"}</h1>

    [- Slot -]
    <div>${slot||"Slot is not defined"}</div>

    <p>Count : {{count}}</p>
    <button @onclick="increase">Increase {{count}}</button>
    <button @onclick="decrease">Decrease {{count}}</button>

    </div>
    `

    Main.states({
        count(){
            return store.count
        },
        increase(){
            store.increase();
        },
        decrease(){
            store.decrease();
        }
    })

    return Main
}