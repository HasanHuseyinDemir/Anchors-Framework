import { html } from "../../../../Versions/1.4-Dynamism Update/anchors.mjs"
import { store } from "../store.js"

export const Card=(props,slot)=>{
    
    let Main=html/*html*/`
    <div  align="center" style="${"background :"+props.color}" class="card">
        <img @onmouseover="focused" id="card" src=${props.img}>
        <h2>${props.title}</h2>
        <p>${slot}</p>
    </div> 
    `

    Main.states({
        focused(){
            store.selected.title=props.title
            store.selected.src=props.img
            store.selected.color=props.color
            
            document.title="Focused : "+props.title
            console.log(props.title+" Focused");

            //To wake up all components
            //You need to dispatch "updated" event
            let wake=new Event("updated")
            document.dispatchEvent(wake)
        }
    })

    Main.onMount(()=>console.log(props.title+" Mounted"));

    return Main
}