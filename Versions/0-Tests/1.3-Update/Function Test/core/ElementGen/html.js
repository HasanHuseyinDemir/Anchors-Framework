export function html(data,...keys){
    const details={
        nodeLists:[],
        onEffect:null,
        onUnmount:null,
        active:true,
        memo:false,
        childComponents:[],
        key:Math.random()
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
    str=str.replaceAll("[-","<span delete='").replaceAll("-]","'></span>")
    str=str.replaceAll("[[","mark='").replaceAll("]]","'")
    str=str.replaceAll("{{","<span value='").replaceAll("}}","'></span>")
    str=str.replaceAll("{","<span anchor='").replaceAll("}","'></span>")
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
            signal?details.onEffect():""
            if(details.childComponents.length>0&&arg!="local"){
                    details.childComponents.forEach((e)=>{    
                        if(e.details.memo==false){
                            e.effect()
                        }
                    })
                }
        }
    }
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
                }else if(key.type=="For"){
                    content.querySelector(".achrplcelem").replaceWith(key.fragment); 
                }
                else{
                    content.querySelector(".achrplcelem").replaceWith(key); 
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
            }else{
                content.querySelector(".achrplcelem").replaceWith(selected);
            }
        }else if(typeof selected=="number"||typeof selected=="string"){
            let node=document.createTextNode(selected)
            content.querySelector(".achrplcelem").replaceWith(node);
            details.nodeLists.push({node,func,before:selected})
        }
    }
    [elements,keyList]=[]
    })
    let unmount={
        callback:null,
        remove:()=>{
            unmountCallback=null;
        },
        callback:()=>{
        if(details.childComponents.length>0){
                details.childComponents.forEach((e)=>{    
                        e.unmount.callback()
                })
        }
        details.onUnmount?details.onUnmount():"";
        details.active=false;
    }}

    return {content,details,unmount,effect};
}

Object.prototype.onEffect=function(first){
    switch(typeof first){
        case "function":this.details.onEffect=first;break;
        case undefined:default:this.details.onEffect=null;break;
    }
}

Object.prototype.onUnmount=function(first){
    switch(typeof first){
        case "function":this.details.onUnmount=first;break;
        case undefined:default:this.details.onUnmount=null;break;
    }
}

Object.prototype.memo=function(arg){
    if(arg){
        this.details.memo=arg;
    }else{
        this.details.memo=true;
    }

}