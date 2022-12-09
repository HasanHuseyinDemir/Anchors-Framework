export function html(data,...keys){
    let elements=[];
    let randomComment=`<span class="htmlizeReplaceElement"></span>`;
    //let randomComment=`<!--htmlize-->`
    data.forEach((item,index)=>{
        elements.push(item);
        if([...keys][index]!=undefined)
        {elements.push([...keys][index])}})
    let page=document.createElement("template");
    let str="";
    elements.forEach((item)=>{
        typeof item=="string"?str+=item:str+=randomComment;
    })
    str=str.replaceAll("{","<span anchor='").replaceAll("}","'></span>")
    page.innerHTML=str;

    let content=page.content;

    [...keys].forEach((key)=>{
    if(typeof key=="object"||typeof key=="number"){
        content.querySelector(".htmlizeReplaceElement").replaceWith(key);
    }
    })


    return content;
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
            if(this[0].nodeType==3){
                this[0].textContent!=textValue?this[0].nodeValue=textValue:"";
            }else{
                this[0].textContent!=textValue?this[0].textContent=textValue:""
            }
        }
    },
    get:function(){
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
    data.forEach((item,index)=>{
        let node=document.createTextNode("");
        item.replaceWith(node);
        nodes.push(node);
    })

    return nodes;
}

Object.prototype.render=function(page){
    this.textContent="";
    //Sanitize
    page.querySelectorAll("[anchor]").forEach((item)=>{item.removeAttribute("anchor")})
    this.append(page);
}

NodeList.prototype.render=function(page,args){
this.forEach((item)=>{
    item.querySelectorAll("[anchor]").forEach((i)=>{i.removeAttribute("anchor")});
    if(typeof page=="object"){
        item.textContent="";
        item.append(page.cloneNode(true))
    }else if (typeof page=="function"){
        item.textContent="";
        item.append(page(args))
    }
})}

