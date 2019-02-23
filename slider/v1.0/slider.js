class Slider{
    constructor(id, cycle = 3000){
        this.container = document.getElementById(id);
        this.sliderItems = this.container.querySelectorAll(".slider-item");
        this.sliderItemsLen = this.sliderItems.length;
        this.cycle = cycle;

        const controller = document.getElementById("controller-list");
        if(controller){
            const controllerItems = controller.querySelectorAll(".controller-item");
            controller.addEventListener('mouseover', (event)=>{
                let index = Array.from(controllerItems).indexOf(event.target);
                if(index >= 0){
                    this.sliderTo(index);
                    this.stop();
                }
            })
            controller.addEventListener('mouseout', (event)=>{
                this.start();
            })

            this.container.addEventListener('slider',(event)=>{
                let index = event.detail.index;
                let selected = controller.querySelector('.controller-item-selected');
                if(selected){
                    selected.className = "controller-item";
                }
                controllerItems[index].className = "controller-item controller-item-selected";
            })
        }

        const prev = document.getElementById("prev");
        if(prev){
            prev.addEventListener('click',(event)=>{
                this.stop();
                this.sliderPrev();
                this.start();
                event.preventDefault();
            })
        }

        const next = document.getElementById("next");
        if(next){
            next.addEventListener('click',(event)=>{
                this.stop();
                this.sliderNext();
                this.start();
                event.preventDefault();
            })
        }
        
    }
    getSelectedItem(){
        let selected = this.container.querySelector(".slider-item-selected");
        return selected;
    }
    getSelectedItemIndex(){
        return Array.from(this.sliderItems).indexOf(this.getSelectedItem());
    }
    sliderTo(index){
        let selected = this.getSelectedItem();
        if(selected){
            selected.className = "slider-item";
        }
        let target = this.sliderItems[index];
        if(target){
            target.className = "slider-item slider-item-selected";
        }

        const detail = {index: index};
        const event = new CustomEvent('slider', {bubbles:true, detail})
        this.container.dispatchEvent(event);
    }
    sliderPrev(){
        var selectedIndex = this.getSelectedItemIndex();
        var targetIndex = (selectedIndex - 1 + this.sliderItemsLen)%this.sliderItemsLen;
        this.sliderTo(targetIndex);
    }
    sliderNext(){
        var selectedIndex = this.getSelectedItemIndex();
        var targetIndex = (selectedIndex + 1 + this.sliderItemsLen)%this.sliderItemsLen;
        this.sliderTo(targetIndex);
    }
    start(){
        this.stop();
        this.timer = setInterval(this.sliderNext.bind(this),this.cycle);
    }
    stop(){
        clearInterval(this.timer);
    }
}

const slider = new Slider('slider');
slider.start();
