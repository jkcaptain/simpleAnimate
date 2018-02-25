# simpleAnimate
jquery animate动画的简单实现

主要是提供动画实现的思路，动画时各种边界情况暂时未处理。动画队列暂时没有精力去研究。

用法：

可参照 simpleAnimate.html，和jQuery animate的用法类似。

    window.simpleAnimate(element, {
        top: 600,
        width: 200,
        height: 200
    }, time, easingFun);
    
参考资料

https://github.com/zhangxinxu/Tween/blob/master/tween.js

http://www.cnblogs.com/aaronjs/p/4278660.html
 
 https://github.com/akira-cn/animator.js/blob/master/lib/animator.js
