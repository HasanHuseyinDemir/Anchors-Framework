/*class Merhaba{
    constructor(){
        let button=this.content.querySelector("button");
        button.onclick=()=>{
            this.x++;
            console.log(x)
            this.content.update();
        }
        this.content.states({
            hello(){
                console.log("hello")
            }
        })
        
    }
    x=0
    content=html`
        <>
        <button $onclick="hello">Hello</button>
        <button>${()=>this.x}</button>
        </>
    `;
}

app.render(new Merhaba().content)*/

class Button{
    constructor(content,event) {
        let button=document.createElement("button")
        button.textContent=content;
        button.onclick=event
        return button
    }
}


class Component{
    constructor(){
        this.template.states({
            y:0,
            increase(){
                this.y++
            }
        })
    }
    x=0
    template= html`
    <>
        <h1>Hello</h1> 
        <button $onclick="increase">Increase {{y}}</button>
        <h1>x=${()=>this.x}</h1>
        <h1>y={{y}}</h1>
        ${new Button("Increase",()=>{this.x++,this.template.update()})}
    </>`
}

console.log(new Component())
app.render(new Component().template)



