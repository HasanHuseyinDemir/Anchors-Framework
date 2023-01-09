export const For=function(a,t){
    let array=a;
    let template=t;
    let fragment=document.createElement("div");
    let type="For";

    //init
    let comp=array.map(template);
    comp.forEach((e)=>{
        fragment.append(e.content)
        e.details.target=fragment
    })

    const update=()=>{
        comp.forEach((e)=>{e.signal()})
    };

    const push=(object)=>{
        array.push(object);
        let el=template(array[array.length-1],array.length-1)
        el.details.target=fragment
        fragment.append(el.content);
        el.mount();
    };

    const remove=(object)=>{
        let ind=null;
        array.forEach((e,index)=>{
            if(JSON.stringify(e)==JSON.stringify(object)){
                ind=index;
            }
        })
        ind?(console.log(array[ind-1]),delete array[ind]):"";
        update();
    }

    update();
    return {type,fragment,update,push,remove,array}
}