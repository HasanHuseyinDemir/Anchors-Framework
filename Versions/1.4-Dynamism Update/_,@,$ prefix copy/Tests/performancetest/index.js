import { html,HTML } from "../../anchors.mjs"

let frag=new DocumentFragment();
for(var i=0;i<=200;i++){
    console.log("Hello")
    //text.append(html`<component-test ${i%2==0?"local='true'":""}>Hello world ${i}</component-test>`.content) 
    let Main=html`
    <button @onmouseover="increase" @class="highness">{{x}}</button>
    `
    Main.states({
        x:0,
        increase(){this.x++},
        highness(){
            if(this.x>4&&this.x<10){
                return "high"
            }else if(this.x==10){
                return "danger"
            }else if(this.x>10){
                Main.unMount();
            }
        }
    
    })
    
    frag.append(Main.content)
}
let component=()=>html`${frag}`

const Test=()=>{
    return HTML/*html*/`
    <div>
    Hello World
    </div>
    `
}

const Page=()=>{
    let Main=html/*html*/`
    <>
        <h1>Lots Of Components Render Tests</h1>
        
        <Test-Fragment/>
        
        ${Test}

        <style>
            .high{
                color:red;
                background:black;
                border:none;
            }
            .danger{
                color:white;
                background:red;
            }
        </style>

    </>
    `

    Main.component("test-fragment",component)
    return Main
}

console.time("Render")
document.querySelectorAll("#app").render(Page)
console.timeEnd("Render")