
//EXPORT
const HTML=(str)=>{
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
    let content=pg(string);
    styleScoper(content)

    const states=(list)=>{
        const state=createStore(list)
        content.registerStore(state)
        return state
    };

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
    const querySelector=(arg)=>{
        return content.querySelector(arg)
    }
    const querySelectorAll=(arg)=>{
        return content.querySelectorAll(arg)
    }
    const getElementById=()=>{
        return content.getElementById(arg)
    }
    const hideKey=()=>{
        FEC.classList.remove(details.key);
        FEC.classList.length==0?FEC.removeAttribute("class"):""
    }
    content.firstElementChild.classList.add(key);
    return {content,type,details,mount,unmount,states,querySelector,querySelectorAll,getElementById,hideKey};
}
