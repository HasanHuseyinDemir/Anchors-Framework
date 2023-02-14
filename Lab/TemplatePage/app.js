import { Title } from "./components/Title.js"
import { store } from "./store.js";

//HTML is better for static pages
const Page=()=>{
    let Main= HTML/*jsx*/`
    <>
    [-Wallpaper-]
    <div id="wallpaper"/>
    <Title/>
    <Scroll/>
    <Content/>

    <style>
    #wallpaper{
        position: absolute;
        background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSdibGFjaycvPgogIDxwYXRoIGQ9J00tMSwxIGwyLC0yCiAgICAgICAgICAgTTAsMTAgbDEwLC0xMAogICAgICAgICAgIE05LDExIGwyLC0yJyBzdHJva2U9J3doaXRlJyBzdHJva2Utd2lkdGg9JzEnLz4KPC9zdmc+"); background-repeat: repeat;        width: 100vw;
        height:100vh;   
        opacity: 0.1;
        z-index:-5;    
    }
    .content{
        width:100vw;
        height:80vh;
        max-height:80vh;
        overflow-y:scroll;
        overflow-x:hidden;
        overflow-wrap: break-word;
        background:lightgray;
        padding:20px;
    }
    </style>
    </>`

    Main.onMount(()=>{
    store.switchCategory();
    })

    return Main
}

document.querySelectorAll("#app").render(Page)