import { About } from "./components/Tabs/About/About.js";
import { Examples } from "./components/Tabs/Examples/Examples.js";
import { Home } from "./components/Tabs/Home/Home.js";
import { Tutorials } from "./components/Tabs/Tutorials/Tutorials.js";

export const store={
    activeCategory:0,
    setCategory(arg=Number){
        this.activeCategory!=arg&&typeof arg=="number"?(
            this.activeCategory=arg,
            this.switchCategory()
            ):""
            
    },
    switchCategory(){
        switch(this.activeCategory){
            case 0:(
                document.querySelectorAll("content").render(Home)
            );break;
            case 1:(
                document.querySelectorAll("content").render(Tutorials)
            );break;
            case 2:(
                document.querySelectorAll("content").render(Examples)
            );break;
            case 3:(
                document.querySelectorAll("content").render(About)
            );break;
        }
    }
}

