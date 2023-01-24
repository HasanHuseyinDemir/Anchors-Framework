import {html} from "./anchors.mjs"
import { Page } from "./page.js";

export const data={
    x:5
};

const MainPage=()=>{
    let Main=html/*html*/`
    <div>

    [-1-]
    <Page align="center" color="Orange" title="Merhaba Dünya">
    <p>Buraya Yazdıklarımız ne olacak</p>
    </Page>

    [-2-]
    <Page align="left" id="nice" color="red" title="Selamlar Dünya">
    <p>Yada buraya yazdıklarımız {{x}}</p>
    </Page>

    <button @onclick="increase_x">X Arttır {{x}}</button>
    
    </div>

    <style>
        .checked{
            color:"red";
            text-decoration:line-through;
        }
    </style>
    </div>
    `

    Main.states({
        link:"",
        destroyTest(e){
            if(this.link.toLowerCase()==e.textContent.toLowerCase()){
                this.link="";
                Main.update();
                return true
            }
        },
        x:0,
        y:0,
        increase_x(){
            this.x++
        },
        removeDiv(e){
            if(e.childElementCount==2){
                console.log("Silindi!");

                return true
            }
        },
        isvalid(){
            if(!this.link){
                return "Adres Girmelisiniz"
            }
        },
        test(){
            if(!this.link){
                return "checked"
            }
        }
    })

    Main.component("Page",Page)

    return Main
}

document.querySelectorAll("#app").render(MainPage)