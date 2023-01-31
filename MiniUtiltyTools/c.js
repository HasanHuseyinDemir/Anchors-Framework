
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