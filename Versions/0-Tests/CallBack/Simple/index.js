import {html,state} from "../anchors.mjs"

const Page=()=>{
    let Main=html/*html*/`
    <div>
    <h1>Simple Counter</h1>
    <p>If the number is greater than 5, it resets itself.</p>
    <p [[Colorize]]>Number {Number}</p>
    <p>Resets {Reset Counts}</p>
    <button [[increase number]]>Increase</button>
    </div>
    `

    const [number,setNumber,listNumber]=state(0,Main.getNodes("Number"));
    const [resets,setResets]=state(0,Main.getNodes("Reset Counts"));

    let increaseButton=Main.getMark("increase number");
    increaseButton.onClick=()=>{
        setNumber(number()+1)
    }

    //Callback
    const Reset=()=>{
        if(number()>5){
            console.log("Reset");
            setResets(resets()+1);
            setNumber(0)
        }else{
            console.log(number())
        }
    }

    //[[Colorize]]
    let num=Main.getMark("Colorize")
    const Color=()=>{
        if(number()>4){
            num.style="color:orangered";
            increaseButton.text="Reset"
        }else{
            num.style="color:black";
            increaseButton.text="Increase"
        }
    }

    //[number,setNumber,listNumber] count of number
    //[resets,setResets] count of resets
    //listNumber.changeCallback triggers only "number" changes
    //listNumber.addTrigger Always works when using "setNumber"
    //check console
    //"number" state => triggers => "resets" state
    listNumber.changeCallBack(Reset,Color);

    //Reactivity Test
    //setInterval(()=>{setNumber(number()+1)},1000)

    return Main;
}

document.querySelectorAll("#app").render(Page);
