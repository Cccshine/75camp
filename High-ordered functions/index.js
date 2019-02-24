// 各司其职：JavaScript 尽量只做状态管理
// 结构、API、控制流分离设计 UI 组件
// 插件和模板化，并抽象出组件模型
// 运用过程抽象的技巧来抽象并优化局部 API


// 自身输入或返回函数，被称为高阶函数
//once 只能执行一次
function fa(num){
    console.log(`I'm called:${num}`);
}
fa(1);
fa(2);
fa(3);

function once(fn){
    return function(...args){
        if(fn){
            let ret = fn.apply(this, args);
            fn = null;
            return ret;
        }
    }
}

fa = once(fa);
fa(1);
fa(2);
fa(3);

// 节流(隔time才执行一次)
function throttle(fn, time=500){
    let timer = null;
    return function(...args){
        if(!timer){
            fn.apply(this, args);
            timer = setTimeout(()=>{
                timer = null;
            }, time)
        }
    }
}

let btn = document.getElementById("btn");
let circle = document.getElementById("circle");
btn.onclick = throttle(function(e){
    circle.innerHTML = parseInt(circle.innerHTML) + 1;
});

// 节流(动作停止time才执行)
function debounce(fn, time=500){
    let timer = null;
    return function(...args){
        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout(()=>{
            fn.apply(this, args);
            timer = null;
        }, time)
    }
}

let btn1 = document.getElementById("btn1");
let circle1 = document.getElementById("circle1");
btn1.onclick = debounce(function(e){
    circle1.innerHTML = parseInt(circle1.innerHTML) + 1;
});


// 消费者，延迟time执行一次
function consumer(fn, time=1000){
    let timer = null,
        task = [];
    return function(...args){
        task.push(fn.bind(this, args));
        if(!timer){
            timer = setInterval(()=>{
                task.shift().call(this);
                if(!task.length){
                    clearInterval(timer);
                    timer = null;
                }
            }, time)
        }
    }
}

let btn2 = document.getElementById("btn2");
let circle2 = document.getElementById("circle2");
btn2.onclick = consumer(function(e){
    circle2.innerHTML = parseInt(circle2.innerHTML) + 1;
});

// reduce
function add(x, y){
    return x + y;
}
function sub(x, y){
    return x - y;
}

function addMany(...args){
    return args.reduce(add);
}
function subMany(...args){
    return args.reduce(sub);
}
console.log(addMany(1,2,3,4));
console.log(subMany(1,2,3,4));

function iterative(fn){
    return function(...args){
        return args.reduce(fn.bind(this));
    }
}
const addMany1 = iterative(add);
const subMany1 = iterative(sub);
console.log(addMany1(1,2,3,4));
console.log(subMany1(1,2,3,4));

// toggle
function toggle(...actions){
    return function(...args){
        let action = actions.shift();
        actions.push(action);
        return action.apply(this, args);
    }
}

let switcher = document.getElementById("switcher");
switcher.onclick = toggle(
    evt => evt.target.className = 'off',
    evt => evt.target.className = 'on'
);