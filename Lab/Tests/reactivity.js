const reactive=function(arg){


if(typeof arg=="number"||typeof arg=="string"){
    return{
        v:arg,
        deps:[],
        add(arg){
            this.deps.push(arg);
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
                                case 3:e.nodeValue=this.v;break;
                                case 1:e.textContent=this.v;break;
                                }
                            }
                            switch(e.type){
                                case "dynamicClass":e.update();break;
                            }
                        ;break;
                    }
                }
            })
            console.log("set")
        },
        get value(){
            return this.v
        },
        set value(arg){
            if(this.v!==arg){
                this.v=arg
                
                this.update();
            }
    }
    }
}else if(typeof arg=="object"){
    let object={};
    Object.keys(arg).forEach((e)=>{
        let before="Hello";
        Object.defineProperty(object,e,{
            get(){
                return before
            },
            set(arg){
                before=arg
                console.log(before)
            }
        })
    })
    console.log(object.hello)
    return object
}}

class dynamicAttribute{
    constructor(attr,element,getter){
        this.attribute=attr;
        this.element=element;
        this.getter=getter
    }
    type="dynamicClass"
    update(){
        //diff eklenecek
        this.element.setAttribute(this.attribute,this.getter.value)
    }
}