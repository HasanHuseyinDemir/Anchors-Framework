export function html(data,...keys){
    let elements=[];
    let randomComment=`<span class="htmlizeAnchorsReplaceElement"></span>`;
    data.forEach((item,index)=>{
        elements.push(item);
        if([...keys][index]!=undefined)
        {elements.push([...keys][index])}})
    let page=document.createElement("template");
    let str="";
    elements.forEach((item)=>{
        typeof item=="string"?str+=item:str+=randomComment;
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
        content.querySelector(".htmlizeAnchorsReplaceElement").replaceWith(key);
    }
    })


    return content;
}

export const state=function(val,...node){
    let value=val;
    let array=[...node];
    let callbackList=[];
    let triggerList=[];

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
                    console.warn(`Anchors TypeError \n ${func} Callback is must be function !`)
                }
            })

        },
        removeCallback:(func)=>{callbackList = callbackList.filter((e)=>{return ''+e != ''+func})},
        clearCallback:function(){callbackList=[];},
        addTrigger:(...functions)=>{
            [...functions].forEach(
                function(func){
                    typeof func=="function"?triggerList.push(func):
                    console.warn(`Anchors TypeError \n ${func} Trigger is must be function !`)})},
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
            triggerList.forEach((e)=>e());
            callbackList.forEach((e)=>e());
            update();
        }else{
            triggerList.forEach((e)=>e());
        }
        
        return value;
    }
    const getter=function(){
        return value
    };
    //init
    update();
    return [getter,setter,list]
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
    "Href":{set(Event){a("href",this,Event)}},
    "Src":{set(Event){a("src",this,Event)}},
    "Style":{set(Event){a("style",this,Event)}},
    "Value":{set(Event){a("value",this,Event)}},
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