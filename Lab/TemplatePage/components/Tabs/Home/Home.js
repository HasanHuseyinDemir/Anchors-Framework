
export const Home=()=>{
    let Main=html/*html*/`
    <div class="content">
    <h1 align="center">Home</h1>
    <style scoped>

    </style>
    </div>
    `
    Main.onMount(()=>{
        document.title="Anchors-Home"
    })
    Main.onUnmount(()=>{
        console.log("Unmount")
    })

    return Main
}


