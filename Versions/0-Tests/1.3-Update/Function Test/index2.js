import { For, html } from "./core/anchors.mjs";


const Tasks = [
    { name: "Ev Topla", completed: false, src: "google" },
    { name: "Selam", completed: true, src: "web" },
  ];

  const todoList = For(Tasks, (e, index) => {
    let page=html/*html*/`
    <div>
    <input type="checkbox" [[checkbox]]>
    ${()=>index}-${()=>e.name} ${()=>e.completed?"-Completed!":""}
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
        todoList.array[e]?"":page.kill()
    })

    page.onMount(()=>{
        console.log(e+" Eklendi")
    })

    deletebtn.onClick=()=>{
        todoList.remove(e)
    }

    page.onUnmount(()=>{console.log(e.name+" Uçtu")})

    return page
  });

const Page = () => {
  let Main=html/*html*/`
  <div>
  <h1>For Test</h1>

  ${todoList}


  <input [[input]]>
  <button [[addButton]]>Add</button>
  </div>
  `

  let input=Main.getMark("input");
  let add=Main.getMark("addButton");



  add.onClick=()=>{
    input.value?todoList.push({name:input.value,completed:false,src:""}):"";
  }

  return Main
};

document.querySelectorAll("#app").render(Page)
