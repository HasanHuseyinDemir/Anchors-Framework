import { html,HTML,RegisterComponent } from "../anchors.mjs";
export {html,RegisterComponent}
import { Test } from "./test.js";


const Page=()=>{
    let Main= HTML/*html*/`
    <>
        <h1>Main Page</h1>
        <Test/>
        <Test/>
    </>
    `


    return Main
}

RegisterComponent(Test)

document.querySelectorAll("#app").render(Page)