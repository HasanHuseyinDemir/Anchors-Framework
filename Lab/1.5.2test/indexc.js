const C=(first,second)=>{
    let p=second;
    first(p);
    return p
}

const Main=()=>C(
        (Page)=>{
            Page.states({
                x:0,
                increase(){
                    this.x++
                }
            })
        },
        html`
        <>  
            <p>{{x}}</p>
            <button $onclick="increase">Merhaba</button>
        </>
        `
)

app.render(Main)