import {html,state} from "../anchors.mjs"

const Page=()=>{
    let Main=html/*html*/`
    <div>
    <h1>Multiple State Reactivity Test</h1>
    [- States -]
    <p>X state = {x}</p>
    <p>Y state = {y}</p>
    <p>X+Y state = {x+y}</p>
    <p>setX and setY Affects setXY</p>
    <p>Please Check Console</p>


    [- Input -]
    <input type="number" min=0 [[x input]]>
    <input type="number" min=0 [[y input]]>

    </div>
    `
    //Mark Getting
    let xInput=Main.getMark("x input")
    let yInput=Main.getMark("y input")

    //State Defining
    const [x,setX]=state(0);
    const [y,setY]=state(0);
    const [xy,setXY]=state(0);

    //Node Getting
    let xNode=Main.getNodes("x");
    let yNode=Main.getNodes("y");
    let xyNode=Main.getNodes("x+y");

    //Node Pushing
    x("push",xNode)
    y("push",yNode)
    xy("push",xyNode)

    //Input Event Handling
    xInput.onInput=(e)=>{
        setX(parseInt(e.target.value))
    }
    yInput.onInput=(e)=>{
        setY(parseInt(e.target.value))
    }

    //X+Y State Updater
    //Only triggers x,y state changes
    let xPlusY=(e)=>{
        setXY(x()+y())
        //custom callback call
        e?console.log(e+" Triggered"):""
    }

    //callbacks
    //these are triggered only once when x or y state changes
    //you can define custom callbacks "like ()=>xPlusY('y')"
    //please check console
    x("addcallback",xPlusY)
    //custom callback
    y("addcallback",()=>xPlusY("Y"))

    xy("addcallback",()=>{console.log("X+Y State Changed : \n"+"X "+x()+"\nY "+y()+"\nX+Y "+xy())})

    return Main
}

document.querySelectorAll("#app").render(Page)