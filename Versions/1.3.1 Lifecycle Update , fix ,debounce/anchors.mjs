export function html(data,...keys){
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
    //in development
    // {{x}} => Main.data["x"] eğer yoksa Main.functions["x"]
    /*const states={
        data:{
            //x:5,
            get x(){

            },
            set x(arg){

            }
        },
        functions:{
            //xPlusOne:()=>
        },
        attributes:{

        }
    }*/
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
    str=str.replaceAll("[-","<span delete='").replaceAll("-]","'></span>")
    str=str.replaceAll("[[","mark='").replaceAll("]]","'")
    str=str.replaceAll("[{","<span anchor='").replaceAll("}]","'></span>")
    str=str.replaceAll("{{","<span state='").replaceAll("}}","'></span>")
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
    const signal=(e)=>{
        if(details.onSignal&&details.mounted){
            details.onSignal(e);
        }
        //trigger({event:"signal",signal:e});
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
    }
    [elements,keyList]=[null,null]
    })
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
        }
        details.onUnmount?details.onUnmount():"";
        details.onUnmount=null;
        details.mounted=false;
        details.target=null;
        details.active=false;
    }}

    const setRate=function(arg){
        if(typeof arg=="number"||typeof arg=="string"){
            if(arg>-1){
                details.rate=parseInt(arg);
            }else{
                console.warn("Anchors SetRate Error:\nRate Must Be A 'Whole Number 0,1,2....'")
            }
        }
    }

    content.firstElementChild.setAttribute("anc-key",details.key);

    return {content,details,unmount,effect,signal,mount,trigger,update,localUpdate,setRate};
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
            case "object":if(child.content){el.append(child.content)}else{el.append(child)};
        }
    })
    return el;
}

export const HTML=(str)=>{
    let template=document.createElement("template");
    let string="";
    str.forEach((e)=>string+=e)
    string=string.replaceAll("{{","<span anchor='").replaceAll("}}","'></span>");
    string=string.replaceAll("[[","mark='").replaceAll("]]","'")
    console.log(string)
    template.innerHTML=string;
    return template.content;
}

//slightly buggy
export const For=function(a,t){
    const details={
        template:t,
        key:Math.random(),
        fragment:document.createElement("div"),
        unmountCallback:null,
        type:"For",
        parentEffect:null,
        mounted:false,
    }
    details.fragment.setAttribute("anc-key",details.key);

    const setParent=(e)=>{
        details.parentEffect=e
    }

    const setUnmount=(e)=>{
        typeof e==="function"?details.unmountCallback=e:console.warn("Anchor TypeError : For unmount callback must be a function")
    }
    //init
    
    let comp=a.map(details.template);
    comp.forEach((e)=>{
        details.fragment.append(e.content)
        e.details.target=details.fragment;
    })

    const update=()=>{
        if(typeof details.parentEffect==="function"){
            details.parentEffect();
            
        }
        comp.forEach((e)=>e.mount());
        comp.forEach((e)=>e.effect());
        comp.forEach((e)=>{e.signal()})
    };

    const mount=()=>{
        if(details.mounted==false){
            details.mounted=true;    
        }
        comp.forEach((e)=>e.mount());
        update();
        
    }

    const unmount=()=>{
        details.mounted=false;
        comp.forEach((e)=>e.unmount());
        let target=document.body.querySelectorAll("anc-key="+key)
        if(target.length>0){
            target.forEach((e)=>{e.remove()})
            if(details.unmountCallback&&typeof details.unmountCallback=="function"){
                details.unmountCallback();
            }
        }
    }

    const push=(object)=>{
        a.push(object);
        let el=details.template(a[a.length-1],a.length-1)
        el.details.target=details.fragment
        details.fragment.append(el.content);
        comp.push(el);
        comp.forEach((e)=>e.mount());
        update();
    };

    const remove=(object)=>{
            delete a[search(object,"index")];
            removeEmptyItems();
            update();
    }

    const length=()=>{
        return parseInt(a.length);
    }

    const search=($e,$a)=>{
        const object=$e;
        let is=$a=="index"?-1:false;
        const type=$a||"bool";
        a.forEach((e,index)=>{
            if(JSON.stringify(e)==JSON.stringify(object)){
                if(type=="bool"){
                    is=true
                }
                else if(type=="index"){
                    is=index
                }else{
                    console.warn("Anchors Search:TypeError Please use 'index' instead of "+$a)
                }
            }
        })
        return is
    }

    function removeEmptyItems(){
        a=a.filter(e => {
            if (
              typeof e === 'object' &&
              !Array.isArray(e) &&
              Object.keys(e).length === 0
            ) {
              return false;
            } else {
              return true;
            }
    })  }

    update()
    return {type:details.type,length,fragment:details.fragment,update,push,remove,array:a,mount,unmount,search,setParent,setUnmount}
}

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

export const value=(arg)=>{
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

//kill eval
window.eval="";


window.prototyped=true;