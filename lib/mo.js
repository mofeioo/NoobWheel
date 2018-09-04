//基于es5的常用方法
var mo = {// --- event ---
//兼容问题的解决
//event获取的兼容
//获取样式的兼容解决(非行内样式)
    getStyle: function (ele, attr) {
        if (ele.currentStyle) {
            return ele.currentStyle[attr];
        } else {
            return getComputedStyle(ele, false)[attr];
        }
    },
//取消事件冒泡的兼容
    stopBubble: function (e) {
        if (e.stopPropagation) {
            e.stopPropagation()
        }
        else {
            e.cancelBubble = true;
        }
    },
//阻止默认事件
    stopDefaultEv: function (e) {
        if (e.preventDefault) {
            e.preventDefault()
        } else {
            e.returnValue = false;
        }
    }
    ,
//添加事件监听
    addEvent: function (ele, type, callback) {
        if (ele.addEventListener) {
            ele.addEventListener(type, callback, false)
        } else if (ele.attachEvent) {
            ele.attachEvent("on" + type, callback)
        } else {
            ele["on" + type] = callback
        }
    }
    ,
//删除事件监听
    removeEvent: function (ele, type, callback) {
        if (ele.removeEventListener) {
            ele.removeEventListener(type, callback, false)
        } else if (ele.detachEvent) {
            ele.detachEvent("on" + type, callback)
        } else {
            ele["on" + type] = null;
        }
    },

    //常规事件委托封装
    evEntrust: function (child, callback) {
        return function (e) {
            var ev = e || window.event;
            var target = ev.target || ev.srcElement;
            if (child.length) {
                for (var i = 0; i < child.length; i++) {
                    if (target === child[i]) {
                        callback.bind(target)();
                    }
                }
            } else {
                if (target === child) {
                    callback.bind(target)();
                }
            }
        }
    },

// 事件委托封装 简易版
    evEntrustPlus: function (select, callback) {
        //select css选择器
        return function (e) {
            var ev = e || window.event;
            var target = ev.target || ev.srcElement;
            var child = this.querySelectorAll(select);
            for (var i = 0; i < child.length; i++) {
                if (target === child[i]) {
                    callback.bind(target)();
                }
            }
        }
    },
    //矩形dom元素碰撞检测
    eleCrash:function (ele, bar, callback) {
    if (ele.offsetLeft >= bar.offsetLeft - ele.offsetWidth && ele.offsetLeft <= bar.offsetLeft + bar.offsetWidth && ele.offsetTop >= bar.offsetTop - ele.offsetHeight && ele.offsetTop <= bar.offsetTop + bar.offsetHeight) {
        callback();
    }
},
    // 动画的链式封装 速度递减  不同元素，不同属性，链式运动
// 没有做透明的兼容
    animation:function (ele, obj, callback) {
    //ele dom元素
    //obj属性对象 {attr:value,...}
    //callback 回调函数 非必须 可以再次传入animation()做链式运动
    clearInterval(ele.timer);
    var nowAttr;
    var step;
    ele.timer = setInterval(function () {
        //遍历对象，用来设置每一个属性
        var onOff = true;
        for (var attr in obj) {
            //attr==> key
            //obj[attr] ==> value
            //缓冲 步长为剩下 。。可运动的 几分之几
            if (attr == "opacity") {
                nowAttr = getStyle(ele, attr) * 100;
            } else {
                nowAttr = parseInt(getStyle(ele, attr));
            }
            step = (obj[attr] - nowAttr) / 8;
            step = step < 0 ? Math.floor(step) : Math.ceil(step);
            // 用来让最后的运动刚好到终点
            if (attr == "opacity") {
                ele.style[attr] = (nowAttr + step) / 100;
            } else {
                ele.style[attr] = nowAttr + step + "px";
            }
            //开关 所有动画停止才停止计时器
            if (nowAttr != obj[attr]) onOff = false;
            if (onOff) {
                clearInterval(ele.timer);
                if (callback) callback();
            }
        }
    }, 30);
}

}


