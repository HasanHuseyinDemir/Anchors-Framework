import { templateHTML } from "../ElementGen/c.js";

export const simpleFor=function(a,t){
    let array=a;
    let template=t;
    let fragment=document.createElement("div");
    let type="For";
    const update=()=>{
        let str=array.map(template).join("");
        if(fragment.innerHTML!=str){
            let temp=templateHTML(str);
            fragment.textContent="";
            fragment.append(temp)
        }
    }
    update();
    return {type,fragment,update}
}