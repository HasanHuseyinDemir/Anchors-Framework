import { list } from "../store.js"
import { html } from "../../../../Versions/1.4-Dynamism Update/anchors.mjs"
import { Card } from "./Card.js"

export const Container=()=>{
    let Main=html/*html*/`
    <div id="container">
    ${list.map((e)=>{
        return /*html*/`
        <card-component title="${e.title}" img="${e.img}" color="${e.color}">
            ${e.slot}
        </card-component>`
    }).join("")}
    </div>
    `
    Main.component("card-component",Card)
    return Main
}