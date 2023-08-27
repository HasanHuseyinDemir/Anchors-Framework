(()=>{
    function html(data,...keys){
        let elements=[];
        let keyList=[...keys];
        data.forEach((item,index)=>{
            elements.push(item);
            keyList[index]!=undefined?elements.push(keyList[index]):""
        })
        let str="";
        elements.forEach((item)=>{typeof item=="string"?str+=item:str+=`<xx></xx>`});
        str=str.replaceAll("<>","<div>").replaceAll("</>","</div>");
        /*optimizasyon*/str.includes("/>")?str=namer(str):0
        let el=document.createRange().createContextualFragment(str);
        [...keys].forEach((key)=>{
            let t=el.querySelector("xx");
            (typeof key=="object"||typeof key=="number")?t.replaceWith(key):typeof key=="function"?t.replaceWith(key()):0
            return
        })
        return el
    }
    
    
    function namer(item){
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
                deval=deval.split("").reverse().join("");
                let name=deval.split(" ")[0];
                let props=deval.replace(name,"");
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
        return data
        }
        window.html=html
})()


Object.prototype.render=function(s){
    this.textContent="";
    this.append(typeof s=="object"?s:typeof s=="function"?s():"")
}

Object.prototype.component=function(el,obj){
    let object = typeof el=="string"?obj:el
    let name=typeof el!="string"?(typeof el=="function"?el.name:Object.keys(el)[0]):el
    if(typeof object=="object"&&typeof el=="string"){
        this.querySelectorAll(el).forEach((e)=>{
            e.render(obj)
        })
    }else if(typeof object=="function"){
        this.querySelectorAll(name).forEach((e)=>{
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
            e.replaceWith(selected);
        })
    }
}