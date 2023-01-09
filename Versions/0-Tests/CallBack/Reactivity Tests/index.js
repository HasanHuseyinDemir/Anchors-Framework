import {c, html,state} from "../anchors.mjs"

const Page=()=>{
    let Main=html/*html*/`
    <div>
    <h1>Reactivity Tests #1</h1> 
    Range {Number}
    <br>
    <input [[range]] type="range" value=0 min=0 max=200>
    <br>
    <input [[another range]] type="range" value=0 min=0 max=100>
    <br>
    <input [[another range]] type="range" value=0 min=0 max=50>
    <br>
    [- Alternative usage of button -]
    ${c("button",{onclick:()=>{console.log(number())}},"Click")}
    </div>
    `

    //{Number} => Main.getNodes("Number")
    const [number,setNumber,listNumber]=state(0,Main.getNodes("Number"));

    //[[range]] => Main.getMark("range")
    const range=Main.getMark("range");
    range.onInput=(e)=>{setNumber(parseInt(e.target.value))};

    //[[another range]] => Main.getMark("another range")
    const anotherRange=Main.getMark("another range");
    anotherRange.onInput=(e)=>{setNumber(parseInt(e.target.value))}
    
    //updates every number state changes
    const update=()=>{
        //value for single element
        //Value for multiple elements
        range.Values=number()
        anotherRange.Values=number();
    }

    //It triggers when "number" variable changes
    listNumber.changeCallBack(update);

    //Auto
    //setInterval(()=>{setNumber(number()+10)},200)

    return Main;
}

document.querySelectorAll("#app").render(Page);
