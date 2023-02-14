export const Examples=()=>{
    let Main= html`
    <div class="content">
    <h1 align="center">Examples</h1>
    </div>
    `

    Main.onMount(()=>{
    document.title="Anchors-Examples"
    })
    Main.onUnmount(()=>{
        console.log("Examples-Unmount")
    })
    return Main
}