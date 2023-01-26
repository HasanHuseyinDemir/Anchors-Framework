import { html } from "../../anchors.mjs"
let x=0
export const Component=(props)=>{
    let Main=html/*html*/`
    <>
    Hello {{x}}<button ${props.local?"@":"$"}onclick="increase">${props.local?"Local ":"Global "}{{x}}</button></>
    `
    Main.states({
        x(){
            return x
        },
        increase(){
            x++
        }
    })
    Main.setRate(0);
    return Main
}