import {page} from "./MainPage.js"

//Main page must be on top
let mainPage=page();

let variables={
    x:0
}

console.log(mainPage)

let xNodes=mainPage.getNodes("x");



let nodes={
    x:xNodes
}



export {mainPage}