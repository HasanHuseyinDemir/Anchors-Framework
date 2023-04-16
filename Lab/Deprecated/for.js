
//EXPORT
const For=function(a,t){
    const getNew=()=>{
        return array.map((e)=>{
            let obj=t(e)
            obj.hideKey();
            return obj
        })
    }
    let array=a;
    let nodes=getNew()
    let fragment=document.createElement("div");
    nodes.forEach((e)=>{
        fragment.append(e.content)}
    )
    let type="For";
    const update=()=>{
        let temp=document.createElement("div");
        getNew().forEach((e)=>temp.append(e.content));
        diff(fragment,temp)
    }
    return {type,fragment,update}
}