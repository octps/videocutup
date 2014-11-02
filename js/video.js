var video = document.getElementById("video");
var p_btn = document.getElementById("playbtn");
var s_btn = document.getElementById("stopbtn");
var speedup_btn = document.getElementById("speedupbtn");
var speeddown_btn = document.getElementById("speeddownbtn");
var restart_btn = document.getElementById("restartbtn");

//再生させるための処理
p_btn.addEventListener("click",function(){
    video.playbackRate = 1;
    video.play();
    setPosition();
},false);

//再生を一時停止させるための処理
s_btn.addEventListener("click",function(){
    video.pause();
},false);

//再生速度を早くする処理
speedup_btn.addEventListener("click",function(){
    video.playbackRate += 1;
},false);

//再生速度を遅くする処理
speeddown_btn.addEventListener("click",function(){
    video.playbackRate -= 0.15;
},false);

restart_btn.addEventListener("click",function(){
    video.playbackRate = 1;
    video.currentTime = 0;
},false);

//再生し終わったら発生するイベント
video.addEventListener("ended",function(){
    document.getElementById("ichi").innerHTML ="再生完了しまいた";
},false);

//リアルタイムに発生するイベント
video.addEventListener("timeupdate",function(){
    document.getElementById("ichi").innerHTML = video.currentTime;
}, false);


/* 枠内で、mouseの位置をトレースするpointerの制御*/
window.setPosition = function() {
    window.container.onmousemove = function(e){
        window.mouse = Object();
        window.mouse.x = false;
        window.mouse.y = false;
        if (e.clientX > window.container.offsetLeft
            && e.clientX < window.container.offsetWidth + window.container.offsetLeft
            && e.clientY > window.container.offsetTop
            && e.clientY < window.container.offsetHeight + window.container.offsetTop
        ) {
            window.mouse.x = e.clientX - window.container.offsetLeft;
            window.mouse.y = e.clientY - window.container.offsetTop;
        }
        window.pointer.style.left = window.mouse.x + 'px';
        window.pointer.style.top = window.mouse.y + 'px';
    }
}

window.trace = function() {
    var distanceX = parseFloat(window.pointer.style.left)
        - parseFloat(window.tracer.style.left);
    var distanceY = parseFloat(window.pointer.style.top)
        - parseFloat(window.tracer.style.top);

    window.tracer.style.left = parseFloat(window.tracer.style.left)
        + (distanceX / 40) + 'px';
    window.tracer.style.top = parseFloat(window.tracer.style.top)
        + (distanceY / 40) + 'px';
    window.speeder = distanceX / 100;
    if (window.speeder < -0.999) {
        window.speeder = -0.999;
    }
    video.playbackRate = window.speeder;
}

container.addEventListener("mousedown", function() {
    window.traceInterval = setInterval("window.trace()", 1);
});

container.addEventListener("mouseup", function() {
    clearInterval(window.traceInterval);
    video.playbackRate = 1;
});

window.addEventListener( "load", function() {
    window.mouse = Object();
    window.mouse.x = false;
    window.mouse.y = false;
    // window.setPosition();
    window.pointer = document.getElementById("pointer");
    window.tracer = document.getElementById("tracer");
    window.tracer.style.left = '0px';
    window.tracer.style.top = '0px';
    window.pointer.style.left = '0px';
    window.pointer.style.top = '0px';
    window.container = document.getElementById("container");
    window.video = document.getElementById("video");
    video.playbackRate = 1;
    window.container.style.left = window.video.offsetLeft + 'px';
    window.container.style.top = window.video.offsetTop + 'px';
    window.speeder = 100;
});

