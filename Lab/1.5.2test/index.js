let store=createStore({
    test:{
        array:["hello","world"],
        ar(arg){
            return this.array[arg]
         }
    }
})
window.store=store;

let test=[1,2,3];

let newPage=()=>{
    return html`
    <p>Page</p>

    `
}
let page= html`
    <div>
    <div $class="test.ar(0)"/>
    ${newPage}
    {{test.ar(0)}}
    {{test.ar(1)}}
    </div>`
page.onUnmount(()=>{console.log("Silindi!")})
page.createEffect(()=>{console.log("effect")})

setInterval(()=>{page.update()},1000)


page.registerStore(store)
app.render(page)