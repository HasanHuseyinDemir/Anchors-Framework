
import { html } from "./ElementGen/html.js";
import { c } from "./ElementGen/c.js";
import { state } from "./StateManagement/state.js";
export { html,state,c }

export const core={
    registeredRenders:[],
    effectNodes:[],
}

//set and effect triggers
export const globalEffect=()=>{
    core.effectNodes.forEach((e)=>{e()})
}

//PROTOTYPES
Object.prototype.selectElement=function(val){
    let data=this.querySelectorAll(val);
    if(data.length==1){
        return data[0]
    }
    return data;
}

Object.prototype.getValue=function(val){

return this.content.selectElement(`[value='${val}']`)
}

Object.defineProperty(Object.prototype,"text",{
set:function(textValue){
    if(Array.isArray(this)&&typeof this=="object"||this.length>1){
        this.forEach((element)=>{      
            textValue=textValue.toString();
                if(element.nodeType==3){
                    element.textContent!=textValue?element.nodeValue=textValue:""
                }else{
                    element.textContent!=textValue?element.textContent=textValue:""
                }
            })
    }else{
        textValue=textValue.toString();
        if(this.nodeType==3){
            this.textContent!=textValue?this.nodeValue=textValue:"";
        }else{
            this.textContent!=textValue?this.textContent=textValue:""
        }
    }
},
get:function(){
if(this){
    let arr=[]
    if(this.length>1){
        this.forEach((element)=>{
            arr.push(element.textContent)
        })
        return arr;
    }else{
        return this.textContent
    }
}
}

})

Object.prototype.getAnchor=function(anchorName){
    let data=this.content.querySelectorAll(`[anchor='${anchorName}']`);

    data.forEach((item)=>{
        item.removeAttribute("anchor");
    })

    return data;
}

Object.prototype.getNodes=function(anchorName){
let data=this.content.querySelectorAll(`[anchor='${anchorName}']`);
let nodes=[];
data.forEach((item)=>{
    let node=document.createTextNode("");
    item.replaceWith(node);
    nodes.push(node);
})

return nodes;
}

Object.prototype.render=function(page,args){
    if(typeof page=="object"){
        this.textContent="";
        page.content.selectElement("[anchor]").forEach((i)=>{i.removeAttribute("anchor")});
        this.append(page)
    }else if (typeof page=="function"){
        this.textContent="";
        let pages=page(args);
        pages.content.selectElement("[anchor]").forEach((i)=>{i.removeAttribute("anchor")});
        this.append(pages.content)
    }
}

NodeList.prototype.render=function(page,args){
this.forEach((item)=>{
item.selectElement("[anchor]").forEach((i)=>{i.removeAttribute("anchor")});
item.textContent="";
if(typeof page=="object"){item.append(page.cloneNode(true))}
else if (typeof page=="function"){
    let signal=false;
    //Confirm
    core.registeredRenders.forEach((e)=>{
        if(e.target==this){
            signal=true;
        }
    })
    let data=page(args)
    item.append(data.content)
    core.registeredRenders.push({target:this,data})
    console.log(core.registeredRenders)
}
})}

Object.prototype.getMark=function(mark){
return this.content.selectElement(`[mark='${mark}']`)
}

//boilerplate of attribute setting
let a=(attribute,object,event)=>{        
if(Array.isArray(object)||object.length>1){
object.forEach((item)=>{item[attribute]=event})
}else{
object[attribute]=event
}}


//on events for multiple elements
Object.defineProperties(Object.prototype,{
//Inputs
"onClick":{set(Event){a("onclick",this,Event)}},
"onInput":{set(Event){a("oninput",this,Event)}},
"onChange":{set(Event){a("onchange",this,Event)}},
//multiplesets
"Hrefs":{set(Event){a("href",this,Event)}},
"Srcs":{set(Event){a("src",this,Event)}},
"Styles":{set(Event){a("style",this,Event)}},
"Values":{set(Event){a("value",this,Event)}},
//mouse
"onMouseOver":{set(Event){a("onmouseover",this,Event)}},
"onMouseOut":{set(Event){a("onmouseout",this,Event)}},  
//keys
"onKeyDown":{set(Event){a("onkeydown",this,Event)}},
"onKeyUp":{set(Event){a("onkeyup",this,Event)}},
"onKeyPress":{set(Event){a("onkeypress",this,Event)}},

"onLoad":{set(Event){a("onload",this,Event)}},

})

Object.prototype.setAttributes=function(attribute,value){
    if(Array.isArray(this)||this.length>1){
        this.forEach((item)=>{item.setAttribute(attribute,value)})
    }else{
        this.setAttribute(attribute,value)
    }
}