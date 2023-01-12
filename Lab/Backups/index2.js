import { For, html,value } from "./core/anchors.mjs";









const Page = () => {

    let Tasks = [
        { name: "Ev Topla", completed: false},
        { name: "Selam", completed: true },
      ];

    let completed=()=>{
        let i=0;
        Tasks.forEach((e)=>e.completed?i++:"")
        if(i>0){
            return `(${i})`
        }
    }
    
  const todoList = For(Tasks, (e) => {
    let page=html/*html*/`
    <div>
    <input type="checkbox" [[checkbox]]>
    ${()=>e.name} ${()=>e.completed?"- Completed!":""}
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
        console.log(todoList.array)
        todoList.remove(e);
        todoList.update();
        page.unMount();
    }

    page.onUnmount(()=>{console.log(e.name+" Uçtu")})

    return page
  });
//let length=value(Tasks.length())
    let signal=value(0);
    let click=value(0);
    let effect=value(0);  
let Main=html/*html*/`
  <div>
  <h1>For Test ${()=>Tasks.length} ${completed}</h1>

  <input [[input]]>
  <button [[addButton]]>Add</button>
      <button [[debug]]>Debug</button>
  <hr>
  ${todoList}

  <hr>
  <h3>Signal : ${signal} ${()=>new Date().getSeconds()}</h3>
  <h3>Click : ${click}</h3>
  <h3>Effect : ${effect}</h3>
  </div>
  `

  let input=Main.getMark("input");
  let add=Main.getMark("addButton");
    let debugBtn=Main.getMark("debug");
    debugBtn.onClick=()=>{
        console.log(todoList.array)
    }

  add.onClick=()=>{
    input.value?todoList.push({name:input.value,completed:false}):"";
    //Main.effect();
  }

  Main.onMount(()=>{console.log("Yüklendi")})

    Main.onSignal((e)=>{
        let $length=todoList.length()
        //length.value=$length
        if($length==0){
            console.log("Görevler Tamamlandı")
        }
    })
    Main.onEffect((e)=>{
        effect.value=effect.value+1
    })
    Main.onTrigger((e)=>{
        switch(e.event){
            case "click":click.value=click.value+1;break;
        }
        console.log(click.value)
    })

  return Main
};

document.querySelectorAll("#app").render(Page)
