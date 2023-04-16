
//EXPORT
const GlobalUpdate=()=>{
    document.dispatchEvent(updatedEvent);
}

//EXPORT
const OnGlobalUpdate=(func)=>{
    document.addEventListener(updateSeed,func)
}