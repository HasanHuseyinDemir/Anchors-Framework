import { For, html,value } from "./core/anchors.mjs";





 

const Page = () => {
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
    
        deletebtn.onClick=()=>{
            todoList.remove(e);
            page.unMount();
        }
    
        page.onUnmount(()=>{console.log(e.name+" Uçtu")})
    
        return page
      });
    

let length=value(todoList.length())
  let Main=html/*html*/`
  <div>
  <h1>For Test ${()=>todoList.length()}</h1>

  <input [[input]]>
  <button [[addButton]]>Add</button>
      <button [[debug]]>Debug</button>
  <hr>
  ${todoList}

  </div>
  `

  let input=Main.getMark("input");
  let add=Main.getMark("addButton");
    let debugBtn=Main.getMark("debug");
    debugBtn.onClick=()=>{
        console.log(Tasks)
    }

  add.onClick=()=>{
    input.value?todoList.push({name:input.value,completed:false}):"";
    //Main.effect();
  }

  Main.onMount(()=>{console.log("Yüklendi")})

    Main.onSignal(()=>{
        let $length=todoList.length()
        length.value=$length
        if($length==0){
            console.log("Görevler Tamamlandı")
        }
    })
    Main.onEffect(()=>{console.log("Güncellendi")})

  return Main
};

document.querySelectorAll("#app").render(Page)

document.querySelectorAll("#app2").render(Page)