import { html,For } from "../anchors.mjs";

const Main=()=>{

    let array=[
        {title:"yellow",slot:"This is Yellow"},
        {title:"orange",slot:"Orange Peel"},
        {title:"red",slot:"Scarlet"},
        {title:"cyan"}
    ]

    let simple=array.map((e)=>{
        return `<test-page title="${e.title}">${e.slot||"Empty"}</test-page>`
    }).join("")
    
    let forFrag=For(array,(e)=>{
        let items=e;
        let page=html/*html*/`
        <div>
        ${e.title}
        <button @onclick="delete">Delete This</button>

        </div>`;

        page.states({
            delete(){
                delete array[array.indexOf(e)];
                forFrag.removeEmptyItems();
                page.unMount();
            }

        })
        return page
    })

    let Main=html/*html*/`
    <div>

    <h1>Add</h1>
    <h2>Length : ${()=>array.length}</h2>
    <input @model="input">
    <button @onclick="add">Add : {{input}}</button>
    <button @onclick="debug">debug</button>
    <hr>


    
    ${forFrag}

    </div>
    `

    Main.states({
        input:"",
        add(){
            forFrag.push({title:this.input||"Default"})
            console.log(array)
        },
        debug(){
            console.log(array)
        }

    })


    return Main
}

document.querySelectorAll("#app").render(Main)