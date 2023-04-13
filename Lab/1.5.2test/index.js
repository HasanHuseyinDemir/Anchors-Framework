let el=document.createElement("a")
el.textContent="hello" 

let x=0

let store=createStore({
    x:5,
    test:{
        y:1,
        x:22,
        nest:{
            xd(){
                return x
            }
        }
    },
    xPlusY(){
        return this.test.x+this.test.y
    },
    xd(){
        console.log("Hello")
    },
    increase(){
        x++;
        this.x=x;
    },
    clock:{
        hour:new Date().getHours(),
        minute:new Date().getMinutes(),
        second:new Date().getSeconds()
    }
})

setInterval(()=>{
    let {clock}=store
    clock.hour=new Date().getHours()
    clock.minute=new Date().getMinutes()
    clock.second=new Date().getSeconds()
},1000)


let page= html`
    <div>
    <h1>{{clock.hour}}:{{clock.minute}}:{{clock.second}}</h1>
    </div>`

page.onUnmount(()=>{console.log("xd")})
page.registerStore(store)
app.render(page)