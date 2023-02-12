import { HTML, html, RegisterComponent } from "./anchors.mjs";

const second=()=>{
return HTML`
<>
<h1 class="test">Çalışıyor</h1>
</>`
}
RegisterComponent(second);

const Page=()=>{
    return html/*jsx*/`
    <div>
    <p class="test">Scoped?</p>
    

    <i>Selam</i>
    selam
    
    <Second/>
    

    <style scoped>
        .test{
            color:orange
        }
        .hello{
            color:blue
        }
        i{
            color:white;
        }
    </style>
    </div>
    `
}

app.render(Page)