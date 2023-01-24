import { html,For } from "../anchors.mjs"
import { testPage } from "./testpage.js"

const Main=()=>{

    let array=[
        {color:"yellow",slot:"This is Yellow"},
        {color:"orange",slot:"Orange Peel"},
        {color:"red",slot:"Scarlet"},
        {color:"cyan"}
    ]

    let simple=array.map((e)=>{
        return `<test-page title="${e.color}">${e.slot||"Empty"}</test-page>`
    }).join("")
    
    let forFrag=For(array,(e)=>{
        let page=html/*html*/`<div>
        ${e.color}
        </div>`;
        
        return page
    })

    let Main=html/*html*/`
    <div>
    {{x}}

    <p>Test {{x5k}}</p>
    <button @onclick="setX('increase')">Increase</button>
    <button @onclick="setX('decrease')">Decrease</button>

    <input @model="x">


    <div class="gradient" @class="highness">
    <p @hide="destroy(0)">{{x}} is Negative</p>
    <p @hide="destroy(5)">5</p>
    <p @hide="destroy(10)">10</p>
    <p @hide="destroy(15)">15</p>
    <p @hide="destroy(20)">20</p>
    <p @hide="destroy(25)">25</p>
    <p @hide="destroy(30)">30</p>
    <p @hide="destroy(35)">35</p>
    <p @hide="destroy(40)">40</p>
    <p @show="destroy(40)">{{x}} Higher than 40</p>
    <p @show="destroy(90)" style="color:black;background:red">Danger!</p>
    </div>

    <style>
        .gradient{
            background: rgb(238,174,202);
            background: linear-gradient(0deg,rgba(148,187,233,1) 0%, rgba(238,174,202,1)  100%);
        }
        .toohigh{
            background:green;
            color:white
        }
        .negative{
            background:red;
            color:white;
        }
    </style>

    </div>
    `

    Main.states({
        x:5,
        diffX(arg){
            if(typeof arg=="number"){
                return parseInt(arg)-this.x
            }

        },
        setX(arg){
            switch(arg){
                case "increase":this.x++;break;
                case "decrease":this.x--;break;
            }
        },
        x5k(){
            return this.x<10?"Smaller Than 10":"Bigger Than 10"
        },
        destroy(arg){
            if(this.x>=arg){
                return true
            }
        },
        highness(){
            //destroy
            if(this.x>=100){
                console.log("destroying")
                Main.unMount();
            }
            if(this.x>40){
                return "toohigh"
            }else if(this.x<0){
                return "negative"
            }
        }
    })

    Main.component("test-page",testPage)
    
    return Main
}

document.querySelectorAll("#app").render(Main)