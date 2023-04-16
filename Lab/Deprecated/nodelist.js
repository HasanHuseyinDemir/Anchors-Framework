
//EXPORT
//nodelist.update=["x","y"] x and y updated
//nodelist.update="x" x updated
const nodeList=function(list){
    const ARRAY=[]
    Object.keys(list).forEach((key)=>{
        if(typeof list[key]=="function"){
            let result=list[key]()
            ARRAY.push({node:document.createTextNode(result),callback:list[key],key})
        }else if(typeof list[key]=="object"){

        }else{
            console.warn("Anchors TypeError :\nNodeList elements must be a function.")
        }
    })

    const update=(arg)=>{
        if(typeof arg=="string"&&ARRAY[arg]){
            let x=ARRAY.filter((e)=>e.key==arg)[0]
            let result=x.callback()
            if(x.node.textContent!=result){
                x.node.nodeValue=result;
            }
        }
        else{
            ARRAY.forEach((e)=>{
            let result=e.callback()
            if(e.node.textContent!=result){
                e.node.nodeValue=result;
            }
        })
        }
    }

    let prox=new Proxy(list,{
        get(a,keys){
            if(keys!=="update"){
                let selected;
                ARRAY.forEach((e)=>{
                if(e.key==keys){
                    selected=e.node
                }
                })
                return selected
            }else{
                update();
            }
        },
        set(a,keys,set){
            if(keys=="update"){
                if(typeof set=="string"){
                    update(set)
                }else if(Array.isArray(set)){
                    set.forEach((e)=>{
                        update(e)
                    })
                }
                return true
            }
        }

    })
    document.addEventListener(updateSeed,update)
    return prox
}