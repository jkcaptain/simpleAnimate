//缺少动画队列
/*参考资料
 * https://github.com/zhangxinxu/Tween/blob/master/tween.js
 * http://www.cnblogs.com/aaronjs/p/4278660.html
 * https://github.com/akira-cn/animator.js/blob/master/lib/animator.js
*/
(function() {
    if (typeof window.requestAnimationFrame !== "undefined") {
        window.requestAnimationFrame = function(callback, interval) {
            return setTimeout(function() {
                callback.call(this, nowtime());
            }, interval);
        };
        window.cancelAnimationFrame = function(timerId) {
            clearTimeout(timerId);
            timerId = null;
        };
    }

    function getAttr(elem, attrKey) {
        var attrReg = /scrollTop|scrollLeft/;
        if (attrReg.test(attrKey)) {
            return elem[attrKey] || 0;
        }

        var attrValue;
        if (typeof window.getComputedStyle === "function") {
            attrValue = window.getComputedStyle(elem, null)[attrKey];
        } else {
            attrValue = elem.currentStyle[attrKey];
        }
        return parseFloat(attrValue);
    }

    function setAttr(elem, attrKey, attrValue, suffix) {
        suffix = suffix || "px";
        var attrReg = /scrollTop|scrollLeft/;
        if (attrReg.test(attrKey)) {
            return (elem[attrKey] = attrValue);
        }
        return (elem.style[attrKey] = attrValue + suffix);
    }

    function nowtime() {
        if (typeof window.performance !== "undefined" && performance.now) {
            return performance.now();
        }
        return +new Date();
    }

    function objToArr(options) {
        var optionArr = [];
        if (!options || options.toString().slice(8, -1) !== "Object") {
            return optionArr;
        }
        for (var i in options) {
            if (options.hasOwnProperty(i)) {
                optionArr.push({
                    attrKey: i,
                    attrValue: options[i]
                });
            }
        }
        return optionArr;
    }

    function animateFun(elem, attrKey, attrValue, duration, easing) {
        //定义动画初始值
        var startValue = parseInt(getAttr(elem, attrKey));
        //定义动画变化值
        var changeValue = attrValue - startValue;
        if (changeValue === 0) {
            return;
        }

        //定义动画开始时间
        var startTime = nowtime();
        //定义定时器id
        var timerId = null;

        var easingIsFun = typeof easing === "function";

        //动画函数
        function tick(timestamp) {
            //从动画开始到现在，过了多少时间
            var timeChanged = Math.min(duration, nowtime() - startTime);
            var newValue = 0;
            if (easingIsFun) {
                newValue = easing(
                    timeChanged,
                    startValue,
                    changeValue,
                    duration
                );
            } else {
                newValue = changeValue * (timeChanged / duration) + startValue;
            }

            setAttr(elem, attrKey, newValue);

            if (timeChanged === duration) {
                stopAnim();
            } else {
                startAnim();
            }
        }
        function startAnim() {
            timerId = window.requestAnimationFrame(tick, 15); //感觉chrome中 15 比 16 更顺滑
        }
        function stopAnim() {
            window.cancelAnimationFrame(timerId);
        }

        startAnim();
    }

    function simpleAnimate(elem, options, duration, easing) {
        var optionArr = objToArr(options),
            i = 0,
            len = optionArr.length;
        if (len === 0) {
            return;
        }

        for (; i < len; i++) {
            animateFun(
                elem,
                optionArr[i].attrKey,
                optionArr[i].attrValue,
                duration,
                easing
            );
        }
    }

    window.simpleAnimate = simpleAnimate;
})();
