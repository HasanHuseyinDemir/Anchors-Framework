export const For=function(a,t){
    let array=a;
    let template=t;
    let fragment=document.createElement("div");
    let parentEffect="yok";
    let type="For";
    let mounted=false;

    const setParent=(e)=>{
        parentEffect=e
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
        /*let ind=null;
        array.forEach((e,index)=>{
            if(JSON.stringify(e)==JSON.stringify(object)){
                ind=index;
            }
        })
        typeof ind=="number"?delete array[ind]:"";*/
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
    return {type,length,fragment,update,push,remove,array,mount,search,setParent}
}