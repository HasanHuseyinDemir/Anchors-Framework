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

Object.prototype.getValue=function(val){
    return this.selectElement(`[value='${val}']`)
}

Object.defineProperty(Object.prototype,"text",{
    set:function(textValue){
    //if(this){
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
    //}else{
    //    console.error("Not Found")
    //}
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
    data.forEach((item,index)=>{
        let node=document.createTextNode("");
        item.replaceWith(node);
        nodes.push(node);
    })

    return nodes;
}

Object.prototype.render=function(page,args){
    if(typeof page=="object"){
        this.textContent="";
        page.selectElement("[anchor]").forEach((i)=>{i.removeAttribute("anchor")});
        this.append(page)
    }else if (typeof page=="function"){
        this.textContent="";
        let pages=page(args);
        pages.selectElement("[anchor]").forEach((i)=>{i.removeAttribute("anchor")});
        this.append(pages)
    }
}

NodeList.prototype.render=function(page,args){
this.forEach((item)=>{
    item.selectElement("[anchor]").forEach((i)=>{i.removeAttribute("anchor")});
    if(typeof page=="object"){
        item.textContent="";
        item.append(page.cloneNode(true))
    }else if (typeof page=="function"){
        item.textContent="";
        item.append(page(args))
    }
})}

Object.prototype.getMark=function(mark){
    return this.selectElement(`[mark='${mark}']`)
}

//on events for multiple elements
Object.defineProperties(Object.prototype,{
    "onClick":{
    set(Event){
        if(Array.isArray(this)||this.length>1){
            this.forEach((item)=>{item.onclick=Event})
           
        }else{
            this.onclick=Event
    }}
    }
    ,
    "onInput":{
        set(Event){
            if(Array.isArray(this)||this.length>1){
                this.forEach((item)=>{item.oninput=Event})
            }else{
                this.oninput=Event
        }}
    },
    "onChange":{
        set(Event){
            if(Array.isArray(this)||this.length>1){
                this.forEach((item)=>{item.onchange=Event})
            }else{
                this.onchange=Event
        }}
    }
    ,
    "onMouseOver":{
        set(Event){
            if(Array.isArray(this)||this.length>1){
                this.forEach((item)=>{item.onmouseover=Event})
            }else{
                this.onmouseover=Event
        }}
    },
    "onMouseOut":{
        set(Event){
            if(Array.isArray(this)||this.length>1){
                this.forEach((item)=>{item.onmouseout=Event})
            }else{
                this.onmouseout=Event
        }}
    }
    ,    
    "onKeyDown":{
        set(Event){
            if(Array.isArray(this)||this.length>1){
                this.forEach((item)=>{item.onkeydown=Event})
            }else{
                this.onkeydown=Event
        }}
    }
    ,    
    "onLoad":{
        set(Event){
            if(Array.isArray(this)||this.length>1){
                this.forEach((item)=>{item.onload=Event})
            }else{
                this.onload=Event
        }}
    }
})

Object.prototype.setAttributes=function(attribute,value){
 
        if(Array.isArray(this)||this.length>1){
            this.forEach((item)=>{item.setAttribute(attribute,value)})
        }else{
            this.setAttribute(attribute,value)
        }

}