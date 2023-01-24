import { html } from "../../../../1.4-Dynamism Update/anchors.mjs";

const Page=()=>{
    let Main=html/*html*/`
    <>
        <h1>Model Test ({{length}})</h1>

        <input @model="text">
        <br>
        <textarea @model="text"/>

    </>
    `
    Main.states({
        text:"Insert Text",
        length(){
            if(this.text.length>0){
                return this.text.length
            }
            return "Empty"
        }
    })

    return Main
}

document.querySelectorAll("#app").render(Page)