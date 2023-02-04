const states=(list)=>{
    const ARRAY=[];
    content.querySelectorAll("[state]").forEach((e)=>{
        let getted_attr=e.getAttribute("state");
        switch(typeof list[getted_attr]){
            case "number":case "string":            
            let node=document.createTextNode(list[getted_attr])
            e.replaceWith(node);

            const updater=()=>{
                node.nodeValue=list[getted_attr];
            }
            ARRAY.push({value:getted_attr,callback:updater})

            break;
    }})

    content.querySelectorAll(`*`).forEach((e)=>{
        let attrnames=e.getAttributeNames()
        attrnames.forEach((i)=>{
            if(i[0]=="$"){
                let attr=i.slice(1);
                let getted_attr=e.getAttribute(i);
                switch(attr){
                case "onclick":case "oninput": case "onchange": case "onmouseover":
                        e[attr]=()=>{list[applied[0]??getted_attr](apply??e);
                        list.computed?list.computed():""
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
                    let result=list[getted_attr];
                    if(result){
                        e.classList.add(result)
                    }
                    let before=result;
                    const updateClass=function(){
                        if(list[getted_attr]&&e.classList.contains(before)){
                            if(before!=list[getted_attr]){
                                e.classList.remove(before)
                                e.classList.add(list[getted_attr])
                                before=list[getted_attr]
                            }
                        }
                        else if(!list[getted_attr]&&e.classList.contains(before)){
                            e.classList.remove(before)
                        }else  if(list[getted_attr]&&!e.classList[list[getted_attr]]){
                            e.classList.add(list[getted_attr])
                            before=list[getted_attr]
                        }
                    }
                    updateClass();
                    ARRAY.push({value:getted_attr,callback:updateClass})
                
                case "hide": case "show":{
                    const control=()=>{
                        let result=list[getted_attr];
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
                        let result=list[getted_attr];
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
                        let result=list[getted_attr];
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
    })
    content.dispatchEvent(updatedEvent)

    var prox = new Proxy(list,{
        get(target,key){
            const result=Reflect.get(target,key)
            return result
        },
        set(target,key,value){
            const result=Reflect.get(target,key)
            if(result!==value){
                Reflect.set(target,key,value)
                ARRAY.forEach((e)=>{
                    if(e.value===key){
                        e.callback();
                    }
                })
                if(typeof list.computed==="function"){
                    list.computed()
                }
            }
            return true
        },
    })

    
    try{
        return prox
    }finally{
        setTimeout(()=>{
            if(typeof list.computed==="function"){
                list.computed();
            }},1);
    }

}