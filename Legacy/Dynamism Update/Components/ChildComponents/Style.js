import { html } from "../../../../Versions/1.4-Dynamism Update/anchors.mjs";

export const Style=()=>{
    return html/*html*/`
    <style>
    *{
        box-sizing:border-box;
    }
    img{
        width:200px;
        height:200px;
        border-radius:5%;
    }
    #container{
        display:grid;
        grid-template-columns:1fr 1fr 1fr 1fr 1fr;
        background-color:gray;
        padding:2px;
        border-radius:0 0 50px 50px;
        overflow:hidden;
    }
    .card{
        padding:3px;
        width:100%;
        overflow:hidden;
    }
    img#card{
        width:100%;
        border-radius:0px 0px 22px 22px;
        height:50%;
        cursor:pointer;
    }
    .yellow{
        background-color:yellow
    }
    .lightgreen{
        background-color:lightgreen
    }
    .cyan{
        background-color:cyan
    }
    .orange{
        background-color:orange
    }
    .lightgray{
        background-color:lightgray
    }
    </style>
    `
}