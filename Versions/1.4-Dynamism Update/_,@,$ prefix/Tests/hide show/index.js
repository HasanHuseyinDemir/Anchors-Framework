import { html } from "../../anchors.mjs"

const Page=()=>{
    let Main=html/*html*/`
    <>
        <p>Çalışıyor</p>
        <p @hide="hide">x pozitif</p>
        <button @onclick="increase">Increase {{x}}</button>
        <button $onclick="increase">Increase Glov {{x}}</button>
        <button @onclick="decrease">Decrease {{x}}</button>
        ${()=>new Date().getSeconds()}
    </>    
    `
    Main.states({
        x:0,
        increase(){
            this.x++
        },
        decrease(){
            this.x--
        },
        hide(){
            if(this.x<0){
                return true
            }
        }

    })


    return Main
}

document.querySelectorAll("#app").render(Page)
document.querySelectorAll("#app2").render(Page)