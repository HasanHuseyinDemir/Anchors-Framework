import { html, state } from "../../../Versions/1.2-Setter Update/anchors.mjs";
import { y,setY,listY } from "./y.js";

export const SetterTest = () => {
  let page = html/*html*/ `
    <div>
      <h1>Setter Test</h1>
      [- You can manage state from outside of component -]
      <p>X = {x}</p>
      <p>Y = {y}</p>
      <hr>
      <h3>X Value = {x}</h3>
      <button [[increase X]]>X+1</button>
      <button [[decrease X]]>X-1</button>
      <hr />

      [- Outside of Component -]
      <h3>Y Value = {y}</h3>
      <button [[increase Y]]>Y+1</button>
      <button [[decrease Y]]>Y-1</button>

      <hr />

      <input [[input]] />
      <p>Input Text = {Input Text}</p>
    </div>
  `;
  let xValue = page.getNodes("x");

  //Markers
  let increaseButton = page.getMark("increase X");
  let decreaseButton = page.getMark("decrease X");
  let input = page.getMark("input");
  let inputText = page.getNodes("Input Text");

  //Parameters - [0] x value , [1] Textnode or Element TextContent changer
  //Alternative usage const [x,setX]=state(0,page.getNodes("x"));
  //or multiple states : state(0,xValue,inputText)  === state(0,page.getNodes("x"),page.getNodes("Input Text"));
  //You can update multiple nodes,
  //Like : const [x,setX]=state(0,xValue,inputText);
  const [x, setX] = state(0, xValue, inputText);

  //TextOutput Setter
  const [output, setOutput] = state("Hello World!", inputText);

  input.onInput = (e) => {
    setOutput(e.target.value);
  };

  increaseButton.onClick = () => {
    setX(x() + 1);
    input.placeholder=x();
  };

  decreaseButton.onClick = () => {
    setX(x() - 1);
  };

  ///Outside Of Component (Y Value)
  let increaseYButton=page.getMark("increase Y");
  let decreaseYButton=page.getMark("decrease Y");

  //
  let yNode=page.getNodes("y")

  increaseYButton.onClick=()=>{
    setY(y()+1);
  }
  decreaseYButton.onClick=()=>{
    setY(y()-1);
  }

  //You need to add outside of component
  //listY == NodeList
  //You can Push or Delete TextNodes
  listY.push(yNode)

  return page;
};

document.querySelectorAll("#app").render(SetterTest);
