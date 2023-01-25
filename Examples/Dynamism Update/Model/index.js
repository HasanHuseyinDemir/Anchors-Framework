import { html } from "../../../Versions/1.4-Dynamism Update/anchors.mjs";

const Page=()=>{
    let Main=html/*html*/`
    <>
        [-This is private comment-]
        <h1>Model Test ({{length}})</h1>
        <input @model="text">
        <br>
        <textarea @model="text"/>
        
        [-
            This <p @text="text"> Element linked to "text" state
        -]

        <p @text="text"/>

    </>
    `
    Main.states({
        text:"Insert Text",
        length(){
            if(this.text.length>0&&this.text.length<30){
                return this.text.length
            }else if(this.text.length>=30){
                return "Too Long"
            }
            //else
            return "Empty"
        }
    })

    //Effect Debounce Rate
    //Default 30 ms
    Main.setRate(0)

    return Main
}

document.querySelectorAll("#app").render(Page)