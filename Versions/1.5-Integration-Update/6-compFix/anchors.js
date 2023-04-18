/*OPEN*/ 
(()=>{
/*CLOSE*/
const warn=(arg)=>{
    console.warn("Anchors Warn :\n"+arg)
}
const Anchor={
    replacer:function(string){
        let end="'></span>"
        let str=string.replaceAll("<>","<div>").replaceAll("</>","</div>").replaceAll("[-","<span delete='").replaceAll("-]",end).replaceAll("{{","<span state='").replaceAll("}}",end)
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
        for(var i=0;i<=9;i++){
            arr=arr+"abcdefghijklmnoprstuxvyz_".split("")[Math.floor(Math.random() * (24))]
        }
        return arr;
    },
    valueTypeControl(type){
        return ["text","textarea","range","number","file","color","date","datetime-local","email","hidden","image","month","password",
        "search","tel","time","url","week"].includes(type)
    },
    checkedTypeControl(type){
        return ["radio","checkbox"].includes(type)
    },
    registeredComponents:new Map()
}

/*innerhtml*/
const createElement=(arg)=>{
    let temp=document.createElement("template");
    temp.innerHTML=arg;
    return temp.content
}

//UNIQUE SEED
const updateSeed="UPDATE_"+Anchor.rkg();
const isProxy=Symbol("PROXY");
const updatedEvent=new Event(updateSeed);

Object.prototype.loadComponents=function(){
    Anchor.registeredComponents.forEach((component,key)=>{
        this.component(key,component)
    })
}

const compile=(arg)=>{
    new Function(`return ${arg}`)()
}

const isonEvents=(arg)=>arg.slice(0,2)=="on"?true:false

const MethodUpdate=(content,state)=>{
    content.querySelectorAll("*").forEach((e)=>{
                let attrnames=e.getAttributeNames();
                if(state){
                    attrnames.forEach((i)=>{
                        if(i[0]="$"){
                            let attr=i.slice(1);
                            let getted_attr=e.getAttribute(i);
                            let applied=getted_attr.split("(");
                            let apply=null;
                            if(applied.length>1){
                                applied[1]=applied[1].slice(0,-1)
                                apply=applied[1]
                                if(apply[0]=="'"||apply[0]=='"'||apply[0]=="`"){
                                    apply=apply.replaceAll("'","").replaceAll('"',"").replaceAll("`","").toString()
                                }else if(typeof compile(apply)=="number"){
                                    apply=compile(apply)
                                }else if(apply[0]=="$"){
                                    apply=compile(prox[apply.slice(1)])
                                }
                            }
                            if(isonEvents(attr)){
                    e[attr]=()=>{state[applied[0]??getted_attr](apply??e)}
                    if(e[applied[0]??getted_attr]){e.removeAttribute(i)}
                }
                }})
                }
            })
}

//EXPORT
const RegisterComponent=(key,component)=>{
    if(typeof key=="string"){
        Anchor.registeredComponents.set(key,component)
    }else if(typeof key=="function"){
        Anchor.registeredComponents.set(key.name,key)
    }else if(key.length>0&&Array.isArray(key)){
        key.forEach((k)=>{
            Anchor.registeredComponents.set(k.name,k)
        })
    }
}

const styleScoper=(content)=>{
    if(content.querySelector("style[scoped]")){
        let isScoped=content.querySelectorAll("style[scoped]")
        if(isScoped.length){
            let scopekey=Anchor.rkg();
            isScoped.forEach((scoped)=>{
                let split=scoped.textContent.split("}");
                split.forEach((i,ind)=>{
                    let end=i;
                    let newStyle="."+scopekey+">"+end;
                    split[ind]=newStyle;
                })
                scoped.textContent="";
                split.forEach((i,ind)=>{
                    if(ind!=split.length){
                        scoped.textContent+=i+"}"
                    }
            })})
            content.querySelectorAll("*").forEach((e)=>{
                if(e.nodeName!="STYLE"){
                    e.classList.add(scopekey)
                }
            })
            
        }
        }
}

//EXPORT
const html=(data,...keys)=>{
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
        key:("__"+Anchor.rkg()+"__"),
        target:null,
        childUpdates:[],
        childFor:[],
    }

    let elements=[];
    let keyList=[...keys];
    data.forEach((item,index)=>{
        elements.push(item);
        if(keyList[index]!=undefined)
        {elements.push(keyList[index])}})
    let str="";
    elements.forEach((item)=>{typeof item=="string"?str+=item:str+=`<span class="achrplcelem"></span>`;})
    str=Anchor.replacer(str,details.key);
    let content=createElement(str)
    content.children.length!=1?warn("There must be only one parent element"):""
    styleScoper(content)
    const effect=(arg)=>{
        if(!FEC.isConnected&&details.mounted){
            unmount.callback();
        }else if(details.mounted||document.querySelectorAll("."+details.key).length){
            typeof details.createEffect=="function"?details.createEffect():""
            if(details.childUpdates.length){details.childUpdates.forEach((f)=>f())}
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
                        if(e.details.memo==false){
                            e.effect(arg)
                        }
                    })
            }
        }
        //MOUNTED
        if(FEC.isConnected){
            signal(arg);
            if(details.childFor.length){details.childFor.forEach((f)=>f(typeof method?method:null))}
        }
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
            details.active=true;
        }
    }

    let update=debounce(()=>{effect()},()=>details.rate);
    let localUpdate=debounce(()=>{effect("local")},()=>details.rate);
    //
    [...keys].forEach((key)=>{
    let temp=content.querySelector(".achrplcelem");
    
    if(key instanceof Promise){
        let div=document.createElement("div")
        temp.replaceWith(div);
        const get=async(method)=>{
                let res=await key;
                let content=createElement(res.join(""))
                MethodUpdate(content,method)
                diff(div,content)
        }
        details.childFor.push((method)=>{get(method)})
    } 
    if(typeof key=="object"||typeof key=="number"){
            if(Object.keys(key).length>0){
                    if(key.content){
                        let selected=key
                        temp.replaceWith(selected.content);
                        details.childComponents.push(selected);
                        selected.mount();
                    }else{
                        temp.replaceWith(key);
                    }
            }else{
                temp.replaceWith(key);
            }
    }else if(typeof key=="function"){
        let selected=key();
        let func=key;
        //boilerplate
        const b=()=>{
            let div=document.createElement("div")
            temp.replaceWith(div);
            return div
        }
        if(selected instanceof Promise||key.constructor.name=="AsyncFunction"){
            let div=b();
            const get=async(method)=>{
                let res=await key();
                    let content=createElement(res.join(""))
                    MethodUpdate(content,method)
                    diff(div,content)
            }
                details.childFor.push((method)=>{get(method)})
        }else if(Array.isArray(selected)){
            const get=(method)=>{
                let content=createElement(key().join(""))
                MethodUpdate(content,method)
                return content
            }
            let div=b();
            diff(div,get())
            details.childFor.push((method)=>{diff(div,get(method))})
        }else if(typeof selected=="object"){
            if(selected.content){
                temp.replaceWith(selected.content);
                if(selected["mount"]){
                    details.childComponents.push(selected)
                    selected.mount();
                }
            }else{
                temp.replaceWith(selected);
            }
        }else if(typeof selected=="number"||typeof selected=="string"||typeof selected=="boolean"){
            let node=document.createTextNode(selected)
            temp.replaceWith(node);
            details.nodeLists.push({node,func,before:selected})
        }else if(typeof selected=="null"||typeof selected=="undefined"){
            let i=0;
            let int=setInterval(()=>{
                let res=key()
                //default max 6 seconds
                if(res||i>=20){
                    clearInterval(int)
                    if(res){
                        let node=document.createTextNode(res)
                        temp.replaceWith(node);
                        details.nodeLists.push({node,func,before:res})
                    }
                }else{
                    i++
                }
            },300)
        }
    }
})

    const states=(list)=>{
        if(list.__SYMBOL__!==isProxy){
        const state=createStore(list)
        content.registerStore(state)
        return state
        }else{
            content.registerStore(list)
        }
    };

    let method={};
    const methods=(list)=>{
        let keys=Object.keys(list)
        keys.forEach((key)=>{
            method[key]=list[key]
        })

        method=new Proxy(method,{
            get(target,value){
                update()
                return target[value]
            }            
        })

        MethodUpdate(content,method)
        return method
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
        details.onUnmount&&details.mounted==true?details.onUnmount():"";
        details.mounted=false;
        details.target=null;
        details.active=false;
    }}

    //State Updates
    update();
    document.addEventListener(updateSeed,()=>update());
    content.addEventListener(updateSeed,()=>update());
    
    content.loadComponents();
    let FEC=content.firstElementChild

    const querySelector=(arg)=>{
        return content.querySelector(arg)
    }
    const querySelectorAll=(arg)=>{
        return content.querySelectorAll(arg)
    }
    const getElementById=(arg)=>{
        return content.getElementById(arg)
    }

    var object={querySelector,querySelectorAll,getElementById,content:FEC,details,unmount,effect,signal,mount,update,localUpdate,states,methods}
    return object;
}

const diff=(first,second,confirmed)=>{
    
    //Check Deprecated Folder - Simple But Effective
    const classDiff=(st,nd)=>st.className!=nd.className?st.className=nd.className:""

    if(!first.isEqualNode(second)){
        let firstArray=Array.from(first.childNodes);
        let firstLength=firstArray.length;
        let secondArray=Array.from(second.childNodes);
        let secondLength=secondArray.length;
        let differencies=Math.abs(firstLength-secondLength)
        if(differencies){
            if(firstLength>secondLength){
                //remove
                while(differencies>0){
                    if(!first.isEqualNode(second)){
                            first.childNodes[Array.from(first.childNodes).length-1].remove()
                    }
                    differencies--
                }
                diff(first,second)
            }else if(secondLength>firstLength){
                //push
                while(differencies>0){
                    if(!first.isEqualNode(second)){
                    first.append(secondArray[secondArray.length - 1].cloneNode(true))
                    secondArray.pop();
                    }
                    differencies--
                }
                diff(first,second)
            }
        }else{
            firstArray.forEach((e,index)=>{
                if(!e.isEqualNode(secondArray[index])){
                    if(e.nodeType==3&&secondArray[index].nodeType==3){
                        if(e.textContent!=secondArray[index].textContent){
                            e.nodeValue=secondArray[index].textContent;
                        }
                    }else{
                        if(e.nodeType!=secondArray[index].nodeType){
                            e.replaceWith(secondArray[index].cloneNode(true))
                        }else{
                            if(e.nodeName!=secondArray[index].nodeName){
                                e.replaceWith(secondArray[index].cloneNode(true))
                            }else{
                                if(e.nodeType==1&&secondArray[index].nodeType==1){
                                    let firstNames=e.getAttributeNames()
                                    let secondNames=secondArray[index].getAttributeNames();
                                    let diffAttrNumber=Math.abs(firstNames.length-secondNames.length)
                                        if(secondNames.length==firstNames.length){
                                            secondNames.forEach((attr,ind)=>{
                                            //class için olaylar farklı
                                            if(attr!="class"){
                                                if(e.getAttribute(attr)!=secondArray[index].getAttribute(attr)&&attr[0]!="$"){
                                                    e.setAttribute(attr,secondArray[index].getAttribute(attr))
                                                }
                                            }else{
                                                classDiff(e,secondArray[index])
                                            }
                                        })
                                    }else{
                                        //attribute ekle çıkar işlemleri
                                            if (firstNames.length > secondNames.length) {
                                                //removeattribute
                                                        let differentAttrs=firstNames.filter((attribute)=>{
                                                            return !secondNames.includes(attribute)
                                                        })
                                                        if(differentAttrs.length){
                                                            differentAttrs.forEach((diffed)=>{
                                                            e.removeAttribute(diffed)
                                                            })
                                                        }
                                                        let sameAttrs=firstNames.filter((attribute)=>{
                                                            return secondNames.includes(attribute)
                                                        })
                                                        if(sameAttrs.length){
                                                            sameAttrs.forEach((k)=>{
                                                            if(e.getAttribute(k)!=secondArray[index].getAttribute(k)){
                                                                if(k!="class"){
                                                                    e.setAttribute(k,secondArray[index].getAttribute(k))
                                                                }else{
                                                                    classDiff(e,secondArray[index])
                                                                }

                                                            }
                                                        })
                                                        }
                                                diff(e, secondArray[index])
                                            } else if (secondNames.length > firstNames.length) {
                                                //addAttr
                                                    if (!e.isEqualNode(secondArray[index])) {
                                                        let differentAttrs=secondNames.filter((attribute)=>{
                                                            return !firstNames.includes(attribute)
                                                        })
                                                        if(differentAttrs.length){
                                                            differentAttrs.forEach((diffed)=>{
                                                                if(diffed[0]!="$"){
                                                                    e.setAttribute(diffed,secondArray[index].getAttribute(diffed))
                                                                }

                                                            })
                                                        }
                                                        let sameAttrs=secondNames.filter((attribute)=>{
                                                            return firstNames.includes(attribute)
                                                        })
                                                        if(sameAttrs){
                                                            sameAttrs.forEach((k,jndex)=>{
                                                            if(e.getAttribute(k)!=secondArray[index].getAttribute(k)){
                                                                if(k!="class"){
                                                                    e.setAttribute(k,secondArray[index].getAttribute(k))
                                                                }else{
                                                                    classDiff(e,secondArray[index])
                                                                }   
                                                            }
                                                        })
                                                        }
                                                    }
                                                diff(e, secondArray[index])
                                            }
                                    }
                                }
                                if(!e.isEqualNode(secondArray[index])){
                                    diff(e,secondArray[index],true)//confirm
                                }
                                if(confirmed){
                                    return 
                                }
                            }
                        }

                    }
                }
            })
        }
    }
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
    if((Array.isArray(this)||NodeList.prototype.isPrototypeOf(this))&&typeof this=="object"&&this.length>0){
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
    warn("Invalid definition");
}}})

Object.prototype.render=function(page,args){
    if(typeof page=="object"){
        this.textContent="";
        this.append(page.content?page.content:page)
        if(page.content&&page.details){
            page.content.loadComponents();
            page.content.querySelectorAll("*").forEach((e)=>e.loadComponents())
            if(page.content){
                page.mount();
            }
        }else if(page.querySelectorAll("*")){
            page.querySelectorAll("*").forEach((e)=>e.loadComponents())
        }

    }else if (typeof page=="function"){
        this.textContent="";
        let pages=page(args);
        pages.content.selectElement("[anchor]").forEach((i)=>{i.removeAttribute("anchor")});
        this.append(pages.content)
        pages.content.loadComponents();
        //
        if(pages.details){
            pages.details.target=this;
            core.registeredRenders.push({target:this,pages})
            pages.mount();
        }
        //
        document.querySelectorAll("."+pages.details.key).forEach((e)=>e.loadComponents())
        document.dispatchEvent(updatedEvent)
    }
}

NodeList.prototype.render=function(page,args){
this.forEach((item)=>{
item.textContent="";
if(typeof page=="object"){
    if(page.content&&item){
        item.append(page.content)
        page.details.mounted=true
    }else{
        item.append(page.cloneNode(true))
    }
}
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
    data.content.loadComponents();
    item.append(data.content)
    if(data.details){
        data.details.target=this;
        core.registeredRenders.push({target:this,data})
        data.mount();
    }
    data.content.querySelectorAll("."+data.details.key).forEach((e)=>e.loadComponents())
    document.dispatchEvent(updatedEvent)
}})}

Object.prototype.createEffect=function(arg){
    this.details.createEffect=arg;
}


Object.prototype.slot=function(arg){
    if(arg){
        this.content.querySelector("slot").replaceWith(arg)
    }else{
        this.content.querySelectorAll("slot").forEach((e)=>e.remove());
    }
}

Object.prototype.setRate=function(arg){
        function error(){
            warn("Rate Must Be A 'Whole Number'")
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

Object.prototype.component=function(el,obj){
    let target=this.content??this
    let object = typeof el=="string"?obj:el
    let name=typeof el!="string"?(typeof el=="function"?el.name:Object.keys(el)[0]):el
    if(typeof object=="object"&&typeof el=="string"){
        target.querySelectorAll(el).forEach((e)=>{
            e.render(obj)
        })
    }else if(typeof object=="function"){
        target.querySelectorAll(name).forEach((e)=>{
            //Props
            let attrNames=e.getAttributeNames();
            let props=new Object();
            attrNames.forEach((i)=>{
                if(typeof i){
                    props[i]=e.getAttribute(i)
                }
            })
            //Slot
            let slotfragment=new DocumentFragment()
            let childrens=[...e.childNodes]
            childrens.forEach((i)=>{
                slotfragment.append(i)
            })
            let selected=object(props??undefined,(childrens.length>0?slotfragment:undefined))
            e.replaceWith(selected.content?selected.content:selected);
            if(this.type==="html"&&selected.mount&&typeof this.details.childComponents){
                this.details.childComponents.push(selected);
                selected.mount();
            }else{
                selected.mount?selected.mount():selected
            }
        })
    }
}}

//decreases unnecessary count of renders for "html" updates
const debounce = (func, delayGetter) => {
    let db
    return function() {
      clearTimeout(db)
      db = setTimeout(() =>
        func()
      , typeof delayGetter=="function"?delayGetter():delayGetter)
    }
  }

window.prototyped=true;

//data prox
function Returner(obj, prop) {
    if(typeof obj === 'undefined') {
        return false;
    }
    var _index = prop.indexOf('.')
     if(_index > -1) {
         return Returner(obj[prop.substring(0, _index)], prop.substr(_index + 1));
        }
    return obj;
}

const STATES=(element,ARRAY,list,prox)=>{
    element.querySelectorAll("[state]").forEach((e)=>{
        let getted_attr=e.getAttribute("state");
        let applied=getted_attr.split("(");
        let app=applied[0].trim();//trim deletes " "
        let apply=null;
        if(applied.length>1){
            applied[1]=applied[1].slice(0,-1)
            apply=applied[1]
            apply=new Function(`return ${apply}`)()
        }
        let split=app.split(".")
        let last=[split[split.length-1]].join("")
        let re=()=>Returner(prox,app)
        function getResult(){
            return typeof re()[last]=="function"?re()[last](apply):re()[last]
        }
        switch(typeof re()[last]){
            case "number":case "string":
            let node=document.createTextNode(getResult())
            e.replaceWith(node);
            const getter=()=>{
                let result=getResult()
                node.textContent!==result?node.nodeValue=result:""
            }
            
            ARRAY.push({value:getted_attr,callback:getter,el:node});
            break;
            case "function":
                let result=()=>getResult()
                let nodeF=document.createTextNode(result()??"")
                e.replaceWith(nodeF);
                const getterF=()=>{
                    let result=getResult()
                    nodeF.textContent!==result?nodeF.nodeValue=result:""
                }
                ARRAY.push({value:"*",callback:getterF,el:nodeF});
            ;break
            case "object":/*elements*/warn("Please do not use object for 'createStore'");break;
        };
    });

    element.querySelectorAll("*").forEach((e)=>{
        let attrnames=e.getAttributeNames()
        attrnames.forEach((i)=>{
            
            if(i[0]=="$"||i[0]==":"||i[0]=="@"||i[0]=="#"||i[0]=="."||i[0]=="*"&&typeof list[e.getAttribute(i)]){
                let attr=i.slice(1);
                let getted_attr=e.getAttribute(i);
                let applied=getted_attr.split("(");
                let app=applied[0].trim();
                let apply=null;
                let split=app.split(".")
                let last=[split[split.length-1]].join("");
                let re=()=>Returner(prox,app)
                function getResult(){
                    return typeof re()[last]=="function"?re()[last](apply):re()[last]
                }
                //boilerPlate
                const bp=(control,arg,func)=>{
                    ARRAY.push({value:(func?"*":getted_attr),callback:control,el:e})
                    if(arg){
                        if(re()[last]!=null&&re()[last]!=undefined)e.removeAttribute(i)
                    }
                    control();
                }
                if(applied.length>1){
                    applied[1]=applied[1].slice(0,-1)
                    apply=applied[1]
                    if(apply[0]=="'"||apply[0]=='"'||apply[0]=="`"){
                        apply=apply.replaceAll("'","").replaceAll('"',"").replaceAll("`","").toString()
                    }else if(typeof compile(apply)=="number"){
                        apply=compile(apply)
                    }else if(apply[0]=="$"){
                        apply=compile(prox[apply.slice(1)])
                    }
                }
                if(isonEvents(attr)){
                    //Equal Operator
                    const cl=(arg)=>{
                        return arg.replaceAll("'","").replaceAll('"',"").replaceAll("`","")
                    }
                    if(app.includes("=")){
                        let sp=app.split("=");
                        let end=sp[0].split(".");
                        let res=Returner(prox,sp[0]);
                        res[end[end.length-1]]!=undefined?e.removeAttribute(i):""
                        if(cl(sp[1])){
                            e[attr]=()=>{res[end[end.length-1]]=cl(sp[1])}
                        }else{
                            e[attr]=()=>{res[end[end.length-1]]=Number(sp[1])}
                        }
                    }else if(app.includes("++")){
                        let variable=app.split("++")
                        let spl=variable[0].split(".")
                        Returner(prox,variable[0])[spl[spl.length-1]]!=undefined?e.removeAttribute(i):""
                        e[attr]=()=>Returner(prox,variable[0])[spl[spl.length-1]]++
                    }else if(app.includes("--")){
                        let variable=app.split("--")
                        let spl=variable[0].split(".")
                        Returner(prox,variable[0])[spl[spl.length-1]]!=undefined?e.removeAttribute(i):""
                        e[attr]=()=>Returner(prox,variable[0])[spl[spl.length-1]]--
                    }else if(re()[last]){
                        e.removeAttribute(i)
                        e[attr]=()=>{re()[last](apply??e)}
                    }
                }else{
                switch(attr){
                case "model":
                    if(typeof re()[last])e.removeAttribute(i)
                    if(Anchor.valueTypeControl(e.type)){
                        e["oninput"]=()=>{
                            re()[last]=e.value;
                        }
                    }else if(Anchor.checkedTypeControl(e.type)){
                        e["oninput"]=()=>{
                            re()[last]=e.checked;
                        }
                    }
                    //getter
                    const updateModel=function(){
                        let r=re()[last];
                        if(Anchor.valueTypeControl(e.type)){
                            e.value=r
                        }else if(Anchor.checkedTypeControl(e.type)){
                            e.textContent=r
                        }
                    }
                    bp(updateModel)
                break;
                
                case "class":
                    let result=getResult();
                    if(result!==undefined){
                        e.classList.add(result)
                    }
                    let before=result;
                    const updateClass=function(){
                        let result=getResult();
                        if(result&&e.classList.contains(before)){
                            if(before!=result){
                                e.classList.remove(before)
                                e.classList.add(result)
                                before=result
                            }
                        }
                        else if(!result&&e.classList.contains(before)){
                            e.classList.remove(before)
                        }else  if(result&&!e.classList[result]){
                            e.classList.add(result)
                            before=result
                        }
                }
                    bp(updateClass,true,typeof re()[last]=="function")
                ;break;
                case "hide": case "show":{
                    const control=()=>{
                        let result=getResult();
                        if((attr=="hide"&&result)||attr=="show"&&!result){
                            e.style.display="none"
                        }else{
                            e.style.display=""
                        }
                    }
                    bp(control,true,typeof prox[applied[0]]=="function")
                }
                ;break;
                case "visible": case "invisible":{
                    const control=()=>{
                        let result=getResult();
                        if((attr=="invisible"&&result)||attr=="visible"&&!result){
                            e.style.visibility="hidden"
                        }else{
                            e.style.visibility="visible"
                        }
                    }
                    bp(control,true,typeof re()[last]=="function")
                }
                ;break;
                case "destroy":{
                    const control=function(){
                        let result=getResult();
                        if(result){
                            e.remove();
                        }
                    }
                    bp(control,true,typeof re()[last]=="function")
                };break;
                default:{
                        if(attr=="click"){
                            warn("Please use '$onclick' instead of '$click'\n$click event causes infinite loop")
                        }else{
                            const control=()=>{
                                if(e[attr]){
                                    e[attr]=getResult()
                                }else{
                                    e.setAttribute(attr,getResult())
                                }
                                }
                            bp(control,true,typeof re()[last]=="function")
                        }
                    }
                ;break;
                }
            }
        }})
    })
    typeof prox["computed"]=="function"?prox["computed"]():""
}

//EXPORT
const createStore=(list)=>{
    let ARRAY=[];
    const srch=()=>ARRAY=ARRAY.filter((e)=>e.el);
    const computed=()=>{
        if(typeof prox["computed"]==="function"){
            prox["computed"]();
        };
    }
    
    let keys=[]
    let codes=0
    const handler=()=>{
        return {
            get(target, key) {
                if (typeof target[key]=="object"||Array.isArray(target[key])) { 
                   key!="computed"?keys.push(key):""; 
                   codes=1
                   return new Proxy(target[key], handler());
                }else if(target.__SYMBOL__==undefined){
                    codes=2;
                }else{
                    codes=3
                    keys=[key!="computed"?key:""];
                }
                
                return target[key];
            },
            set(target, key, value) {
                const result=Reflect.get(target,key)
                let valid
                keys=keys.filter((e)=>e!="")
                switch (codes) {
                    case 3:valid=key;break;
                    case 2:valid=keys.join(".");break;
                    case 1:valid=keys.join(".");break;
                }
                keys=[];
                if(valid&&codes!=3){
                        let valids=valid.split(".")
                        if(Returner(prox,valid)[valids[valids.length-1]]&&codes!=2){
                            valid+="."+key
                        }else if(codes==2){
                            if(Returner(prox,valids.join("."))==false){
                                valids.shift()
                                Returner(prox,valids.join("."))==false?(
                                    valids.shift(),
                                    valids.push(key)
                                ):""
                            }else{
                                valids.shift();
                                valids.push(key);
                            }
                            valid=valids.join(".")
                        }
                }                
                if(result!==value){
                    //1-join+key
                    //2-join
                    //3-key
                    Reflect.set(target,key,value);
                    let filtered=ARRAY.filter((e)=>e.value===valid||e.value==="*")
                    filtered.forEach((e)=>e.callback(prox))
                    target[key]=value
                }
                valid=""
                keys=[]
                codes=0
                computed();
                srch();
                return true;
            }
        }
    };
    const prox=new Proxy(list,handler())
    prox.__SYMBOL__=isProxy;

    prox.__REGISTER__=(e)=>{
        STATES(e,ARRAY,list,prox)
    }

    prox.__createCallback__=(func,array)=>{
        //TODO:Tekrar eden elemanlar silinecek
    if(typeof func=="function"){
        if(Array.isArray(array)){
            array.forEach((e)=>{
                ARRAY.push({el:document,value:e,callback:func})
            })
            codes=0
        }else if(typeof array=="string"){
            ARRAY.push({el:document,value:array,callback:func})
        }else{
            ARRAY.push({el:document,value:"*",callback:func})
        }
    }else{
        warn("createCallback must be a function")
        return
    }

    }

        computed();
        return prox


}

Object.prototype.createCallback=function(func,array){
    if(this.__SYMBOL__===isProxy){
        this.__createCallback__(func,array)
    }else{
        warn("createCallback must be a store element!")
    }
}

Object.prototype.registerStore=function(storeName){
    if(this.content){
        storeName.__REGISTER__(this.content)
    }else if(this){
        storeName.__REGISTER__(this)
    }
}

//EXPORT FOR GLOBAL
/*OPEN*/
window.html=html
window.createStore=createStore
window.RegisterComponent=RegisterComponent
window.createElement=createElement
})()
/*CLOSE*/

//FOR MODULE
//export {createStore,createElement,html,RegisterComponent}