import { MainPage } from "./Mainpage.js";
import { html } from "../../Versions/Tests/Value-Update 1.1/anchors.mjs";

export const x={
    value:0,
    set set(value){
        this.value=value;
//        this.node.text=x.value;
        MainPage.getValue("x value").text=this.value;
    }
}

console.log(x)
x.set=5;
let marked=MainPage.selectElement("[mark='Mark Test']")


MainPage.getMark("Test").onClick=()=>{alert()}

MainPage.getValue("x value").render(html`<p>asdsadsadas</p>`)