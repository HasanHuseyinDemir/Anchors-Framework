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

document.querySelectorAll("#app").render(Page);