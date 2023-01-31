//Update
const updatedEvent=new Event("updated");
let mountEv=new Event("mount");

const Anchor={
    replacer:function(string){
        let str=string
        str=str.replace("<>","<div>").replace("</>","</div>");
        str=str.replaceAll("[-","<span delete='").replaceAll("-]","'></span>")
        str=str.replaceAll("[[","mark='").replaceAll("]]","'")
        str=str.replaceAll("[{","<span anchor='").replaceAll("}]","'></span>")
        str=str.replaceAll("{{","<span state='").replaceAll("}}","'></span>")
        str=str.replaceAll("{(","<span tnode='").replaceAll(")}","'></span>")
        str=this.namer(str);
        return str
    },
    namer:(item)=>{
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
    },
    rkg:()=>{
        let arr="";
        const chars="abcdefghijklmnoprstuxvyz_".split("");
        for(var i=0;i<=9;i++){
            arr=arr+chars[Math.floor(Math.random() * (24))]
        }
        return arr;
    },
    registeredComponents:new Map()
}

document.addEventListener("mount",()=>{
    Anchor.registeredComponents.forEach((component,key)=>{
        const target=document.querySelectorAll(key)
        if(target.length>0){
            target.render(component)
        }
    })
})

export const RegisterComponent=(key,component)=>{
    if(typeof key=="string"){
        Anchor.registeredComponents.set(key,component)
    }else if(typeof key=="function"){
        Anchor.registeredComponents.set(key.name,key)
    }
}

export function html(data,...keys){
    const details={
        nodeLists:[],
        onEffect:null,
        createEffect:null,
        onUnmount:null,
        onMount:null,
        onSignal:null,
        active:true,
        memo:false,
        mounted:false,
        rate:30,
        childComponents:[],
        key:Anchor.rkg(),
        target:null,
    }
    let elements=[];
    let keyList=[...keys];
    data.forEach((item,index)=>{
        elements.push(item);
        if(keyList[index]!=undefined)
        {elements.push(keyList[index])}})
    let page=document.createElement("template");
    let str="";
    elements.forEach((item)=>{typeof item=="string"?str+=item:str+=`<span class="achrplcelem"></span>`;})
    str=Anchor.replacer(str);
    page.innerHTML=str;
    let content=page.content;

    const effect=(arg)=>{
        if(details.active==true){
            typeof details.createEffect=="function"?details.createEffect():""
            let signal=false;
            details.nodeLists.forEach((e)=>{
                let result=e.func();
                if(e.before!=result){
                    e.node.nodeValue=result;
                    e.before=result;
                    if(typeof details.onEffect=="function"){
                        signal=true
                    }
                    content.dispatchEvent(updatedEvent)
                }
            })
            signal?details.onEffect(arg):"";
            if(details.childComponents.length>0&&arg!="local"){
                    details.childComponents.forEach((e)=>{    
                        if(e.details.memo==false&&e.type!=="HTML"){
                            e.effect(arg)
                        }
                    })
            }
        }
        signal(arg);
    }

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
    }

    let update=debounce(()=>{effect()},()=>details.rate);
    let localUpdate=debounce(()=>{effect("local")},()=>details.rate);
    ////////////////////////////////////////////////////////////////////////////
    [...keys].forEach((key)=>{
    if(typeof key=="object"||typeof key=="number"){
            if(Object.keys(key).length>0){
                if(key.type=="For"){
                    content.querySelector(".achrplcelem").replaceWith(key.fragment);
                    key.setParent(effect)
                }
                else{
                    if(key.content){
                        let selected=key
                        content.querySelector(".achrplcelem").replaceWith(selected.content);
                        details.childComponents.push(selected);
                        selected.mount();
                        document.dispatchEvent(mountEv,selected);
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
                if(selected["mount"]){
                    details.childComponents.push(selected)
                    selected.mount();
                }
                document.dispatchEvent(mountEv);
            }else{
                content.querySelector(".achrplcelem").replaceWith(selected);
            }
        }else if(typeof selected=="number"||typeof selected=="string"){
            let node=document.createTextNode(selected)
            content.querySelector(".achrplcelem").replaceWith(node);
            details.nodeLists.push({node,func,before:selected})
        }
    }[elements,keyList,page,str]=[null,null,null,null]})

    const datalist={};
    const states=(list)=>{
        let keys=Object.keys(list)
        keys.forEach((key)=>{
            datalist[key]=list[key]
        }

    )

        content.querySelectorAll("[state]").forEach((e)=>{
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
                if(i[0]=="@"||i[0]=="$"||i[0]=="_"){
                    const conditionalRender=()=>{
                    switch(i[0]){
                            case "@":content.dispatchEvent(updatedEvent);break;
                            case "$":document.dispatchEvent(updatedEvent);break;
                        }
                    }
                    let attr=i.slice(1);
                    let getted_attr=e.getAttribute(i);
                    let applied=getted_attr.split("(");
                    let apply=null;
                    if(applied.length>1){
                        applied[1]=applied[1].slice(0,-1)
                        apply=applied[1]
                        if(apply[0]=="'"&&apply[0]=='"'&&apply[0]=="`"){
                            apply=new Function(`return ${apply}`)()
                        }else if(apply[0]=="$"){
                            apply=new Function(`return ${datalist[apply.slice(1)]}`)()
                        }
                    }
                    switch(attr){
                    case "onclick":case "oninput": case "onchange": case "onmouseover":
                            e[attr]=()=>{datalist[applied[0]??getted_attr](apply??e);
                            conditionalRender();
                        }
                    ;break;
                    
                    case "model":
                        //setter
                        if(e.type=="text"||e.type=="textarea"){
                            e["oninput"]=()=>{
                                datalist[getted_attr]=e.value;
                                conditionalRender();
                            }
                        }else if(e.type=="checkbox"){
                            e["oninput"]=()=>{
                                datalist[getted_attr]=e.checked;
                                conditionalRender();
                            }
                        }
                        //getter
                        const updateModel=function(){
                            if(e.type=="text"||e.type=="textarea"||e.type=="checkbox"){
                                e.value=datalist[getted_attr];
                            }else{
                                e.textContent=datalist[getted_attr];
                            }
                        }
                        content.addEventListener("updated",updateModel);
                        document.addEventListener("updated",updateModel);

                    break;
                    
                    case "class":
                        let result=datalist[applied[0]??getted_attr](apply);
                        if(result){
                            e.classList.add(result)
                        }
                        let before=result;
                        const updateClass=function(){
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
                    }
                        content.addEventListener("updated",updateClass)
                        document.addEventListener("updated",updateClass)
                    
                    case "hide": case "show":{
                        const control=()=>{
                            let result=datalist[applied[0]??getted_attr](apply??e);
                            if((attr=="hide"&&result)||attr=="show"&&!result){
                                e.style.display="none"
                            }else{
                                e.style.display=""
                            }
                        }
                        content.addEventListener("updated",control)
                        document.addEventListener("updated",control)
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
                        content.addEventListener("updated",control)
                        document.addEventListener("updated",control)
                    }
                    ;break;
                    case "destroy":{
                        const control=function(){
                            let result=datalist[applied[0]??getted_attr](apply??e);
                            if(result){
                                e.remove();
                                content.removeEventListener("updated",control);
                                conditionalRender();
                            }
                        }
                        content.addEventListener("updated",control);
                        document.addEventListener("updated",control);
                    };break;
                    default:{
                        switch(typeof datalist[applied[0]??getted_attr]){
                            case "number":case "string":{
                                const control=()=>{
                                    e[attr]=datalist[getted_attr]
                                }
                                content.addEventListener("updated",control);
                                document.addEventListener("updated",control);
                            };break;
                            case "function":{
                                const control=()=>{
                                    e[attr]=datalist[applied[0]??getted_attr](apply)
                                }
                                content.addEventListener("updated",control);
                                document.addEventListener("updated",control);
                            };break;
                          
                        }
                    }
                    ;break;
                    }
                    
                    e.removeAttribute(i)
                }
            })
        })
        content.dispatchEvent(updatedEvent)
    }

    const [$,$$,_]=[{},{},{}]
    $$$_($,$$,_,content)

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
        details.mounted=false;
        details.target=null;
        details.active=false;
    }}

    //State Updates
    update();
    document.addEventListener("updated",()=>update());
    content.addEventListener("updated",()=>update());
    content.firstElementChild.classList.add(details.key);

    document.dispatchEvent(updatedEvent);
    return {content,datalist,details,unmount,effect,signal,mount,update,localUpdate,states,$,_,$$};
}

export const GlobalUpdate=()=>{
    document.dispatchEvent(updatedEvent);
}

export const OnGlobalUpdate=(func)=>{
    document.addEventListener("updated",func)
}


export const HTML=(str)=>{
    let template=document.createElement("template");
    let string="";
    let type="HTML";
    let key=Anchor.rkg();
    const details={
        onUnmount:null,
        onMount:null,
    }
    str.forEach((e)=>string+=e)
    string=Anchor.replacer(string);
    string=Anchor.namer(string);
    template.innerHTML=string;
    let content=template.content;

    const [$,$$,_]=[{},{},{}]
    $$$_($,$$,_,content)

    const mount=()=>{
        typeof details.onMount=="function"?details.onMount():"";
        document.dispatchEvent(mountEv);
    }

    const unmount={
        callback:null,
        callback:()=>{
        typeof details.onUnmount=="function"?details.onUnmount():"";
        document.querySelectorAll("."+key).forEach((e)=>e.remove())
        }
    }

    content.firstElementChild.classList.add(key);
    return {content,$,_,$$,type,details,mount,unmount};
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
    if(Array.isArray(this)&&typeof this=="object"&&this.length>1){
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
}else{
    console.warn("Anchors :\nInvalid definition");
}}})

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
    if(data.details&&data.type!=="HTML"){
        data.details.target=this;
        core.registeredRenders.push({target:this,data})
        data.mount();
    }else if(data.type==="HTML"){
        data.mount();
    }
}
})}

Object.prototype.createEffect=function(arg){
    this.details.createEffect=arg;
}


Object.prototype.slot=function(arg){
    if(arg){
        this.content.querySelector("slot").replaceWith(arg)
    }else{
        console.warn("Anchors Slot Error:\nSlot is not defined");
        this.content.querySelectorAll("slot").forEach((e)=>e.remove());
    }
}

Object.prototype.setRate=function(arg){
        function error(){
            console.warn("Anchors SetRate Error:\nRate Must Be A 'Whole Number 0,1,2....'")
        }
        if(typeof arg=="number"||typeof arg=="string"){
            if(arg>-1){
                let parsed=parseInt(arg)
                typeof parsed!="number"?error():this.details.rate=parsed;
            }else{
                error()
            }
        }
}

//unmounts and kills component
Object.prototype.kill=function(){
    this.unmount.callback();
    document.body.querySelectorAll(`.${this.details.key}`).forEach((e)=>{
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

Object.prototype.memo=function(arg){
    if(arg==true||arg==undefined||arg==null){
        this.details.memo=true;
    }else{
        this.details.memo=false;
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
        let selected=component(props,(childrens.length>0?slotfragment:undefined))
        e.replaceWith(selected.content);
        if(this.type!=="HTML"&&selected.mount){
            this.details.childComponents.push(selected);
            selected.mount();
        }else{
            selected.mount();
        }
    })
}

//boilerplate of attribute setting
const a=(attribute,object,event)=>{        
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


}

//prevents unnecessary renders
const debounce = (func, delayGetter) => {
    let db
    return function() {
      clearTimeout(db)
      db = setTimeout(() =>
        func()
      , delayGetter())
    }
  }

window.prototyped=true;

const $$$_=($,$$,_,content)=>{
    content.querySelectorAll("[anchor]").forEach((e)=>{
        let anchorName=e.getAttribute("anchor");
        $[anchorName]=e
        e.removeAttribute("anchor")
    })
    content.querySelectorAll("[mark]").forEach((e)=>{
        let markName=e.getAttribute("mark");
        _[markName]=e
        e.removeAttribute("mark")
    })
    content.querySelectorAll("[tnode]").forEach((e)=>{
        let nodeName=e.getAttribute("tnode");
        let textNode=document.createTextNode("");
        e.replaceWith(textNode)
        $$[nodeName]=textNode
    })

    content.querySelectorAll("[delete]").forEach((el)=>{el.remove()});
}

