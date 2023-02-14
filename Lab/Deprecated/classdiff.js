const classDiff=(st,nd)=>{
    let first=[...st.classList]
    let second=[...nd.classList]
    let classDiffNumber=Math.abs(first.length-second.length);
    if(classDiffNumber==0){
        let difference = first.filter(x =>{return !second.includes(x)});
        let same=first.filter(x =>{return second.includes(x)});
        second.forEach((cls,inde)=>{
            if(difference.length){
                if(same.length==0){
                second.forEach((stClass)=>{
                    st.className="";
                    st.classList.add(stClass)
                })
                }else if(same.length){
                    second.forEach((cs,ind)=>{
                        if(!same.includes(cs)){
                        first.forEach((cf,ii)=>{
                            
                                st.classList.add(cs);
                                if(difference.length){
                                    difference.forEach((diffed)=>{
                                    st.classList.remove(diffed)
                                    })
                                }
                            
                        })
                    }
                    })
                }
        }})
    }else{
        //add or remove
        let bigger=first.length>second.length?"first":"second"
        //first-remove
        //second-add
        if(bigger=="first"){
            let difference = first.filter(x => !second.includes(x));
            let same=first.filter(x => second.includes(x));

            difference.forEach((differenced,i)=>{
                st.classList.remove(differenced)
            })
        }else if(bigger=="second"){
            let difference = second.filter(x => !first.includes(x));
            let same=second.filter(x => first.includes(x));
            difference.forEach((differenced,i)=>{
                st.classList.add(differenced)
            })
        }
    }

}