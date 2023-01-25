import { html} from "../../../Versions/1.4-Dynamism Update/anchors.mjs";
import { Container } from "./ChildComponents/Container.js";
import { ShowCase } from "./ChildComponents/ShowCase.js";
import { Style } from "./ChildComponents/Style.js";

const Page=()=>{
    let Main=html/*html*/`
    <>

    <Show-Case/>
    <Container-Component/>
    <Style-Component/>

    </>
    `

    Main.component("show-case",ShowCase)
    Main.component("container-component",Container)
    Main.component("style-component",Style)


    return Main
}

document.querySelectorAll("#app").render(Page)