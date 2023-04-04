import {page} from "./MainPage.js"

//Main page must be on top
let mainPage=page();

export let variables={
    x:0,
    y:0,
    z:0
}

let nodes={
    x:mainPage.getNodes("x"),
    y:mainPage.getNodes("y"),
    z:mainPage.getNodes("z")
}

export const updateAllStates=()=>{
    nodes.x.text=variables.x
    nodes.y.text=variables.y
    nodes.z.text=variables.z
}
//first update
updateAllStates();

export {mainPage}