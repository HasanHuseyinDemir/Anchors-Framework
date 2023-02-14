export const About=()=>{
    let Main= html`
    <div class="content">
    <h1 align="center">About</h1>
    </div>
    `
    Main.onMount(()=>{
        document.title="Anchors-About";
    })

    return Main
}