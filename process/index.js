class Process{
    constructor(options){
        const defaultOptions = {
            id: "process",
            mode: "bar",
            cycle: 100, 
            allColor: "#575a5a",
            ingColor: "#ef9696",
            stepUnit: 1//阶梯进度，最小为0.01，最大为10
        }
        for(let key in defaultOptions){
            if(defaultOptions.hasOwnProperty(key) && !options.hasOwnProperty(key)){
                options[key] = defaultOptions[key];
            }
        }
        this.options = options;
        this.step = 0;
        this.stepUnit = options.stepUnit;
        this.stepUnit < 0.01 && (this.stepUnit = 0.01);
        this.stepUnit > 10 && (this.stepUnit = 10);
        this.container = document.getElementById(options.id);
        this.plugin = (options.mode == "circle" ? pluginCircle : (options.mode == "triangle" ? pluginTriangle : pluginBar));
        this.container.innerHTML = this.plugin.render();
        this.plugin.action(this);
    }
    getCurrentStep(){
        return this.step;
    }
    setCurrentStep(step){
        this.step = step;
        const detail = {step: step};
        const event = new CustomEvent('step', {bubbles:true, detail})
        this.container.dispatchEvent(event);
    }
    toNextStep(){
        let step = this.getCurrentStep();
        let newStep = add(step, this.stepUnit);
        newStep = newStep > 100 ? 100 : newStep;
        this.setCurrentStep(newStep);
    }
    start(){
        this.stop();
        this.timer = setInterval(this.toNextStep.bind(this),this.options.cycle);
    }
    stop(){
        clearInterval(this.timer);
    }
    complete(){
        this.stop();
        console.log("加载完成");
    }
}

const pluginBar = {
    render(){
        return `
            <div class="process-container bar-mode">
                <div class="process-all">
                    <div class="process-ing"></div>
                </div>
                <div class="process-tip">0%</div>
            </div>
        `.trim();
    },
    action(process){
        process.container.querySelector(".process-all").style.background = process.options.allColor;
        process.container.querySelector(".process-ing").style.background = process.options.ingColor;
        process.container.addEventListener('step',(event)=>{
            var step = event.detail.step;
            process.container.querySelector(".process-ing").style.width = step + "%";
            process.container.querySelector(".process-tip").innerText = step + "%";
            if(step >= 100){
                process.complete();
            }
        })
    }
}

const pluginCircle = {
    render(){
        return `
            <div class="process-container circle-mode">
                <div class="process-ing">
                    <div class="process-tip">0%</div>
                </div>
            </div>
        `.trim();
    },
    action(process){
        process.container.querySelector(".process-ing").style.background = "conic-gradient("+ process.options.ingColor +" 0 0%,"+ process.options.allColor +" 0 100%)";
        process.container.addEventListener('step',(event)=>{
            var step = event.detail.step;
            process.container.querySelector(".process-ing").style.background = "conic-gradient("+ process.options.ingColor +" 0 "+ step +"%,"+ process.options.allColor +" 0 100%)";
            process.container.querySelector(".process-tip").innerText = step + "%";
            if(step >= 100){
                process.complete();
            }
        })
    }
}

const pluginTriangle = {
    render(){
        return `
            <div class="process-container triangle-mode">
                <div class="process-top process-all">
                    <div class="process-top-ing process-ing"></div>
                </div>
                <div class="process-bottom process-all">
                    <div class="process-bottom-ing process-ing"></div>
                </div>
                <div class="process-tip">0%</div>
            </div>
        `.trim();
    },
    action(process){
        process.container.querySelector(".process-top").style.borderTopColor = process.options.allColor;
        process.container.querySelector(".process-bottom").style.borderBottomColor = process.options.allColor;
        process.container.querySelector(".process-top-ing").style.borderTopColor = process.options.ingColor;
        process.container.querySelector(".process-bottom-ing").style.borderBottomColor = process.options.ingColor;
        process.container.addEventListener('step',(event)=>{
            var step = event.detail.step;
            process.container.querySelector(".process-top-ing").style.borderWidth = (100 - step) + "px";
            process.container.querySelector(".process-bottom-ing").style.borderWidth = step + "px";
            process.container.querySelector(".process-tip").innerText = step + "%";
            if(step >= 100){
                process.complete();
            }
        })
    }
}

function times(num1,num2){
    let baseNum = 0; 
    try { 
        baseNum += num1.toString().split(".")[1].length; 
    } catch (e) { 
    } 
    try { 
        baseNum += num2.toString().split(".")[1].length; 
    } catch (e) { 
    } 
    return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum); 
}
function add(num1,num2){
    let baseNum1 = 0, baseNum2 = 0; 
    try { 
        baseNum1 += num1.toString().split(".")[1].length; 
    } catch (e) { 
    } 
    try { 
        baseNum2 += num2.toString().split(".")[1].length; 
    } catch (e) { 
    } 
    let baseNum = Math.max(baseNum1, baseNum2);
    return (times(num1,Math.pow(10, baseNum)) + times(num2,Math.pow(10, baseNum))) / Math.pow(10, baseNum);
}
const circleProcess = new Process({
    id:"circle-process",
    mode: "circle"
})
circleProcess.start();
const barProcess = new Process({
    id:"bar-process",
    mode: "bar"
})
barProcess.start();
const triangleProcess = new Process({
    id:"triangle-process",
    mode: "triangle"
})
triangleProcess.start();