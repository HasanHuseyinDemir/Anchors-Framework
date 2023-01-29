const state=(data)=>{
    let before="";
    return function(arg){
        if(arg&&before!==arg){
            data.value=arg
            before=arg//for console
            return before
        }else{
            return data.value
        }
    }
}

class Watcher{
    constructor(){
        this.subs=[]
    }
    subscribe(arg){
        this.subs.push(arg)
    }
    effect(){
        this.subs.forEach((e)=>e())
    }
}

const reactive=function(arg){
    if(!this.rendered){
    this.watchers=new Watcher();
    }
    const wGetter=function(){
        return this.watchers
    }

    if(typeof arg=="number"||typeof arg=="string"){
    const obj={
        beforeValue:arg,
        deps:[],
        watchlist:[],
        add(arg){
            this.deps.push(arg);
            wGetter().effect();
            this.update();
            this.watchlist.forEach((e)=>e())
        },
        update(){
            this.deps.forEach((e)=>{
                if(e){
                    switch(typeof e){
                        case "object":
                            //Eğer bu bir dom elemanı ise
                            if(e.nodeType){
                                switch(e.nodeType){
                                case 3:e.nodeValue=this.beforeValue;break;
                                case 1:e.textContent=this.beforeValue;break;
                                }
                            }
                            switch(e.type){
                                case "dynamic":e.update();break;
                            }
                        ;break;
                    }
                }
            })
        },
        get value(){
            return this.beforeValue
        },
        set value(arg){
            if(this.beforeValue!==arg){
                this.beforeValue=arg;
                wGetter().effect();
                this.update();
                this.watchlist.forEach((e)=>e())
            }
    }
    }
    return obj
    }else if(typeof arg=="object"){
        //core
        const object={};
        
        //child
        Object.keys(arg).forEach((e)=>{
            if(typeof arg[e]=="string"||typeof arg[e]=="number"){
            let nestedObject={
            beforeValue:arg[e],
            deps:[],
            watchlist:[],
            update(){
                this.deps.forEach((e)=>{
                    if(e){
                            switch(typeof e){
                                case "object":
                                    if(e.nodeType){
                                        switch(e.nodeType){
                                        case 3:e.nodeValue=this.beforeValue;break;
                                        case 1:e.textContent=this.beforeValue;break;
                                        }
                                    }else{
                                        switch(e.type){
                                            case "dynamic":e.update();break;
                                        }
                                    }
                                ;break;
                            }
                        }
                    })
                },
                add(arg){
                    this.deps.push(arg); 
                    wGetter().effect();
                    this.update();
                    this.watchlist.forEach((e)=>e())
                },
                get value(){
                    return this.beforeValue
                },
                set value(arg){
                    if(this.beforeValue!==arg){
                        this.beforeValue=arg;
                        wGetter().effect();
                        this.update();
                        this.watchlist.forEach((e)=>e())
                    }
                }
            }
            object[`${e}`]=nestedObject;
            }else{
                //prevents replacing watchers
                this.rendered=true;
                object[`${e}`]=reactive(arg[e]) 
            }
        })
        
        return object
    }else if(typeof arg=="function"){
        //watchers
        if(arg.name.slice(0,8)=="watcher_"){
            wGetter().subscribe(arg);
        }
        
        return arg
    }
}

const watchers=function(arg){
    Object.keys(arg).forEach((e)=>{
        let callback=arg[e].callback
        arg[e].dependencies.forEach((e)=>{
            e.watchlist.push(callback)
        })
    })
}

class dynamicAttribute{
    constructor(attr,element,getter){
        this.attribute=attr;
        this.element=element;
        this.getter=getter;
        this.before="";
    }
    type="dynamic"
    update(){
        let before=this.before
        let newValue=this.element.getAttribute(this.attribute)
        //if(before!==newValue){
            this.element.setAttribute(this.attribute,this.getter.value)
            this.before=newValue;
        //}
    }
}

class dynamicModel{
    constructor(element,getter) {
        this.element=element
        this.getter=getter
        this.nodeName=element.nodeName
        //setter
        switch(this.nodeName){
            case "INPUT":this.element.oninput=(arg)=>{this.getter.value=arg.target.value};break;
        }
    }
    type="dynamic"
    update(){
            switch(this.nodeName){
                case "INPUT":this.element.value=this.getter.value;break;
            }
    }

}