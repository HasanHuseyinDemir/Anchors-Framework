const updatedEvent=new Event("updated");
const Anchor={
    replacer:function(string){
        let str=string
        str=str.replace("<>","<div>").replace("</>","</div>");
        str=str.replaceAll("[-","<span delete='").replaceAll("-]","'></span>")
        str=str.replaceAll("[[","mark='").replaceAll("]]","'")
        str=str.replaceAll("[{","<span anchor='").replaceAll("}]","'></span>")
        str=str.replaceAll("{(","<span tnode='").replaceAll(")}","'></span>")
        str=str.replaceAll("{{","<span state='").replaceAll("}}","'></span>")
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

Object.prototype.loadComponents=function(){
    Anchor.registeredComponents.forEach((component,key)=>{
        this.component(key,component)
    })
}

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
                                if(apply[0]=="'"||apply[0]=='"'||apply[0]||"`"){
                                    apply=new Function(`return ${apply}`)()
                                }else if(typeof new Function(`return ${apply}`)()=="number"){
                                    apply=new Function(`return ${apply}`)()
                                }else if(apply[0]=="$"){
                                    apply=new Function(`return ${state[apply.slice(1)]}`)()
                                }
                            }
                            switch(attr){
                            case "onclick":case "oninput": case "onchange": case "onmouseover":    
                            e[attr]=()=>{state[applied[0]??getted_attr](apply??e)}
                            e.removeAttribute(i);
                            ;break;
                                
                        }}})
                }

            })
        }

export const RegisterComponent=(key,component)=>{
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
                split.forEach((i)=>{
    
                    scoped.textContent+=i+"}"
            })})
    
    
            content.querySelectorAll("*").forEach((e)=>{
                if(e.nodeName!="STYLE"){
                    e.classList.add(scopekey)
                }
            })
            
        }
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
    let page=document.createElement("template");
    let str="";
    elements.forEach((item)=>{typeof item=="string"?str+=item:str+=`<span class="achrplcelem"></span>`;})
    str=Anchor.replacer(str,details.key);
    page.innerHTML=str;
    let content=page.content;
    styleScoper(content)
    const effect=(arg)=>{
        if(!(!document.querySelectorAll("."+details.key).length||!content.isConnected)&&details.mounted){
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
                        if(e.details.memo==false&&e.type!=="HTML"){
                            e.effect(arg)
                        }
                    })
            }
        }
        signal(arg);
        if(details.childFor.length){details.childFor.forEach((f)=>f(state?state:method?method:{}))}
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
    ////////////////////////////////////////////////////////////////////////////
    [...keys].forEach((key)=>{
    if(typeof key=="object"||typeof key=="number"){
            if(Object.keys(key).length>0){
                if(key.type=="For"){
                    content.querySelector(".achrplcelem").replaceWith(key.fragment);
                    details.childFor.push(key.update);
                    key.update();
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
                if(selected["mount"]){
                    details.childComponents.push(selected)
                    selected.mount();
                }
            }else{
                content.querySelector(".achrplcelem").replaceWith(selected);
            }
        }else if(typeof selected=="number"||typeof selected=="string"){
            let node=document.createTextNode(selected)
            content.querySelector(".achrplcelem").replaceWith(node);
            details.nodeLists.push({node,func,before:selected})
        }
    }

    [elements,keyList,page,str]=[null,null,null,null]
})

    let state={};
    const states=function(list){
        let keys=Object.keys(list)
        keys.forEach((key)=>{
            state[key]=list[key]
        })
        state=new Proxy(state,{
            get: (target, key) => {
            typeof target["computed"]=="function"?target.computed():"",
            typeof target[key]=="function"?(update()):""
            return target[key];
        },
        set: (target, key, value) => {
            const result=Reflect.get(target,key)
            if(result!==value){
                Reflect.set(target,key,value);
                typeof target["computed"]=="function"?target["computed"]():""
                update();
            }
            return true;
            }
        })


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
            switch(typeof state[app]){
                case "number":case "string":            
                let node=document.createTextNode(state[app])
                e.replaceWith(node);
                const getter=()=>{
                    return state[app]
                }
                details.nodeLists.push({node,func:getter,before:state[app]});
                break;
                case "function":

                    let result=state[app](apply)
                    let nodeF=document.createTextNode(result??"")
                    e.replaceWith(nodeF);
                    const getterF=()=>{
                        return state[app](apply)
                    }
                    details.nodeLists.push({node:nodeF,func:getterF,before:result});    
                ;break
            };
        })

        content.querySelectorAll("*").forEach((e)=>{
            let attrnames=e.getAttributeNames()
            attrnames.forEach((i)=>{
                if(i[0]=="$"&&typeof list[e.getAttribute(i)]){
                    let attr=i.slice(1);
                    let getted_attr=e.getAttribute(i);
                    let applied=getted_attr.split("(");
                    let apply=null;
                    if(applied.length>1){
                        applied[1]=applied[1].slice(0,-1)
                        apply=applied[1]
                        if(apply[0]=="'"||apply[0]=='"'||apply[0]||"`"){
                            apply=new Function(`return ${apply}`)()
                        }else if(typeof new Function(`return ${apply}`)()=="number"){
                            apply=new Function(`return ${apply}`)()
                        }else if(apply[0]=="$"){
                            apply=new Function(`return ${state[apply.slice(1)]}`)()
                        }
                    }
                    switch(attr){
                    case "onclick":case "oninput": case "onchange": case "onmouseover":
                            if(state[applied[0]??getted_attr])e.removeAttribute(i)
                            e[attr]=()=>{state[applied[0]??getted_attr](apply??e);
                                update()
                            }
                    ;break;
                    
                    case "model":
                        //setter
                        if(typeof state[getted_attr])e.removeAttribute(i)
                        if(e.type=="text"||e.type=="textarea"){
                            e["oninput"]=()=>{
                                state[getted_attr]=e.value;
                            }
                        }else if(e.type=="checkbox"){
                            e["oninput"]=()=>{
                                state[getted_attr]=e.checked;
                            }
                        }
                        //getter
                        const updateModel=function(){
                            if(e.type=="text"||e.type=="textarea"||e.type=="checkbox"){
                                e.value=state[getted_attr];
                            }else{
                                e.textContent=state[getted_attr];
                            }
                        }
                        
                        details.childUpdates.push(updateModel)
                        content.addEventListener("updated",updateModel)
                        document.addEventListener("updated",updateModel);

                    break;
                    
                    case "class":
                        let result=typeof state[applied[0]??getted_attr]=="function"?state[applied[0]??getted_attr](apply):state[applied[0]??getted_attr]
                        if(result){
                            e.classList.add(result)
                        }
                        let before=result;
                        const updateClass=function(){
                            let result=typeof state[applied[0]??getted_attr]=="function"?state[applied[0]??getted_attr](apply):state[applied[0]??getted_attr]
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
                        details.childUpdates.push(updateClass)
                        content.addEventListener("updated",updateClass)
                        document.addEventListener("updated",updateClass)
                        if(typeof list[e.getAttribute(i)])e.removeAttribute(i)
                        ;break;
                    
                    case "hide": case "show":{
                        const control=()=>{
                            let result=typeof state[applied[0]??getted_attr]=="function"?state[applied[0]??getted_attr](apply??e):state[applied[0]??getted_attr]
                            if((attr=="hide"&&result)||attr=="show"&&!result){
                                e.style.display="none"
                            }else{
                                e.style.display=""
                            }
                        }
                        details.childUpdates.push(control)
                        content.addEventListener("updated",control)
                        document.addEventListener("updated",control)
                        if(state[applied[0]??getted_attr])e.removeAttribute(i)
                    }
                    ;break;
                    case "visible": case "invisible":{
                        const control=()=>{
                            let result=state[applied[0]??getted_attr](apply);
                            if((attr=="invisible"&&result)||attr=="visible"&&!result){
                                e.style.visibility="hidden"
                            }else{
                                e.style.visibility="visible"
                            }
                        }
                        details.childUpdates.push(control)
                        content.addEventListener("updated",control)
                        document.addEventListener("updated",control)
                        if(state[applied[0]??getted_attr])e.removeAttribute(i)
                    }
                    ;break;
                    case "destroy":{
                        const control=function(){
                            let result=state[applied[0]??getted_attr](apply??e);
                            if(result){
                                e.remove();
                                content.removeEventListener("updated",control);
                                content.dispatchEvent(updatedEvent);
                                details.childUpdates.control=null;
                            }
                        }
                        details.childUpdates.push(control)
                        content.addEventListener("updated",control);
                        document.addEventListener("updated",control);
                        if(state[applied[0]??getted_attr])e.removeAttribute(i)
                    };break;
                    default:{
                        switch(typeof state[applied[0]??getted_attr]){
                            case "number":case "string":{
                                const control=()=>{
                                    e[attr]=state[getted_attr]
                                }
                                details.childUpdates.push(control)
                                content.addEventListener("updated",control);
                                document.addEventListener("updated",control);
                                if(state[applied[0]??getted_attr])e.removeAttribute(i)
                            };break;
                            case "function":{
                                const control=()=>{
                                    e[attr]=state[applied[0]??getted_attr](apply)
                                }
                                details.childUpdates.push(control)
                                content.addEventListener("updated",control);
                                document.addEventListener("updated",control);
                                if(state[applied[0]??getted_attr])e.removeAttribute(i)
                            };break;
                        }
                    }
                    ;break;
                    }
                    
                    
                }
            })
        })
        
        content.dispatchEvent(updatedEvent)
        typeof state["computed"]=="function"?state["computed"]():""
    }




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
        details.onUnmount&&details.mounted==true?details.onUnmount():"";
        details.mounted=false;
        details.target=null;
        details.active=false;
    }}

    //State Updates
    update();
    document.addEventListener("updated",()=>update());
    content.addEventListener("updated",()=>update());
    content.firstElementChild.classList.add(details.key);
    content.loadComponents();

    var object={content,details,unmount,effect,signal,mount,update,localUpdate,states,state,$,_,$$,methods}
    return object;
}

const diff=(first,second,confirmed)=>{
    const classDiff=(st,nd)=>{
    let first=[...st.classList]
    let second=[...nd.classList]
    let classDiffNumber=Math.abs(first.length-second.length);
    if(classDiffNumber==0){
        let difference = first.filter(x =>{return !second.includes(x)});
        let same=first.filter(x =>{return second.includes(x)});
        second.forEach((cls,inde)=>{
            if(difference.length){
                if(same.length==0){
                second.forEach((stClass)=>{
                    st.className="";
                    st.classList.add(stClass)
                })
                }else if(same.length){
                    second.forEach((cs,ind)=>{
                        if(!same.includes(cs)){
                        first.forEach((cf,ii)=>{
                            
                                st.classList.add(cs);
                                if(difference.length){
                                    difference.forEach((diffed)=>{
                                    st.classList.remove(diffed)
                                    })
                                }
                            
                        })
                    }
                    })
                }
        }})
    }else{
        //add or remove
        let bigger=first.length>second.length?"first":"second"
        //first-remove
        //second-add
        if(bigger=="first"){
            let difference = first.filter(x => !second.includes(x));
            let same=first.filter(x => second.includes(x));

            difference.forEach((differenced,i)=>{
                st.classList.remove(differenced)
            })
        }else if(bigger=="second"){
            let difference = second.filter(x => !first.includes(x));
            let same=second.filter(x => first.includes(x));
            difference.forEach((differenced,i)=>{
                st.classList.add(differenced)
            })
        }
    }

}
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
    let key=("__"+Anchor.rkg()+"__");
    const details={
        onUnmount:null,
        onMount:null,
    }
    if(typeof str=="string"){
        string=str
    }else{
        str.forEach((e)=>string+=e)
    }

    string=Anchor.replacer(string,key);
    string=Anchor.namer(string);
    template.innerHTML=string;
    let content=template.content;
    const [$,$$,_]=[{},{},{}]
    $$$_($,$$,_,content)

    styleScoper(content)

    const mount=()=>{
        typeof details.onMount=="function"?details.onMount():"";
    }

    const unmount={
        callback:null,
        callback:()=>{
        typeof details.onUnmount=="function"?details.onUnmount():"";
        document.querySelectorAll("."+key).forEach((e)=>e.remove());
        if(content){
            content.remove()
        }
    }
    }

    content.firstElementChild.classList.add(key);
    return {content,$,_,$$,type,details,mount,unmount};
}




export const nodeList=function(list){
    const ARRAY=[]
    Object.keys(list).forEach((key)=>{
        if(typeof list[key]=="function"){
            let result=list[key]()
            ARRAY.push({node:document.createTextNode(result),callback:list[key],key})
        }else{
            console.warn("Anchors TypeError :\nNodeList elements must be a function.")
        }
    })

    const update=()=>{
        ARRAY.forEach((e)=>{
            let result=e.callback()
            if(e.node.textContent!=result){
                e.node.nodeValue=result;
            }
        })
    }

    let prox=new Proxy(list,{
        get(a,keys){
            if(keys!=="update"){
                let selected;
                ARRAY.forEach((e)=>{
                if(e.key==keys){
                    selected=e.node
                }
                })
                return selected
            }else{
                update();
            }
        },

    })
    document.addEventListener("updated",update)
    return prox
}




export const For=function(a,t){
    let array=a;
    let template=t;
    let fragment=document.createElement("div");
    let type="For";
    const update=(method)=>{
        let str=array.map(template).join("");
        if(fragment.innerHTML!=str){
            let tmp=document.createElement("template")
            str=Anchor.replacer(str);
            tmp.innerHTML=str
            let temp=tmp.content;
            temp.loadComponents();

            diff(fragment,temp);
            if(method){
                MethodUpdate(fragment,method)
            }
        }
    }
    //update();
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
        page.content.loadComponents();
        document.querySelectorAll("."+page.details.key).forEach((e)=>e.loadComponents())
    }else if (typeof page=="function"){
        this.textContent="";
        let pages=page(args);
        pages.content.selectElement("[anchor]").forEach((i)=>{i.removeAttribute("anchor")});
        this.append(pages.content)
        pages.content.loadComponents();
        //
        if(pages.details&&pages.type!=="HTML"){
            pages.details.target=this;
            core.registeredRenders.push({target:this,pages})
            pages.mount();
        }else if(data.type==="HTML"){
            pages.mount();
        }
        //
        document.querySelectorAll("."+pages.details.key).forEach((e)=>e.loadComponents())
        document.dispatchEvent(updatedEvent)
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
    data.content.loadComponents();
    item.append(data.content)
    if(data.details&&data.type!=="HTML"){
        data.details.target=this;
        core.registeredRenders.push({target:this,data})
        data.mount();
    }else if(data.type==="HTML"){
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
    let target=this.content??this

        target.querySelectorAll(qs).forEach((e)=>{
            //Props
            let attrNames=e.getAttributeNames();
            let props;
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
            let selected=component(props??undefined,(childrens.length>0?slotfragment:undefined))
            e.replaceWith(selected.content);
            if(this.type==="html"&&selected.mount&&typeof this.details.childComponents){
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
})}

//prevents unnecessary renders
export const debounce = (func, delayGetter) => {
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

const Returner=(data,str)=>{
    let array=str.split(".")
    let object=data;
    for(let nest of array){
        object=object[nest]
    }   
    return object
}

const STATES=(element,ARRAY,list,prox)=>{
    element.querySelectorAll("[state]").forEach((e)=>{
    let getted_attr=e.getAttribute("state");
    switch(typeof Returner(list,getted_attr)){
        case "number":case "string":            
        let node=document.createTextNode(Returner(list,getted_attr))
        e.replaceWith(node);
        const updater=()=>{
            node.nodeValue=Returner(list,getted_attr);
        }
        ARRAY.push({value:getted_attr,callback:updater})
        break;
    }})

    element.querySelectorAll(`*`).forEach((e)=>{
    let attrnames=e.getAttributeNames()
    attrnames.forEach((i)=>{
        if(i[0]=="$"&&typeof list[e.getAttribute(i)]!=="undefined"){
            let attr=i.slice(1);
            let getted_attr=e.getAttribute(i);
            switch(attr){
            case "onclick":case "oninput": case "onchange": case "onmouseover":
                    e[attr]=()=>{Returner(list,getted_attr)();
                    typeof list.computed==="function"?list.computed():""
                }
            ;break;
            
            case "model":
                //setter
                if(e.type=="text"||e.type=="textarea"){
                    e["oninput"]=()=>{
                        prox[getted_attr]=e.value;
                    }
                }else if(e.type=="checkbox"){
                    e["oninput"]=()=>{
                        prox[getted_attr]=e.checked;
                    }
                }
                //getter
                const updateModel=function(){
                    if(e.type=="text"||e.type=="textarea"||e.type=="checkbox"){
                        e.value=list[getted_attr];
                    }else{
                        e.textContent=list[getted_attr];
                    }
                }
                updateModel();
                
                ARRAY.push({value:getted_attr,callback:updateModel})

            break;
            
            case "class":
                let result=Returner(list,getted_attr);
                if(result){
                    e.classList.add(result)
                }
                let before=result;
                const updateClass=function(){
                    if(Returner(list,getted_attr)&&e.classList.contains(before)){
                        if(before!=Returner(list,getted_attr)){
                            e.classList.remove(before)
                            e.classList.add(Returner(list,getted_attr))
                            before=Returner(list,getted_attr)
                        }
                    }
                    else if(!Returner(list,getted_attr)&&e.classList.contains(before)){
                        e.classList.remove(before)
                    }else  if(Returner(list,getted_attr)&&!e.classList[Returner(list,getted_attr)]){
                        e.classList.add(Returner(list,getted_attr))
                        before=Returner(list,getted_attr)
                    }
                }
                updateClass();
                
                ARRAY.push({value:getted_attr,callback:updateClass})
            
            case "hide": case "show":{
                const control=()=>{
                    let result=Returner(list,getted_attr);
                    if((attr=="hide"&&result)||attr=="show"&&!result){
                        e.style.display="none"
                    }else{
                        e.style.display=""
                    }
                }
                control();
                
                ARRAY.push({value:getted_attr,callback:control})
            }
            ;break;
            case "visible": case "invisible":{
                const control=()=>{
                    let result=Returner(list,getted_attr);
                    if((attr=="invisible"&&result)||attr=="visible"&&!result){
                        e.style.visibility="hidden"
                    }else{
                        e.style.visibility="visible"
                    }
                }
                control();
                
                ARRAY.push({value:getted_attr,callback:control})
            }
            ;break;
            case "destroy":{
                const control=function(){
                    let result=Returner(list,getted_attr);
                    if(result){
                        e.remove();
                    }
                }
                control();
                
                ARRAY.push({value:getted_attr,callback:control})
            };break;
            default:{
                switch(typeof list[getted_attr]){
                    case "number":case "string":{
                        const control=()=>{
                            e[attr]=list[getted_attr]
                        }
                        
                        ARRAY.push({value:getted_attr,callback:control})
                    };break;
                }
            }
            ;break;
            }
            
            e.removeAttribute(i)
        }
    })
})}

export const createStore=(list)=>{
    const ARRAY=[];
    var prox = new Proxy(list,{
        get: (target, key) => {
            if(typeof target.computed=="function"){
                if(ARRAY.length)target.computed()
            }
        return target[key];
    },
    set: (target, key, value) => {
        const result=Reflect.get(target,key)
        if(result!==value){
            Reflect.set(target,key,value)
            ARRAY.forEach((e)=>{
                if(e.value===key){
                    e.callback();
                }
            })
            if(typeof target.computed=="function"){
                if(ARRAY.length)target.computed()
            }
        }
        return true;
        }
    })

    prox.register=(e)=>{
        STATES(e,ARRAY,list,prox)
    }
    try{
        return prox
    }finally{
        setTimeout(()=>{
            if(typeof list.computed==="function"){
                list.computed();
            }},10);
    }

}

Object.prototype.RegisterStore=function(storeName){
    if(this.content){
        storeName.register(this.content)
    }else if(this){
        storeName.register(this)
    }
}


