const diff=(first,second,confirmed)=>{
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
    if(!first.isEqualNode(second)){
        let firstArray=Array.from(first.childNodes);
        let firstLength=firstArray.length;
        let secondArray=Array.from(second.childNodes);
        let secondLength=secondArray.length;
        let differencies=Math.abs(firstLength-secondLength)
        if(differencies){
            if(firstLength>secondLength){
                //remove
                while(differencies>0){
                    if(!first.isEqualNode(second)){
                            first.childNodes[Array.from(first.childNodes).length-1].remove()
                    }
                    differencies--
                }
                diff(first,second)
            }else if(secondLength>firstLength){
                //push
                while(differencies>0){
                    if(!first.isEqualNode(second)){
                    first.append(secondArray[secondArray.length - 1].cloneNode(true))
                    secondArray.pop();
                    }
                    differencies--
                }
                diff(first,second)
            }
        }else{
            firstArray.forEach((e,index)=>{
                if(!e.isEqualNode(secondArray[index])){
                    if(e.nodeType==3&&secondArray[index].nodeType==3){
                        if(e.textContent!=secondArray[index].textContent){
                            e.nodeValue=secondArray[index].textContent;
                        }
                    }else{
                        if(e.nodeType!=secondArray[index].nodeType){
                            e.replaceWith(secondArray[index].cloneNode(true))
                        }else{
                            if(e.nodeName!=secondArray[index].nodeName){
                                e.replaceWith(secondArray[index].cloneNode(true))
                            }else{
                                if(e.nodeType==1&&secondArray[index].nodeType==1){
                                    let firstNames=e.getAttributeNames()
                                    let secondNames=secondArray[index].getAttributeNames();
                                    let diffAttrNumber=Math.abs(firstNames.length-secondNames.length)
                                        if(secondNames.length==firstNames.length){
                                            secondNames.forEach((attr,ind)=>{
                                            //class için olaylar farklı
                                            if(attr!="class"){
                                                if(e.getAttribute(attr)!=secondArray[index].getAttribute(attr)){
                                                    e.setAttribute(attr,secondArray[index].getAttribute(attr))
                                                }
                                            }else{
                                                classDiff(e,secondArray[index])
                                            }
                                        })
                                    }else{
                                        //attribute ekle çıkar işlemleri
                                            if (firstNames.length > secondNames.length) {
                                                //removeattribute
                                                        let differentAttrs=firstNames.filter((attribute)=>{
                                                            return !secondNames.includes(attribute)
                                                        })
                                                        if(differentAttrs.length){
                                                            differentAttrs.forEach((diffed)=>{
                                                            e.removeAttribute(diffed)
                                                            })
                                                        }
                                                        let sameAttrs=firstNames.filter((attribute)=>{
                                                            return secondNames.includes(attribute)
                                                        })
                                                        if(sameAttrs.length){
                                                            sameAttrs.forEach((k,jndex)=>{
                                                            if(e.getAttribute(k)!=secondArray[index].getAttribute(k)){
                                                                if(k!="class"){
                                                                    e.setAttribute(k,secondArray[index].getAttribute(k))
                                                                }else{
                                                                    classDiff(e,secondArray[index])
                                                                }

                                                            }
                                                        })
                                                        }
                                                diff(e, secondArray[index])
                                            } else if (secondNames.length > firstNames.length) {
                                                //addAttr
                                                    if (!e.isEqualNode(secondArray[index])) {
                                                        let differentAttrs=secondNames.filter((attribute)=>{
                                                            return !firstNames.includes(attribute)
                                                        })
                                                        if(differentAttrs.length){
                                                            differentAttrs.forEach((diffed)=>{
                                                            e.setAttribute(diffed,secondArray[index].getAttribute(diffed))
                                                            })
                                                        }
                                                        let sameAttrs=secondNames.filter((attribute)=>{
                                                            return firstNames.includes(attribute)
                                                        })
                                                        if(sameAttrs){
                                                            sameAttrs.forEach((k,jndex)=>{
                                                            if(e.getAttribute(k)!=secondArray[index].getAttribute(k)){
                                                                if(k!="class"){
                                                                    e.setAttribute(k,secondArray[index].getAttribute(k))
                                                                }else{
                                                                    classDiff(e,secondArray[index])
                                                                }   
                                                            }
                                                        })
                                                        }
                                                    }
                                                diff(e, secondArray[index])
                                            }
                                    }
                                }
                                if(!e.isEqualNode(secondArray[index])){
                                    diff(e,secondArray[index],true)//confirm
                                }
                                if(confirmed){
                                    return 
                                }
                            }
                        }

                    }
                }
            })
        }
    }
}