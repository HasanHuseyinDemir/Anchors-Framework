import {html,c} from "https://cdn.jsdelivr.net/gh/hasanhuseyindemir/Anchors-Framework/Versions/Value-Update%201.1/%231%20getnode%20fix/anchors.min.mjs"
export {html,c}
import { A } from "./ComponentA.js"
import { B } from "./ComponentB.js"
import { C } from "./ComponentC.js"

import {Switch} from "./Switch.js"

function ComponentSwitchTest(){
    let page=html/*html*/`
    <div>

    [- Comments are invisible -]
    <h1 align="center">Now : {Selected Component}</h1>
    
    [- Option Element for switching components -]
    {Switch}

    <hr>

    {Component}
    
    </div>`

    let SelectedComponentText=page.getNodes("Selected Component");
    SelectedComponentText.text="Select a component";

    //{Switch}
    let SwitchAnchor=page.getAnchor("Switch");
    SwitchAnchor.render(Switch);
    
    //{Component}
    let component=page.getAnchor("Component");
    
    //get always returns array
    let options=SwitchAnchor[0];
    options.onchange=(e)=>{
        SelectedComponentText.text=e.target.value;
        switch(e.target.value){
            case "A":component.render(A);break;
            case "B":component.render(B);break;
            case "C":component.render(C);break;
        }
        document.title=e.target.value;
    }

    return page
}

document.querySelectorAll("#anchors").render(ComponentSwitchTest)