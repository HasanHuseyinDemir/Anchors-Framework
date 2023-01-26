import { html } from "../../anchors stable2.mjs"
let x=5;
const Page=()=>{
    let Main=html/*html*/`
    <>
        <p>Çalışıyor {{tx}}</p>
        <input _oninput="txt">
        <p @hide="hide">x pozitif</p>
        <button @onclick="increase">Local {{x}}</button>
        <button $onclick="increase">Global {{x}}</button>
        <button $onclick="decrease">Decrease Global {{x}}</button>
        <button @onclick="decrease">Decrease Local {{x}}</button>
        ${()=>new Date().getSeconds()}
    </>    
    `


    Main.states({
        tx:"",
        txt(arg){
            this.tx=arg.value
            console.log(this.tx)
        },
        x(){
            return x
        },
        increase(){
            x++
        },
        decrease(){
            x--
        },
        hide(){
            if(x<0){
                return true
            }
        },
    })

    return Main
}

console.time("Page")
document.querySelectorAll("#app").render(Page)
document.querySelectorAll("#app2").render(Page)
console.timeEnd("Page")