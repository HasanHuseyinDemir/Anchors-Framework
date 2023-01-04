import {html,state} from "./anchors.mjs"

const Page =()=>{
    const [x,setX,listX]=state(0);
    const [result,setResult,listResult]=state("Check Console");
    let Main = html/*html*/`
    <div>X = {x}</div>
    <p>{Result}</p>
    <button [[increase]]>X++</button>
    `

    listX.push(Main.getNodes("x"))
    listResult.push(Main.getNodes("Result"))

    //Only Triggers On Changes
    //use setX()
    //This [x,setX,listX] are interconnected
    // "listX" represents the property list of value x
    //check console
    function checkXCallback(){
        if(x()>10){
            console.log("X is too high");
            setX(0)
            //You can remove this callback
            listX.removeCallback(checkXCallback);
            setResult("First Callback Removed!")
            console.log("First Callback Removed!\nBye Bye..")
        }else{
            console.log(x())
        }
    }

    function secondCallback(){
        if(x()==11){
            console.log("This is second Callback Function")
            setResult("Second Callback Triggered");
        }
    }

    listX.changeCallBack(checkXCallback,secondCallback,()=>x()==20?console.log("X is 20 \nThis is third Callback Function...")+setResult("Third Callback Triggered"):"")
    
    //Always works when using "setX"
    listX.addTrigger(()=>setResult("X Changed!"),()=>console.log("Selam"))
    let increaseBtn=Main.getMark("increase")
    increaseBtn.onClick=()=>{
        setX(x()+1)
    }


    return Main
}

document.querySelectorAll("#app").render(Page)