//document.addEventListener("helloworld",()=>console.log("Hello World!"));
//document.addEventListener("changebtn",()=>btn.textContent="Hellooooo")

let hello=new Event("helloworld");
let btnchanger=new Event("changebtn")

document.dispatchEvent(hello)


btn.addEventListener("changebtn",(e)=>e.target.textContent="Hellooooo")
btn.dispatchEvent(btnchanger)