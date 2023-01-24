import { html } from "../anchors.mjs"

export const testPage=(props,slot)=>{
    let Main=html/*html*/`
    <div style="background-color:${props.title};padding:5px">
    <h1 align="center">${props.title??""}</h1>
    <p align="center">${slot||"Slot Belirtilmedi!"}</p>
    </div>
    `
    return Main
}