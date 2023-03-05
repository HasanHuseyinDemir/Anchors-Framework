const Page=()=>{
    let show=true;
    let Main=html/*jsx*/`
    <>
        <h1>QR Code Generator</h1>
        <p>${()=>{
            if(show){
                return `Görünüyor`
            }else{
                return ``
            }
        }}</p>
        <Test/>
        <button [[aktif]] >Hello</button>
    </>`

    Main._["aktif"].onClick=()=>{
        show=!show;
        console.log("Merhaba")
        Main.effect();
    }

    document.title="QR Code Generator"
    return Main
}

let t=html`<p>${new Date().getSeconds()}</p>`

const Test=()=>{
    let Page=html`[{test}]`
    setInterval(()=>{
        Page.$["test"].render(t)
    },1000)
    return Page
}



RegisterComponent(Test)


document.querySelectorAll("#app").render(Page);