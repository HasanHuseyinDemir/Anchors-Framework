import {html,state} from "../anchors.mjs"

const Page=()=>{
    let Main=html/*html*/`
    <div>
    <h1>Callback Counter</h1>
    <p>If the number is greater than {Reset Counts}, it resets itself.</p>
    <p [[Colorize]]>Number {Number}</p>
    <p>Callback {Reset Counts}</p>
    <button [[increase number]]>Increase</button><br>
    <button [[decrease reset]]>Decrease Reset</button>
    </div>
    `

    const [number,setNumber,listNumber]=state(0,Main.getNodes("Number"));
    const [resets,setResets,listResets]=state(0,Main.getNodes("Reset Counts"));

    let increaseButton=Main.getMark("increase number");
    increaseButton.onClick=()=>{
        setNumber(number()+1)
    }

    let decResetBtn=Main.getMark("decrease reset");
    decResetBtn.onClick=()=>{
        //setNumber triggers reset function 
        //if number higher than reset count , reset increases , number resets
        number()==resets()?setNumber(number()+1):setResets(resets()-1)
    }


    //Callback
    const Reset=()=>{
        if(number()>resets()){
            setResets(resets()+1);
            setNumber(0)
            console.log("Callback #"+resets());
        }
    }

    //[[Colorize]]
    let num=Main.getMark("Colorize")
    const Color=()=>{
        if(number()>=resets()){
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
    listResets.changeCallBack(Reset,Color);

    //Reactivity Test
    //setInterval(()=>{setNumber(number()+1)},500)

    return Main;
}

document.querySelectorAll("#app").render(Page);
