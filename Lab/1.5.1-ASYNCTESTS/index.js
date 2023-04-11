let promiseTest=()=>{
    return fetch("./test.json")
    .then(e=>e.json())
    .then((e)=>e.test.map((j)=>/*html*/`<h1>${j.title} <span>${new Date().getSeconds()}</span></h1>`))
};

let asyncs=`    ${promiseTest}

${async()=>{
    let file=await(await fetch("./test.json")).json();
    return file.test.map((e)=>{return`
    <div>
    <h1>${e.title}</h1>
    <p $onclick="hello">${e.desc} <span>${new Date().getSeconds()}</span></p>
    <button $onclick="hello">Tıkla</button>
    </div>`})}
}

${fetch("./test.json")
.then(e=>e.json())
.then((e)=>e.test.map((j)=>/*html*/`<i>${j.title}</i>`))}`



let x;
let Main=()=>{
let page= html`
<>
    <h1>Tests</h1>
    <div>
    <button $onclick="hello">O</button>
    <button $onclick="hello">X</button>
    <button $onclick="hellos">O</button>
    <button $onclick="hellos">X</button>
    <button $onclick="hellos">O</button>
    </div>
    </>
`
let states=page.methods({
    hello(){
        console.log("Hello")
    },
    hellos(){
        console.log("hermanos")
    }
})

page.querySelector("button").onclick=()=>page.update();
return page
}
document.querySelectorAll("#app").render(Main)

/*await fetc.test.map((e)=>{
        return`
        <div>
        <h1>${e.title}</h1>
        <p>${e.desc}</p>
        </div>
        `
    }} */

    /*

    
        ${async()=>{
        let file=await(await fetch("./test.json")).json();
        return file.test.map((e)=>{return/`
        <div>
        <h1>${e.title}</h1>
        <p>${e.desc} <span>${new Date().getSeconds()}</span></p>
        </div>`})
        }}
    
    */