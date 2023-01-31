export const value=(arg)=>{
    const object={
        oldValue:arg==undefined?"":typeof arg=="number"?arg:""||arg,
        nodeList:[],
        onCallback:null,
        parentList:[],
        type:"variable",
        updateAllNodes:function(){
            this.nodeList.forEach((e)=>{
                e.nodeValue=this.oldValue
            })
        },
        get value(){
            return this.oldValue
        },
        set value(newValue){
            if(newValue!=this.oldValue){
                this.oldValue=newValue;
                this.updateAllNodes();
                this.parentList.forEach((e)=>e.update())
                if(this.onCallback&&typeof this.onCallback=="function"){this.onCallback()}
            }
        },
        get node(){
            let node=document.createTextNode(this.oldValue);
            this.nodeList.push(node);
            return node
        }
    }
    return object
}