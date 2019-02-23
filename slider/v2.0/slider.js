// 优化点：插件/依赖注入，降低代码间的耦合度
//缺点：去掉某个小功能 既需要修改html也需要修改js
class Slider{
    constructor(id, cycle = 3000){
        this.container = document.getElementById(id);
        this.sliderItems = this.container.querySelectorAll(".slider-item");
        this.sliderItemsLen = this.sliderItems.length;
        this.cycle = cycle;
    }
    // 插件/依赖注入
    registerPlugins(...plugins){
        // 将this注入插件中
        plugins.forEach(plugin => plugin(this));
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

function pluginController(slider){
    const controller = slider.container.querySelector("#controller-list");
    //结构解耦（去掉相关html结构也不报错）
    if(controller){
        const controllerItems = controller.querySelectorAll(".controller-item");
        controller.addEventListener('mouseover', (event)=>{
            let index = Array.from(controllerItems).indexOf(event.target);
            if(index >= 0){
                slider.sliderTo(index);
                slider.stop();
            }
        })
        controller.addEventListener('mouseout', (event)=>{
            slider.start();
        })

        slider.container.addEventListener('slider',(event)=>{
            let index = event.detail.index;
            let selected = controller.querySelector('.controller-item-selected');
            if(selected){
                selected.className = "controller-item";
            }
            controllerItems[index].className = "controller-item controller-item-selected";
        })
    }
}

function pluginPrev(slider){
    const prev = slider.container.querySelector("#prev");
    //结构解耦（去掉相关html结构也不报错）
    if(prev){
        prev.addEventListener('click',(event)=>{
            slider.stop();
            slider.sliderPrev();
            slider.start();
            event.preventDefault();
        })
    }
}

function pluginNext(slider){
    const prev = slider.container.querySelector("#next");
    //结构解耦（去掉相关html结构也不报错）
    if(prev){
        prev.addEventListener('click',(event)=>{
            slider.stop();
            slider.sliderNext();
            slider.start();
            event.preventDefault();;
        })
    }
}

const slider = new Slider('slider');
// 需要注册哪些插件就传哪些
slider.registerPlugins(pluginController,pluginPrev,pluginNext);
slider.start();
