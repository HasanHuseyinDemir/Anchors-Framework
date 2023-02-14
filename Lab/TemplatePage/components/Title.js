import { Scroll } from "./Scroll.js";

export const Title=()=>{
    let Main = html/*html*/ `
    <>
    [-Title-]
    <div id="orbit-container">
    <img id="firstAnchor" src="./media/anchor.png"/>
    <span>Anchors Framework</span>
    <img id="secondAnchor" src="./media/anchor.png"/>
    </div>

    [- Scoped Style -]
    <style scoped>
        img{
            position:absolute;
            width:100px;
        }
        #orbit-container{
            display:flex;
            justify-content:center;
            align-items:center;
            position:relative;
        }
        #firstAnchor{
            left: 0;
            transform: rotate(90deg)
        }
        #secondAnchor{
            right: 0;
            transform: rotate(270deg)
        }
        #orbit-container>img{
            width: 5vw
        }
        #orbit-container{
            animation: spin linear infinite 4s;
            background: rgba(255,255,255,0.28);
            width: 100%;
            overflow: hidden;
        }
        #orbit-container>span{
            font-size: 3em;    
        }

        
    </style>
    </>
    `;

    Main.onMount(()=>{
        console.log("Anchors Framework");
    })

    return Main
}

RegisterComponent(Title)