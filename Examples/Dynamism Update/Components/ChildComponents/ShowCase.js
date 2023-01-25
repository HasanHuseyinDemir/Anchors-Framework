import { html } from "../../../../Versions/1.4-Dynamism Update/anchors.mjs"
import { store } from "../store.js"

export const ShowCase=()=>{
    let Main=html/*html*/`
    <div style="transition:.3s ease" @class="color" id="focused" align="center">
        <h3>{{title}}</h3>
        <img @src="src">
    </div>
    `
    Main.states({
        title(){
            return store.selected.title
        },
        color(){
            return store.selected.color
        },
        src(){
            return store.selected.src
        }
    })
    return Main
}