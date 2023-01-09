export function html(data,...keys){
    let elements=[];
    let keyList=[...keys];
    let randomComment=`<span class="htmlizeAnchorsReplaceElement"></span>`;
    data.forEach((item,index)=>{
        elements.push(item);
        if(keyList[index]!=undefined)
        {elements.push(keyList[index])}})
    let page=document.createElement("template");
    let str="";
    elements.forEach((item,index)=>{
        if(typeof item=="string"){
            str+=item
        }else{
            str+=randomComment;
        }
    })
    str=str.replaceAll("[-","<span delete='").replaceAll("-]","'></span>")
    str=str.replaceAll("[[","mark='").replaceAll("]]","'")
    str=str.replaceAll("{{","<span value='").replaceAll("}}","'></span>")
    str=str.replaceAll("{","<span anchor='").replaceAll("}","'></span>")
    page.innerHTML=str;

    let content=page.content;

    //Delete All Comments
    content.querySelectorAll("[delete]").forEach((el)=>{
            el.remove()
    });


    [...keys].forEach((key)=>{
    if(typeof key=="object"||typeof key=="number"){
            if(Object.keys(key).length>0){
                /*
                let selected = content.querySelector(".htmlizeAnchorsReplaceElement").parentElement
                let keys=Object.keys(key);
                keys.forEach((e)=>{
                    selected[e]=key[e]
                })
                */
                //content.querySelector(".htmlizeAnchorsReplaceElement").replaceWith(""); 
            }else{
                content.querySelector(".htmlizeAnchorsReplaceElement").replaceWith(key);
            }
    }else if(typeof key=="function"){
        let selected=key();
        let func=key;
        if(typeof selected=="object"){
            content.querySelector(".htmlizeAnchorsReplaceElement").replaceWith(selected);
        }else if(typeof selected=="number"||typeof selected=="string"){
            //let node=document.createTextNode(selected)
            //content.querySelector(".htmlizeAnchorsReplaceElement").replaceWith(node);
            const effect=()=>{
                let before=selected;
                let pattern=key;
                
            }
        }

    }
    })


    return content;
}

////
//// only triggers set events
let effectNodes=[];
let globalStatePatterns=[];

//const xPlusOne=pattern(()=>x()+1,xPlusOneNode)
export const pattern=function(val,...nodes){
    let pattern=val;
    let before=undefined;
    let callbackList=[];
    let triggerList=[];
    let nodeList=[...nodes];
    const getter=function(first,second){
        switch(first){
            case "push":nodeList.push(second),init();break;
            case "changePattern":pattern=second;break;
            case "addcallback":callbackList.push(second);break;
            case "addtrigger":triggerList.push(second);break;
            default :return pattern();
        }
    }

    const newnode=()=>{
        let newNode=document.createTextNode("");
        newNode.nodeValue=pattern();
        nodeList.push([newNode]);
        return newNode
    }

    const init=()=>{
        nodeList.forEach((e)=>{
            e.text=pattern();
        })
    }

    const update=function(){
        let newValue=pattern();
        triggerList.forEach(e=>e())
        if(newValue!=before){
            callbackList.forEach(e=>e());
            nodeList.forEach((e)=>{
                e.text=pattern();
            })
            before=newValue;
        }
    }

    if(typeof val!="function"){
        console.warn(`Anchors TypeError \n${second} State Patterns is must be function \nPlease Do not use () for pattern functions!\nUse instead "()=>{Function()}"`)
        console.warn("Example #1\n'const xPlusY = pattern(()=>x()+1)'")
        console.warn("Example #2\n'const xPlusY = pattern(function)'")
        console.warn("Do not use pattern(function()) or pattern(x()+1)")
    }


    globalStatePatterns.push(update);
    update()
    return [getter,newnode];
}
////

export const state=function(val,...node){
    let value=val;
    let array=[...node];
    let callbackList=[];
    let triggerList=[];

    const newnode=()=>{
        let newNode=document.createTextNode("");
        newNode.nodeValue=value;
        array.push([newNode]);
        return newNode
    }

    const list={
        //[TODO] Eklenen fonksiyon aynı ise Erişim engellenecek
        push:(object)=>{
            array.push(object);
            update();
        },
        delete:(object)=>{
            //Test
            array.pop(object);
            update();
        },
        clear:()=>{
            [array,callbackList]=[];
        },
        changeCallBack:(...functions)=>{
            [...functions].forEach(function(func){
                if(typeof func=="function"){
                    callbackList.push(func);
                }else{
                    console.warn(`Anchors TypeError \n ${func} Callback is must be function \nPlease Do not use () for callback functions!\nUse instead "()=>{Callback()}"`)
                }
            })

        },
        removeCallback:(func)=>{callbackList = callbackList.filter((e)=>{return ''+e != ''+func})},
        clearCallback:function(){callbackList=[];},
        addTrigger:(...functions)=>{
            [...functions].forEach(
                function(func){
                    typeof func=="function"?triggerList.push(func):
                    console.warn(`Anchors TypeError \n ${func} Trigger is must be function \nPlease Do not use () for trigger functions!\nUse instead "()=>{Trigger()}"`)})},
        removeTrigger:(func)=>{triggerList = triggerList.filter((e)=>{return ''+e != ''+func})},
        clearTriggers:function(){
            triggerList=[];
        }
    }

    const update=()=>array.forEach((e)=>e.text=value);
    const setter=function(newValue){
        if(value!=newValue){
            value=newValue;
            //before
            globalStatePatterns.forEach(e=>e())
            triggerList.forEach((e)=>e());
            callbackList.forEach((e)=>e());
            update();
        }else{
            triggerList.forEach((e)=>e());
        }
        
        return value;
    }
    const getter=function(first,second){
        switch(first){
            case "push":case "pushNode":list.push(second);break;
            case "delete":case "deleteNode":list.delete(second);break;
            case "clear":case "clearNodes":list.clear();break;
            
            //ChangeCallBack
            case "changeCallBack":
            case "addCallBack":
            case "changeCallback":
            case "addCallback":
            case "addcallback":
            case "changecallback":list.changeCallBack(second);break;
            case "trigger":case "addTrigger":case "addtrigger":list.addTrigger(second);break;
            case "removeCallback":list.removeCallback(second);break;
            case "clearCallback":list.clearCallback();break;
            case "removeTrigger":case "deleteTrigger":list.removeTrigger(second);break;
            case "deleteTriggers":case "removeTriggers":case "clearTriggers":list.clearTriggers();break;
            default:return value
        }
        
    };
    //init
    update();
    return [getter,setter,newnode]
}


//Html element creator
//c("element",{attributes:"attribute"},childs of element)
export function c(arg,attribute,...childs) {
    let el=document.createElement(arg);
    
    if(attribute){
        Object.keys(attribute).forEach((attr,index)=>{
            el[attr]=Object.values(attribute)[index]
        });
    }

    [...childs].forEach((child)=>{
        switch(typeof child){
            case "string":case "number": el.append(document.createTextNode(child));break;
            case "object": el.append(child);
        }
    })
    return el;
}

Object.prototype.selectElement=function(val){
        let data=this.querySelectorAll(val);
        if(data.length==1){
            return data[0]
        }
        return data;
}

Object.prototype.getValue=function(val){
    
    return this.selectElement(`[value='${val}']`)
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
        let data=this.querySelectorAll(`[anchor='${anchorName}']`);

        data.forEach((item)=>{
            item.removeAttribute("anchor");
        })

        return data;
}

Object.prototype.getNodes=function(anchorName){
    let data=this.querySelectorAll(`[anchor='${anchorName}']`);
    let nodes=[];
    data.forEach((item)=>{
        let node=document.createTextNode("");
        item.replaceWith(node);
        nodes.push(node);
    })

    return nodes;
}

Object.prototype.render=function(page,args){
    if(this!=document.body){
        if(typeof page=="object"){
            this.textContent="";
            page.selectElement("[anchor]").forEach((i)=>{i.removeAttribute("anchor")});
            this.replaceWith(page)
        }else if (typeof page=="function"){
            this.textContent="";
            let pages=page(args);
            pages.selectElement("[anchor]").forEach((i)=>{i.removeAttribute("anchor")});
            this.replaceWith(pages)
        }
    }else{
        console.warn("Warning : Anchors Render Error \nPlease Don't Use Document.body for Render");
    }

}

NodeList.prototype.render=function(page,args){
this.forEach((item)=>{
    item.selectElement("[anchor]").forEach((i)=>{i.removeAttribute("anchor")});
    if(typeof page=="object"){
        item.textContent="";
        item.replaceWith(page.cloneNode(true))
    }else if (typeof page=="function"){
        item.textContent="";
        item.replaceWith(page(args))
    }
})}

Object.prototype.getMark=function(mark){
    return this.selectElement(`[mark='${mark}']`)
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