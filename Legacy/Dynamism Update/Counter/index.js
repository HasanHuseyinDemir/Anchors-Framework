import { html } from "../../../Versions/1.4-Dynamism Update/anchors.mjs";

const Counter=()=>{
    let Main=html/*html*/`
    <>
    <h1 align="center">Counter</h1>
    [- @ Dynamic Class @ -]
    <h1 @class="positivity" class="transition" align="center">{{count}}</h1>
    
        <div align="center">
            [- All attributes starting with "@" are specified dynamically -]
            <button @onclick="increase">Increase {{count}}</button>
            <button @onclick="decrease">Decrease {{count}}</button>
        </div>

    <style>
        body{
            background:gray;
        }
        .transition{
            transition:.5s;
            text-shadow:0px 0px 2px black;
        }
        .positive{
            color:lightgreen;
            
        }
        .negative{
            color:tomato

        }
        .neutral{
            color:white
        }
    </style>
    </>
    `

    Main.states({
        count:0,
        increase(){
            this.count++
        },
        decrease(){
            this.count--
        },
        positivity(){
            if(this.count<0){
                return "negative"
            }else if(this.count==0){
                return "neutral"
            }else{
                return "positive"
            }
        }
    })

    return Main
}

document.querySelectorAll("#app").render(Counter)