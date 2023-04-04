import { html } from "./index.js"
import { updateAllStates, variables } from "./store.js"

export const buttons=()=>{
    //[[Mark Name]] => getMark("Mark Name") gets parent element
    let page = html/*html*/`
    <button [[x increase button]]>{x}++</button>
    <button [[y increase button]]>{y}++</button>
    <button [[z increase button]]>{z}++</button>
    `

    page.getMark("x increase button").onClick=()=>{
        variables.x++;
        updateAllStates()
    }
    page.getMark("y increase button").onClick=()=>{
        variables.y++;
        updateAllStates()
    }
    page.getMark("z increase button").onClick=()=>{
        variables.z++;
        updateAllStates()
    }

    return page
}