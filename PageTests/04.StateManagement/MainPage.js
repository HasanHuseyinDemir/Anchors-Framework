import { buttons } from './buttons.js';
import {html} from './index.js';

export const page=()=>{
    let main = html/*html*/`
    <h1>X = {x}</h1>
    <h1>Y = {y}</h1>
    <h1>Z = {z}</h1>

    ${buttons()}

    `
    return main
}



