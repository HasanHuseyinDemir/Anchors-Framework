import { HTML } from "../ElementGen/c.js";

export const simpleFor=function(a,t){
    let array=a;
    let template=t;
    let fragment=document.createElement("div");
    let type="For";
    const update=()=>{
        let str=array.map(template).join("");
        if(fragment.innerHTML!=str){
            let temp=HTML(str);
            fragment.textContent="";
            fragment.append(temp)
        }
    }
    update();
    return {type,fragment,update}
}