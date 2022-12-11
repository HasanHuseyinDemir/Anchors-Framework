//Pages needs to be on top for state management
import { MainPage } from "./Mainpage.js";
import { x } from "./store.js";

document.querySelector("#anchors").render(MainPage);

document.body.getMark("t").text=12121;
document.body.getMark("t").text=121111121;