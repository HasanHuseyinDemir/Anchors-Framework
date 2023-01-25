function html(data,...keys){
    const details={
        nodeLists:[],
        onEffect:null,
        onUnmount:null,
        onMount:null,
        onSignal:null,
        onTrigger:null,
        active:true,
        memo:false,
        mounted:false,
        values:[],
        rate:30,
        childComponents:[],
        key:Math.random(),
        target:null
    }
    /////////////////////////////////////////////////////////////////////
    let randomComment=`<span class="achrplcelem"></span>`;
    let elements=[];
    let keyList=[...keys];
    data.forEach((item,index)=>{
        elements.push(item);
        if(keyList[index]!=undefined)
        {elements.push(keyList[index])}})
    let page=document.createElement("template");
    let str="";
    elements.forEach((item)=>{typeof item=="string"?str+=item:str+=randomComment;})
    str=str.replace("<>","<div>").replace("</>","</div>");
    str=str.replaceAll("[-","<span delete='").replaceAll("-]","'></span>")
    str=str.replaceAll("[[","mark='").replaceAll("]]","'")
    str=str.replaceAll("[{","<span anchor='").replaceAll("}]","'></span>")
    str=str.replaceAll("{{","<span state='").replaceAll("}}","'></span>")

    str=namer(str);

    page.innerHTML=str;
    let content=page.content;
    content.querySelectorAll("[delete]").forEach((el)=>{el.remove()});
    ////////////////////////////////////////////////////////////////////////////
    const effect=(arg)=>{
        if(details.active==true){
            let signal=false;
            details.nodeLists.forEach((e)=>{
                let result=e.func();
                if(e.before!=result){
                    e.node.nodeValue=result;
                    e.before=result;
                    if(typeof details.onEffect=="function"){
                        signal=true
                    }
                    document.dispatchEvent(updatedEvent)
                }
            })
            signal?details.onEffect(arg):""
            if(details.childComponents.length>0&&arg!="local"){
                    details.childComponents.forEach((e)=>{    
                        if(e.details.memo==false){
                            e.effect(arg)
                        }
                    })
                }
        }
        signal(arg);
    }
    const update=()=>{
        rate()
    };
    const localUpdate=()=>{
        localrate()
    };
    let updatedEvent=new Event("updated")
    const signal=(e)=>{
        if(details.onSignal&&details.mounted){
            details.onSignal(e);
        }
        
    }
    const mount=()=>{
        if(details.mounted==false){
            details.mounted=true;
            details.onMount?details.onMount():"";
        }
        document.body.querySelectorAll(`[anc-key='${details.key}']`).forEach((e)=>{
            e.onclick=()=>trigger({event:"click"});
            e.beforeinput=()=>trigger({event:"beforeinput"});
        })
        trigger({event:"mount"})
    }

    const trigger=(e)=>{
        typeof details.onTrigger=="function"?details.onTrigger(e):""
    }



    let rate=debounce(()=>{effect()},()=>details.rate);
    let localrate=debounce(()=>{effect("local")},()=>details.rate);
    ////////////////////////////////////////////////////////////////////////////
    [...keys].forEach((key)=>{
    if(typeof key=="object"||typeof key=="number"){
            if(Object.keys(key).length>0){
                if(key.type=="variable"){
                    content.querySelector(".achrplcelem").replaceWith(key.node);
                    let signal=false;
                    key.parentList.forEach((e)=>{
                        if(e.i==details.key){
                            signal=true
                        }
                    })
                    if(signal==false){
                        key.parentList.push({effect,i:details.key})       
                    }
                    //details.values.push(key);
                }else if(key.type=="For"){
                    content.querySelector(".achrplcelem").replaceWith(key.fragment);
                    key.setParent(effect)
                }
                else{
                    if(key.content){
                        let selected=key
                        content.querySelector(".achrplcelem").replaceWith(selected.content);
                        details.childComponents.push(selected);
                        selected.mount();
                    }else{
                        content.querySelector(".achrplcelem").replaceWith(key);
                    }
                }
            }else{
                content.querySelector(".achrplcelem").replaceWith(key);
            }
    }else if(typeof key=="function"){
        let selected=key();
        let func=key;
        if(typeof selected=="object"){
            if(selected.content){
                content.querySelector(".achrplcelem").replaceWith(selected.content);
                details.childComponents.push(selected);
                selected.mount();
            }else{
                content.querySelector(".achrplcelem").replaceWith(selected);
            }
        }else if(typeof selected=="number"||typeof selected=="string"){
            let node=document.createTextNode(selected)
            content.querySelector(".achrplcelem").replaceWith(node);
            details.nodeLists.push({node,func,before:selected})
        }
    }[elements,keyList]=[null,null]})

    const datalist={};
    const states=(list)=>{
        let keys=Object.keys(list)
        keys.forEach((key)=>{
            datalist[key]=list[key]
        })

        //{{getter}}
        content.querySelectorAll("[state]").forEach((e)=>{
            //requested value
            let select=e.getAttribute("state");
            let getted_attr=e.getAttribute("state");
            let applied=getted_attr.split("(");
            let app=applied[0]
            let apply=null;
            if(applied.length>1){
                applied[1]=applied[1].slice(0,-1)
                apply=applied[1]
                apply=new Function(`return ${apply}`)()
            }
            switch(typeof datalist[app]){

                case "number":case "string":            
                let node=document.createTextNode(datalist[app])
                e.replaceWith(node);
                const getter=()=>{
                    return datalist[app]
                }
                details.nodeLists.push({node,func:getter,before:datalist[app]});
                break;

                case "function":
                    let result=datalist[app](apply)
                    let nodeF=document.createTextNode(result??"")
                    e.replaceWith(nodeF);
                    const getterF=()=>{
                        return datalist[app](apply)
                    }
                    details.nodeLists.push({node:nodeF,func:getterF,before:result});    
                ;break
            };
        })

        content.querySelectorAll("*").forEach((e)=>{
            let attrnames=e.getAttributeNames()
            attrnames.forEach((i)=>{
                if(i[0]=="@"){
                    let attr=i.slice(1);
                    let getted_attr=e.getAttribute(i);
                    let applied=getted_attr.split("(");
                    let apply=null;
                    if(applied.length>1){
                        applied[1]=applied[1].slice(0,-1)
                        apply=applied[1]
                        apply=new Function(`return ${apply}`)()
                    }
                    switch(attr){
                    case "onclick":case "oninput": case "onchange": case "onmouseover":
                            e[attr]=()=>{datalist[applied[0]??getted_attr](apply??e);
                            update()
                        }
                    ;break;
                    
                    case "model":
                        //setter
                        if(e.type=="text"||e.type=="textarea"){
                            e["oninput"]=()=>{
                                datalist[getted_attr]=e.value;
                                document.dispatchEvent(updatedEvent);
                            }
                        }else if(e.type=="checkbox"){
                            e["oninput"]=()=>{
                                datalist[getted_attr]=e.checked;
                                document.dispatchEvent(updatedEvent);
                            }
                        }
                        document.addEventListener("updated",function(){
                            if(e.type=="text"||e.type=="textarea"||e.type=="checkbox"){
                                e.value=datalist[getted_attr];
                            }else{
                                e.textContent=datalist[getted_attr];
                            }
                        })
                    break;
                    
                    case "class":
                        let result=datalist[applied[0]??getted_attr](apply);
                        if(result){
                            e.classList.add(result)
                        }
                        let before=result;
                        document.addEventListener("updated",function(){
                            if(datalist[applied[0]??getted_attr](apply)&&e.classList.contains(before)){
                                if(before!=datalist[applied[0]??getted_attr](apply)){
                                    e.classList.remove(before)
                                    e.classList.add(datalist[applied[0]??getted_attr](apply))
                                    before=datalist[applied[0]??getted_attr](apply)
                                }
                            }
                            else if(!datalist[applied[0]??getted_attr](apply)&&e.classList.contains(before)){
                                e.classList.remove(before)
                            }else  if(datalist[applied[0]??getted_attr](apply)&&!e.classList[datalist[applied[0]??getted_attr]()]){
                                e.classList.add(datalist[applied[0]??getted_attr](apply))
                                before=datalist[applied[0]??getted_attr](apply)
                            }
                    })
                    
                    case "hide": case "show":{
                        const control=()=>{
                            let result=datalist[applied[0]??getted_attr](apply??e);
                            if((attr=="hide"&&result)||attr=="show"&&!result){
                                e.style.display="none"
                            }else{
                                e.style.display=""
                            }
                        }
                        document.addEventListener("updated",function(){
                            control();
                        })
                    }
                    ;break;
                    case "visible": case "invisible":{
                        const control=()=>{
                            let result=datalist[applied[0]??getted_attr](apply);
                            if((attr=="invisible"&&result)||attr=="visible"&&!result){
                                e.style.visibility="hidden"
                            }else{
                                e.style.visibility="visible"
                            }
                        }
                        document.addEventListener("updated",control)
                    }
                    ;break;
                    case "destroy":{
                        const control=function(){
                            let result=datalist[applied[0]??getted_attr](apply??e);
                            if(result){
                                e.remove();
                                document.removeEventListener("updated",control)
                            }
                        }
                        document.addEventListener("updated",control);
                    };break;
                    default:{
                        switch(typeof datalist[applied[0]??getted_attr]){
                            case "number":case "string":{
                                const control=()=>{
                                    e[attr]=datalist[getted_attr]
                                }
                                document.addEventListener("updated",control)
                            };break;
                            case "function":{
                                const control=()=>{
                                    e[attr]=datalist[applied[0]??getted_attr](apply)
                                }
                                document.addEventListener("updated",control)
                            };break;
                        }
                    }
                    ;break;
                    }
                    
                    e.removeAttribute(i)
                }
            })
        })
        //State Updates
        document.addEventListener("updated",()=>update());
        document.dispatchEvent(updatedEvent);
    }

    let unmount={
        callback:null,
        remove:()=>{
            unmountCallback=null;
        },
        callback:()=>{
        if(details.childComponents.length>0){
                details.childComponents.forEach((e)=>{    
                        e.unmount.callback();
                        e.details.mounted=false;
                })
                document.dispatchEvent(updatedEvent);
        }
        details.onUnmount?details.onUnmount():"";
        details.onUnmount=null;
        details.mounted=false;
        details.target=null;
        details.active=false;
    }}

    const setRate=function(arg){
        function error(){
            console.warn("Anchors SetRate Error:\nRate Must Be A 'Whole Number 0,1,2....'")
        }
        if(typeof arg=="number"||typeof arg=="string"){
            if(arg>-1){
                let parsed=parseInt(arg)
                typeof parsed!="number"?error():details.rate=parsed;
            }else{
                error()
            }
        }
    }

    content.firstElementChild.setAttribute("anc-key",details.key);

    return {content,datalist,details,unmount,effect,signal,mount,trigger,update,localUpdate,setRate,states,ev};
}

//<page attribute="hello"/> => <page attribute="hello"></page>
const namer=(item)=>{
    let data = item;
    let last="/>";
    let first="<";
    let count=data.split(last).length-1;
    let counted =0;
    while(count>counted){
    let lastplac=data.search(last)-1;
    let i=0;
    let deval="";
    while(lastplac-i>=-1){
        if(data.charAt(lastplac-i)==first){
            deval=deval.split("").reverse().join("");//Yazılar Ters
            let name=deval.split(" ")[0];//İsim
            let props=deval.replace(name,"");//Geri Kalanı
            let completed=`<${name} ${props?props:""}></${name}>`;
            data=data.slice(0,lastplac-i)+completed+data.slice(lastplac+3,data.length);
            counted++;
            lastplac="";
            i=0;
            deval="";
        }else{
            deval=deval+data.charAt(lastplac-i);
        }
        i++;
    }
    }
    return data;
}

Object.prototype.unMount=function(){
    this.unmount.callback();
    document.body.querySelectorAll(`[anc-key='${this.details.key}']`).forEach((e)=>{
        e.remove();
    })
    delete this;
}

Object.prototype.onEffect=function(a){
    switch(typeof a){
        case "function":this.details.onEffect=a;break;
        case undefined:default:this.details.onEffect=null;break;
    }
}

Object.prototype.onUnmount=function(a){
    switch(typeof a){
        case "function":this.details.onUnmount=a;break;
        case undefined:default:this.details.onUnmount=null;break;
    }
}

Object.prototype.onMount=function(a){
    switch(typeof a){
        case "function":this.details.onMount=a;break;
        case undefined:default:this.details.onMount=null;break;
    }
}

Object.prototype.onSignal=function(a){
    switch(typeof a){
        case "function":this.details.onSignal=a;break;
        case undefined:default:this.details.onSignal=null;break;
    }
}

Object.prototype.onTrigger=function(e){
    switch(typeof e){
        case "function":this.details.onTrigger=e;break;
        case undefined:default:this.details.onTrigger=null;break;
    }
}

Object.prototype.memo=function(arg){
    if(arg){
        this.details.memo=arg;
    }else{
        this.details.memo=true;
    }

}

Object.prototype.component=function(qs,component){
    this.content.querySelectorAll(qs).forEach((e)=>{
        //Props
        let attrNames=e.getAttributeNames();
        let props={};
        attrNames.forEach((i)=>{
            props[i]=e.getAttribute(i)
        })
        //Slot
        let slotfragment=new DocumentFragment()
        let childrens=[...e.childNodes]
        childrens.forEach((i)=>{
            slotfragment.append(i)
        })
        console.log()
        let selected=component(props,(childrens.length>0?slotfragment:undefined))
        e.replaceWith(selected.content);
        this.details.childComponents.push(selected);
        selected.mount();
    })
}

//Html element creator
//c("element",{attributes:"attribute"},childs of element)
function c(arg,attribute,...childs) {
    let el=document.createElement(arg);
    
    if(attribute){
        Object.keys(attribute).forEach((attr,index)=>{
            el[attr]=Object.values(attribute)[index]
        });
    }

    [...childs].forEach((child)=>{
        switch(typeof child){
            case "string":case "number": el.append(document.createTextNode(child));break;
            case "object":if(child.content){el.append(child.content)}else{el.append(child)};
        }
    })
    return el;
}

const HTML=(str)=>{
    let template=document.createElement("template");
    let string="";
    str.forEach((e)=>string+=e)
    string=string.replaceAll("[{","<span anchor='").replaceAll("}]","'></span>");
    string=string.replaceAll("[[","mark='").replaceAll("]]","'")
    template.innerHTML=string;
    return template.content;
}


const simpleFor=function(a,t){
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

const value=(arg)=>{
    const object={
        oldValue:arg==undefined?"":typeof arg=="number"?arg:""||arg,
        nodeList:[],
        onCallback:null,
        onTrigger:null,
        parentList:[],
        type:"variable",
        updateAllNodes:function(){
            this.nodeList.forEach((e)=>{
                e.nodeValue=this.oldValue
            })
        },
        get value(){
            return this.oldValue
        },
        set value(newValue){
            if(this.onTrigger&&typeof this.onTrigger=="function"){this.onTrigger()}
            if(newValue!=this.oldValue){
                this.oldValue=newValue;
                this.updateAllNodes();
                this.parentList.forEach((e)=>e.update())
                if(this.onCallback&&typeof this.onCallback=="function"){this.onCallback()}
            }
        },
        get node(){
            let node=document.createTextNode(this.oldValue);
            this.nodeList.push(node);
            return node
        }
    }
    return object
}

const core={
    registeredRenders:[],
}

if(window.prototyped==undefined){
//PROTOTYPES
Object.prototype.selectElement=function(val){
    let data=this.querySelectorAll(val);
    if(data.length==1){
        return data[0]
    }
    return data;
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
    if(this.content){
        var data=this.content.querySelectorAll(`[anchor='${anchorName}']`);
    }else{
        //For PlainHTML
        var data=this.querySelectorAll(`[anchor='${anchorName}']`);
    }

    data.forEach((item)=>{
        item.removeAttribute("anchor");
    })

    return data;
}

Object.prototype.getNodes=function(anchorName){
if(this.content){
    var data=this.content.querySelectorAll(`[anchor='${anchorName}']`);
}else{
    //For PlainHTML
    var data=this.querySelectorAll(`[anchor='${anchorName}']`);
}

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
    core.registeredRenders.forEach((e)=>e.target[0]==this[0]?signal=true:"")
    //Clean
    if(signal==true){
        core.registeredRenders.forEach((e)=>{
            if(e.target[0]==this[0]){
                e.data.unmount.callback();
            }
        })
        core.registeredRenders=core.registeredRenders.filter((e)=>e.target[0]!=this[0])
    }
    let data=page(args)
    item.append(data.content)
    data.details.target=this;
    core.registeredRenders.push({target:this,data})
    data.mount();
}
})}

Object.prototype.getMark=function(mark){
    if(this.content){
        var selected=this.content.selectElement(`[mark='${mark}']`)
    }else{
        var selected=this.selectElement(`[mark='${mark}']`)
    }

    if(selected.length>1){
        selected.forEach((e)=>{
            e.removeAttribute("mark");
        })
    }else{
        selected.removeAttribute("mark");
    }

    return selected;
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
}

const debounce = (func, delayGetter) => {
    let db
    return function() {
      clearTimeout(db)
      db = setTimeout(() =>
        func()
      , delayGetter())
    }
  }

//string to eval
const ev=(arg,pref)=>{
return new Function(`return  ${pref?pref+".":""}${arg}`)()
}

window.prototyped=true;