import { HTML } from "../anchors.mjs"

export const Plain=(a)=>{
    let Main=HTML/*html*/`
    <div>
        {Selam}
        <button [[art]]>Increase {i}</button>
    </div>
    `

    let i=0;

    console.log(Main.content)
    let div=Main.getNodes("Selam");
    let iNode=Main.getNodes("i");
    iNode.text=i;
    let art=Main.getMark("art");
    art.onClick=()=>{
        i++;
        iNode.text=i
    }
    div.text="Hello";

    return Main
}