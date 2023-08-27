function html(data,...keys){
    let elements=[];
    let keyList=[...keys];
    data.forEach((item,index)=>{
        elements.push(item);
        if(keyList[index]!=undefined)
        {elements.push(keyList[index])}})
    let str="";
    elements.forEach((item)=>{typeof item=="string"?str+=item:str+=`<xx></xx>`;});
    let el=document.createRange().createContextualFragment(str);
    [...keys].forEach((key)=>{
        let t=el.querySelector("xx");
        (typeof key=="object"||typeof key=="number")?t.replaceWith(key):typeof key=="function"?t.replaceWith(key()):0
    })
    return el
}

Object.prototype.render=function(s){
    this.textContent="";
    if(typeof s=="object"){
        this.append(s)
    }else if(typeof s=="function"){
        this.append(s())
    }
}