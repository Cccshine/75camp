// 优化点：改进插件/模板化
class Component{
    constructor(id, ops={name, data:[]}){
        this.container = document.getElementById(id);
        this.options = ops;
        this.container.innerHTML = this.render(ops.data);
    }
    registerPlugins(...plugins){
        plugins.forEach(plugin =>{
            const pluginContainer = document.createElement("div");
            pluginContainer.className = `.${this.options.name}-plugin`;
            pluginContainer.innerHTML = plugin.render(this.options.data);
            this.container.appendChild(pluginContainer);
            plugin.action(this);
        })
    }
    render(data){
    }
}

class Slider extends Component{
    constructor(id, ops = {name: 'slider', data:[], cycle: 3000}){
        super(id, ops);
        this.sliderItems = this.container.querySelectorAll(".slider-item");
        this.sliderItemsLen = this.sliderItems.length;
        this.cycle = ops.cycle || 3000;
        this.sliderTo(0);
    }
    render(data){
        const content = data.map(image => `
            <li class="slider-item">
                <img src="${image}"/>
            </li>
        `.trim())
        return `<ul id="slider-list">${content.join('')}</ul>`;
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

const pluginController = {
    render(images){
        return `
            <div id="controller-list">
                ${images.map((image,i) => `
                    <span class="controller-item ${i===0?'controller-item-selected':''}"></span>
                `).join('')}
            </div>
        `.trim();
    },
    action(slider){
        const controller = slider.container.querySelector("#controller-list");
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
}

const pluginPrev = {
    render(){
        return `<a id="prev"></a>`;
    },
    action(slider){
        const prev = slider.container.querySelector("#prev");
        if(prev){
            prev.addEventListener('click',(event)=>{
                slider.stop();
                slider.sliderPrev();
                slider.start();
                event.preventDefault();
            })
        }
    }
}

const pluginNext = {
    render(){
        return `<a id="next"></a>`;
    },
    action(slider){
        const prev = slider.container.querySelector("#next");
        if(prev){
            prev.addEventListener('click',(event)=>{
                slider.stop();
                slider.sliderNext();
                slider.start();
                event.preventDefault();;
            })
        }
    }
}

const slider = new Slider('slider',{name: 'slider', data: ['../img/a.jpg','../img/b.jpg','../img/c.jpg','../img/d.jpg'], cycle:3000});
// 需要注册哪些插件就传哪些
slider.registerPlugins(pluginController,pluginPrev,pluginNext);
slider.start();
