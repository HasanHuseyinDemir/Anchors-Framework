import { store } from "../store.js"


export const Scroll=()=>{
    let Main=html/*html*/`
    <>
    <ul>
        <li $class="category(0)" $onclick="activate(0)">Home</li>
        <li $class="category(1)" $onclick="activate(1)">Tutorials</li>
        <li $class="category(2)" $onclick="activate(2)">Examples</li>
        <li $class="category(3)" $onclick="activate(3)">About</li>
    </ul>

    <style scoped>
        ul{
            width:100%;
            background:white;
            display:flex;
            justify-content:space-around;
            list-style:none;
        }
        li{
            background: rgba(128,128,128,0.24);
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            margin-left: 2px;
            margin-right: 2px;
            padding: 12px;
            font-weight: bolder;
            transition: .4s;
        }
        li:hover , .active{
            background-color:lightgray !important;
            cursor:pointer;
            color:black;
        }
    </style>
    </>
    `
    Main.states({
        active:0,
        category(arg){
            if(arg==this.active){
                return "active"
            }else{
                return ""
            }
        },
        activate(arg=number){
            this.active=arg;
            store.setCategory(arg)
        }
    })




    return Main
}

RegisterComponent(Scroll)
