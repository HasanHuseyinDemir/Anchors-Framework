export const store={
    count:0,
    increase(){
        this.count++
        //console.log("Increased Count : "+this.count)
    },
    decrease(){
        this.count--
        //console.log("Decreased Count : "+this.count)
    },
    reset(){
        this.count=0;
        console.log("Reset")
    }
}