import {html,state,pattern,c} from "../../anchors.mjs"

const Page=()=>{

    const [x,setX]=state(2);
    const xPlusOne=pattern(()=>x()+1)
    const xPlusX=pattern(()=>x()+x())
    let Main=html/*html*/`
    <h1>Pattern Test</h1>
    <p>x={x}</p>
    <p>x+1={x+1}</p>
    <p>x+x={x+x}</p>
    ${c("button",{onclick:()=>{setX(x()+1)}},"Increase X")}
    `

    let xNode=Main.getNodes("x");
    let xPlusNode=Main.getNodes("x+1");
    let xPlusXNode=Main.getNodes("x+x");

    //Node getter
    x("push",xNode)
    xPlusOne("push",xPlusNode);
    xPlusX("push",xPlusXNode);
    xPlusX("addtrigger",()=>{console.log(xPlusX())})
    
    //All setX like state changers affects all patterns
    //x() returns 2
    //xPlusOne() returns 3

    //when x=5 =>+1=> xplusone=6

    return Main
}

document.querySelectorAll("#app").render(Page)