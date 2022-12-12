import { html } from "./index.js"

export const Switch=()=>{
    let page=html/*html*/`
    <select [[switcher]]>
    <option value="A">Component A</option>
    <option value="B">Component B</option>
    <option value="C">Component C</option>
    </select>
    `

    //getMark finds and returns the parent element
    let switchMark=page.getMark("switcher");
    switchMark.onchange=(e)=>{
        console.log(e.target.value+" Loading...")
    }

    return page
}