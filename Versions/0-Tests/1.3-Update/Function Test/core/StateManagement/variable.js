export const value=(arg)=>{
    const object={
        oldValue:arg||"",
        nodeList:[],
        onCallback:null,
        onTrigger:null,
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
            if(this.onTrigger&&typeof this.onTrigger=="function"){this.onTrigger()}
            if(newValue!=this.oldValue){
                this.oldValue=newValue;
                this.updateAllNodes();
                this.parentList.forEach((e)=>e.effect())
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