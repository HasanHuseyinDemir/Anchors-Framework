import {c, html,state} from "../anchors.mjs"

const page=()=>{
    //You do not need statelist anymore...
    //listX.push(Node) == x("push",Node)
    const [x,setX,/*listX*/]=state(0);
    let button=c("button",{onclick:()=>{setX(x()+1)}},"Click") //Alternative usage of buttons
    let Main=html/*html*/`
    <div> 
    <h1>{x}.Click</h1>
    ${button}  
    </div>`

    let xNode=Main.getNodes("x");
    //You can push nodes
    x("push",xNode)
    //You can add state change callbacks 
    //Both are same! [changeCallBack,changeCallback,changecallback,addCallBack,addCallback,addcallback]
    x("addCallback",()=>{console.log(x())})


    return Main
}

document.querySelectorAll("#app").render(page)