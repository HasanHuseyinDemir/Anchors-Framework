const rState=(data)=>{
    return (arg)=>{
        if(arg){
            data.value=arg
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
    return{
        beforeValue:arg,
        deps:[],
        add(arg){
            this.deps.push(arg);
            wGetter().effect();
            this.update();
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
                                case "dynamicAttribute":e.update();break;
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
            }
    }
    }
    }else if(typeof arg=="object"){
        //core
        let object={};
        
        //child
        Object.keys(arg).forEach((e)=>{
            if(typeof arg[e]=="string"||typeof arg[e]=="number"){
            let nestedObject={
            beforeValue:arg[e],
            deps:[],
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
                                    }
                                    switch(e.type){
                                        case "dynamicAttribute":e.update();break;
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
                },
                get value(){
                    return this.beforeValue
                },
                set value(arg){
                    if(this.beforeValue!=arg){
                        this.beforeValue=arg;
                        wGetter().effect();
                        this.update();
                    }
                }
            }
            object[`${e}`]=nestedObject;
            }else{// if(typeof arg[e]=="object")
                //prevents replacing watchers
                this.rendered=true;
                object[`${e}`]=reactive(arg[e]) 
            }
        })
        
        return object
    }else if(typeof arg=="function"){
        wGetter().subscribe(arg);
        return arg
    }
}

class dynamicAttribute{
    constructor(attr,element,getter){
        this.attribute=attr;
        this.element=element;
        this.getter=getter;
        this.before="";
    }
    type="dynamicAttribute"
    update(){
        let before=this.before
        let newValue=this.element.getAttribute(this.attribute)
        if(before!=newValue){
            this.element.setAttribute(this.attribute,this.getter.value)
            this.before=newValue;
        }
    }
}