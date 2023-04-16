//DEPRECATED!
//slightly buggy
/*export const For=function(a,t){
    const details={
        template:t,
        key:Math.random(),
        fragment:document.createElement("div"),
        unmountCallback:null,
        type:"For",
        parentEffect:null,
        mounted:false,
    }
    details.fragment.setAttribute("anc-key",details.key);

    const setParent=(e)=>{
        details.parentEffect=e
    }

    const setUnmount=(e)=>{
        typeof e==="function"?details.unmountCallback=e:console.warn("Anchor TypeError : For unmount callback must be a function")
    }
    //init
    
    let comp=a.map(details.template);
    comp.forEach((e)=>{
        details.fragment.append(e.content)
        e.details.target=details.fragment;
    })

    const update=()=>{
        if(typeof details.parentEffect==="function"){
            details.parentEffect();
            
        }
        comp.forEach((e)=>e.mount());
        comp.forEach((e)=>e.effect());
        comp.forEach((e)=>{e.signal()})
    };

    const mount=()=>{
        if(details.mounted==false){
            details.mounted=true;    
        }
        comp.forEach((e)=>e.mount());
        update();
        
    }

    const unmount=()=>{
        details.mounted=false;
        comp.forEach((e)=>e.unmount());
        let target=document.body.querySelectorAll("anc-key="+key)
        if(target.length>0){
            target.forEach((e)=>{e.remove()})
            if(details.unmountCallback&&typeof details.unmountCallback=="function"){
                details.unmountCallback();
            }
        }
    }

    const push=(object)=>{
        a.push(object);
        let el=details.template(a[a.length-1],a.length-1)
        el.details.target=details.fragment
        details.fragment.append(el.content);
        comp.push(el);
        comp.forEach((e)=>e.mount());
        update();
    };

    const remove=(object)=>{
            delete a[search(object,"index")];
            removeEmptyItems();
            update();
    }

    const length=()=>{
        return parseInt(a.length);
    }

    const search=($e,$a)=>{
        const object=$e;
        let is=$a=="index"?-1:false;
        const type=$a||"bool";
        a.forEach((e,index)=>{
            if(JSON.stringify(e)==JSON.stringify(object)){
                if(type=="bool"){
                    is=true
                }
                else if(type=="index"){
                    is=index
                }else{
                    console.warn("Anchors Search:TypeError Please use 'index' instead of "+$a)
                }
            }
        })
        return is
    }

    function removeEmptyItems(){
        a=a.filter(e => {
            if (
              typeof e === 'object' &&
              !Array.isArray(e) &&
              Object.keys(e).length === 0
            ) {
              return false;
            } else {
              return true;
            }
    })  }

    update()
    return {type:details.type,length,fragment:details.fragment,update,push,remove,array:a,mount,unmount,search,setParent,setUnmount,removeEmptyItems}
}
*/

