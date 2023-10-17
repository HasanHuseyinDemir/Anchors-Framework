(()=>{
    const Anchor={
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
        }
    }

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
    
    const searchKEY = (obj, key, path = '') => {
        let result = null;
        for (let prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            if (prop === '__KEY__' && obj[prop] === key) {
              return path;
            } else if (typeof obj[prop] === 'object' && obj[prop] !== null) {
              const subPath = path.length === 0 ? prop : `${path}.${prop}`;
              const subResult = searchKEY(obj[prop], key, subPath);
              if (subResult !== null) {
                result = subResult;
                break;
              }
            }
          }
        }
        return result;
      };
    
    
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
        
        const handler=()=>{
            return {
                get(target, key) {
                    if (typeof target[key]=="object"||Array.isArray(target[key])) {
                        if(typeof target=="object"){
                            if(typeof target[key].__KEY__=="undefined"){
                                target[key].__KEY__=Anchor.rkg()
                            }
                        }
                        return new Proxy(target[key], handler())
                    }
                    return target[key]
                },
                set(target, key, value) {
                    const result=Reflect.get(target,key)
                    let valid=""
                    
                    if(result!==value){
                        target[key]=value
    
                        if(target.__KEY__){
                            valid=searchKEY(prox,target.__KEY__)+"."+key
                        }else{
                            valid=key
                        }
                        let filtered=ARRAY.filter((e)=>e.value===valid||e.value==="*")
                        filtered.forEach((e)=>e.callback(prox))
                    }
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
                codes=0;
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
    window.createStore=createStore
})()


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