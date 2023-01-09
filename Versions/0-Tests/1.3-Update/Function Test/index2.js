import { simpleFor, html } from "./core/anchors.mjs";


const Tasks = [
    { name: "Ev Topla", completed: false, src: "google" },
    { name: "Selam", completed: true, src: "web" },
  ];

  const todoList = simpleFor(Tasks, (e, index) => {
    return /*html*/`<p key=${index}>Adı = ${e.name} ${e.completed?"-Tamamlandı!":""}</p>`
  });

const Page = () => {
  let Main=html/*html*/`
  <div>For Test</div>

  <div [[tests]]>${todoList}</div>

  <input [[input]]>
  <button [[addButton]]>Add</button>
  `

  let input=Main.getMark("input");
  let add=Main.getMark("addButton");
  let tests=Main.getMark("tests");

  tests.onClick=(e)=>{
    let getKEY=e.target.getAttribute("key");
    if(Tasks[getKEY].completed==false){
        Tasks[getKEY].completed=true
    }else if(Tasks[getKEY].completed==true){
        delete Tasks[getKEY]
    }

    todoList.update();
  }


  add.onClick=()=>{
    input.value?Tasks.push({name:input.value,completed:false,src:""}):console.log("BOŞ")
    todoList.update();
  }

  return Main
};

document.querySelectorAll("#app").render(Page)
