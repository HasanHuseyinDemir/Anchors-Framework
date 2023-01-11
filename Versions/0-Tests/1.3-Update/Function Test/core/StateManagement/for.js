export const For=function(a,t){
    let array=a;
    let template=t;
    let key=Math.random();
    let fragment=document.createElement("div");
    fragment.setAttribute("anc-key",key);
    let parentEffect="yok";
    let unmountCallback=null;
    let type="For";
    let mounted=false;

    const setParent=(e)=>{
        parentEffect=e
    }

    const setUnmount=(e)=>{
        typeof e==="function"?unmountCallback=e:console.warn("Anchor TypeError : For unmount callback must be a function")
    }
    //init
    let comp=array.map(template);
    comp.forEach((e)=>{
        fragment.append(e.content)
        e.details.target=fragment;
    })

    const update=()=>{
        comp.forEach((e)=>{e.signal()})
        if(typeof parentEffect==="function"){
            parentEffect();
        }
    };

    const mount=()=>{
        mounted=true;
        comp.forEach((e)=>e.mount());
    }

    const unmount=()=>{
        mounted=false;
        comp.forEach((e)=>e.unmount());
        let target=document.body.querySelectorAll("anc-key="+key)
        if(target.length>0){
            target.forEach((e)=>{e.remove()})
            if(unmountCallback&&typeof unmountCallback=="function"){
                unmountCallback();
            }
        }
    }

    const push=(object)=>{
        array.push(object);
        let el=template(array[array.length-1],array.length-1)
        el.details.target=fragment
        fragment.append(el.content);
        comp.push(el);
        mount();
        update();
    };

    const remove=(object)=>{
        delete array[search(object,"index")];
        removeEmptyItems();
        update();
    }

    const length=()=>{
        return array.length;
    }

    const search=($e,a)=>{
        const object=$e;
        let is=a=="index"?-1:false;
        const type=a||"bool";
        array.forEach((e,index)=>{
            if(JSON.stringify(e)==JSON.stringify(object)){
                if(type=="bool"){
                    is=true
                }
                else if(type=="index"){
                    is=index
                }else{
                    console.warn("Anchors Search:TypeError Please use 'index' instead of "+a)
                }
            }
        })
        return is
    }

    function removeEmptyItems(){
        array=array.filter(element => {
            if (
              typeof element === 'object' &&
              !Array.isArray(element) &&
              Object.keys(element).length === 0
            ) {
              return false;
            } else {
              return true;
            }
          });
    }

    update();
    return {type,length,fragment,update,push,remove,array,mount,unmount,search,setParent,setUnmount}
}