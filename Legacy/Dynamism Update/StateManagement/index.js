import { html } from "../../../Versions/1.4-Dynamism Update/anchors.mjs";
import { ChildComponent } from "./childComponent.js";
import { store } from "./store.js";

let effect=0;
const Page=()=>{
    let Main=html/*html*/`
    <div>
    [-This is comment-]

    [-Counter States-]
    <h1>Main component count {{count}}</h1>
    <button @onclick="increase">Increase</button>
    <button @onclick="decrease">Decrease</button>
    <button @onclick="reset">Reset</button>

    <>
    <p>TEst</p>
    </>

    [- Props -]
    <Child-Component color="orangered" title="Child Component"/>
    
    [- Slot -]
    <Child-Component color="cyan" title="Hello World">
        <p>You can not use props drilling</p>
        <p>But you can insert "{{count}}" from Parent </p>
    </Child-Component>

    [-You Can Use Without Props And Slots-]
    <Child-Component color="yellow"/>
    
    </div>
    `
    Main.states({
        count(){
            return store.count;
        },
        increase(){
            store.increase();
        },
        decrease(){
            store.decrease();
        },
        reset(){
            store.reset();
        }
    })

    //Effect Callback only state changes
    Main.onEffect(()=>{
        effect++
        console.log("onEffect Triggered : "+effect)
    })

    //<Child-Component/> == ${ChildComponent} == ${ChildComponent()}
    Main.component("Child-Component",ChildComponent)

    return Main
}

document.querySelectorAll("#app").render(Page)