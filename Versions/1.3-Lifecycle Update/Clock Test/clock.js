import { html } from "../anchors.mjs"

export const Clock=(arg)=>{
    let started=true
    let Main=html/*html*/`
    <div>
        ${arg}
        ${()=>new Date().getHours()}:${()=>new Date().getMinutes()}:${()=>new Date().getSeconds()}
        <button [[stopbtn]]>${()=>started?"Stop":"Start"}</button>
        <button [[unmountbtn]]>Unmount</button>
    </div>`
    
    //all node updates
    let tick=setInterval(()=>{
        if(started){
            Main.effect("local");
            console.log("Tick");
        }
    },1000)

    //get [[stopbtn]] and event
    let stopbtn=Main.getMark("stopbtn");
    stopbtn.onclick=()=>{
        started=!started
        Main.effect();
    }

    //unmount when click [[unmountbtn]]
    let unmountbtn=Main.getMark("unmountbtn");
    unmountbtn.onclick=()=>{
        Main.unMount();
    }

    //
    Main.onUnmount(()=>{
        clearInterval(tick);
        console.log("Unmounted");
    })

    //on any node changes
    //<button clock=" * ">Stop</button>
    Main.onEffect(()=>{
        stopbtn.setAttribute("minute",new Date().getMinutes())
        stopbtn.setAttribute("second",new Date().getSeconds())
        console.log("Effect")
    })

    //this prevents unnecessary rendering from parent effects
    Main.memo();

    return Main
}