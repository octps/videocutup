var animation = document.getElementById("animation");
var c = animation.getContext("2d");
var images = new Array();
var animations = {}
animations.fps = 24;//フレームレート
animations.frame = 0;

for (var i = 1; i <= 144; i++) {
    images[i] = new Image();
    images[i].src = "/images/6eb6e0af7cc71f29ccf10f631a59677c6f41a481_frame" + i + ".jpg";
}

images['144'].onload = function() { 
    c.drawImage(images['1'], 0, 0);
}

function play() {
    animationStart();
    window.soundSrc = audioctx.createBufferSource();
    soundSrc.buffer = buffer;
    soundSrc.connect(audioctx.destination);
    soundSrc.loop = true;
    soundSrc.start(0);
}

function animationStart() {
    var interval = 1/animations.fps * 1000;
    animation = setInterval(intervalEvent, interval);
}

function intervalEvent() {
    // console.log(window.speeder/100);
    animations.frame = animations.frame + (~~(window.speeder/10));
    if (animations.frame>=144) {
        animations.frame = 1;
    };
    if (animations.frame <= 0) {
        animations.frame = 144;
    };
    c.drawImage(images[animations.frame], 0, 0);
    soundSrc.playbackRate.value = window.speeder/100;
}


/*音*/
if (typeof(webkitAudioContext) !== "undefined") {
    var audioctx = new webkitAudioContext();
} else if (typeof(AudioContext) !== "undefined") {
    var audioctx = new AudioContext();
}

var soundPath = "/sounds/6eb6e0af7cc71f29ccf10f631a59677c6f41a481_sample.mp3"

var buffer = null;
LoadSample(audioctx, soundPath);

function LoadSample(ctx, url) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "arraybuffer";
    req.onload = function() {
        if(req.response) {
            ctx.decodeAudioData(req.response,function(b){buffer=b;},function(){});
        }
        else
            buffer = ctx.createBuffer(VBArray(req.responseBody).toArray(), false);
    }
    req.send();
}


/* 枠内で、mouseの位置をトレースするpointerの制御*/
window.setPosition = function() {
    window.document.onmousemove = function(e){
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
    var distanceX = parseInt(window.pointer.style.left)
        - parseInt(window.tracer.style.left);
    var distanceY = parseInt(window.pointer.style.top)
        - parseInt(window.tracer.style.top);
    window.tracer.style.left = parseInt(window.tracer.style.left)
        + (distanceX / 20) + 'px';
    window.tracer.style.top = parseInt(window.tracer.style.top)
        + (distanceY / 20) + 'px';
    window.speeder = distanceX;
}

window.speed = function() {
    var speeds = window.speeder;
}

window.addEventListener( "load", function() {
    window.mouse = Object();
    window.mouse.x = false;
    window.mouse.y = false;
    window.traceInterval = setInterval("window.trace()", 10);
    window.speedInterval = setInterval("window.speed()", 10);
    window.setPosition();
    window.pointer = document.getElementById("pointer");
    window.tracer = document.getElementById("tracer");
    window.tracer.style.left = '0px';
    window.tracer.style.top = '0px';
    window.container = document.getElementById("container");
    window.animation = document.getElementById("animation");
    window.container.style.left = window.animation.offsetLeft + 'px';
    window.container.style.top = window.animation.offsetTop + 'px';
});


/*
setPosition() で、四角内でマウスの位置を取得するpointerを制御
trace()で pointerを追いかけるtracerの制御

speedを取得する。
最大値と最小値を設定し、その範疇で挙動を変更する

*/

