import {html,c} from "../../Versions/Value-Update 1.1/Bugged Release/anchors.mjs" 
export {html,c}

//Pages must be on top for state management
import { mainPage } from "./store.js";





document.querySelector("#anchors").render(mainPage);