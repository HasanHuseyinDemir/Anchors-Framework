
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
    Main.details.onUnmount=()=>{
        console.log("Home-Unmount")
    }

    return Main
}


