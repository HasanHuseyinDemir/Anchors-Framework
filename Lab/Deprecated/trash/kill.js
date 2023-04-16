
//unmounts and kills component
Object.prototype.kill=function(){
    this.unmount.callback();
    document.body.querySelectorAll(`.${this.details.key}`).forEach((e)=>{
        e.remove();
    })
    delete this;
}