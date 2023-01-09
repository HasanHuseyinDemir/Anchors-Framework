import { For, html,value } from "./core/anchors.mjs";



const Tasks = [
    { name: "Ev Topla", completed: false},
    { name: "Selam", completed: true },
  ];

  const todoList = For(Tasks, (e) => {
    let page=html/*html*/`
    <div>
    <input type="checkbox" [[checkbox]]>
    ${()=>e.name} ${()=>e.completed?"-Completed!":""}
    <button [[deletebtn]]>Delete</button>
    </div>
    `

    let deletebtn=page.getMark("deletebtn");
    let check=page.getMark("checkbox");

    check.checked=e.completed;

    check.onInput=(el)=>{
        e.completed=el.target.checked;
        page.effect();
    }

    page.onSignal(()=>{
        if(todoList.search(e,"index")==-1){
            page.unMount()
        }
    })

    deletebtn.onClick=()=>{
        todoList.remove(e);
        page.unMount();
    }

    page.onUnmount(()=>{console.log(e.name+" Uçtu")})

    return page
  });



const Page = () => {
let length=value(todoList.length())
  let Main=html/*html*/`
  <div>
  <h1>For Test ${length}</h1>

  <input [[input]]>
  <button [[addButton]]>Add</button>
  <hr>
  ${todoList}



  </div>
  `

  let input=Main.getMark("input");
  let add=Main.getMark("addButton");

  add.onClick=()=>{
    input.value?todoList.push({name:input.value,completed:false}):"";
    Main.effect();
  }

  Main.onMount(()=>{console.log("Yüklendi")})

  Main.onSignal(()=>{
    length.value=todoList.length()
    })

  return Main
};

document.querySelectorAll("#app").render(Page)
