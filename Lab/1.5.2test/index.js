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

class Component{
    constructor(){
        this.template.states({
            y:0,
            increase(){
                this.y++
            }
        })
    }
    x=0;
    template= html`
    <>
        <h1>Hello</h1> 
        <button $onclick="increase">Increase {{y}}</button>
    </>`
}
app.render(new Component().template)