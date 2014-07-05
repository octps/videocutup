if (! window.AudioContext) {
    if (! window.webkitAudioContext) {
        alert('no audiocontext found');
    }
    window.AudioContext = window.webkitAudioContext;
}

var context = new AudioContext();
var context2 = new AudioContext();
var audioBuffer;
var audioBuffer2;
var sourceNode;
var sourceNode2;

// setup a analyzer
var splitter;
var analyser;
var javascriptNode;


// load the sound
setupAudioNodes1();
setupAudioNodes2();
loadSound("/sounds/sample.mp3");
loadSound2("/sounds/sample2.mp3");

function init1() {
    var context = new webkitAudioContext();
    var audioBuffer;
    var sourceNode;

    setupAudioNodes1();
    loadSound("/sounds/sample.mp3");
}

function init2() {
    var context2 = new webkitAudioContext();
    var audioBuffer2;
    var sourceNode2;

    setupAudioNodes2();
    loadSound2("/sounds/sample2.mp3");
}

function setupAudioNodes1() {
    javascriptNode = context.createScriptProcessor(2048, 1, 1);
    javascriptNode.connect(context.destination);

    analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = 1024;

    sourceNode = context.createBufferSource();
    splitter = context.createChannelSplitter();

    sourceNode.connect(splitter);

    splitter.connect(analyser,0,0);

    analyser.connect(javascriptNode);

    sourceNode.connect(context.destination);
}

function setupAudioNodes2() {
    sourceNode2 = context2.createBufferSource();
    sourceNode2.connect(context2.destination);
}

function loadSound(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
        context.decodeAudioData(request.response, function(buffer) {
            $("#playstop").append("<input id='play' type='button' onclick='playSound()' value='play'>");
           setSound(buffer);
        }, onError);
    }
    request.send();
}

function loadSound2(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function() {

        context2.decodeAudioData(request.response, function(buffer) {
            // $("#playstop2").append("<input id='play2' type='button' onclick='playSound2()' value='play2'>");
           setSound2(buffer);
        }, onError);
    }
    request.send();
}

function setSound(buffer) {
    sourceNode.buffer = buffer;
}

function setSound2(buffer) {
    sourceNode2.buffer = buffer;
}

function playSound() {
    sourceNode.noteOn(0);
    $("#play").remove();
    $("#playstop").append("<input id='stop' type='button' onclick='stop()' value='stop'>");
    sourceNode2.noteOn(0);//noteOn("sometime") sometimeを制御する
    animationStart();
}

// function playSound2() {
//     sourceNode2.noteOn(0);//noteOn("sometime") sometimeを制御する
//     $("#play2").remove();
//     $("#playstop2").append("<input id='stop2' type='button' onclick='stop2()' value='stop2'>");
// }

function stop() {
    sourceNode.noteOff(0);
    sourceNode2.noteOff(0);
    $("#play").remove();
    $("#stop").remove();
    init1();
    init2();
    animationStop();
}

// function stop2() {
//     sourceNode2.noteOff(0);
//     $("#play2").remove();
//     $("#stop2").remove();
//     init2();
//     animationStop();
// }

function onError(e) {
    console.log(e);
}

javascriptNode.onaudioprocess = function() {

    var array =  new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    var average = getAverageVolume(array);

    if (average > 85) {
        animationStart();
    }
}

function getAverageVolume(array) {
    var values = 0;
    var average;

    var length = array.length;

    for (var i = 0; i < length; i++) {
        values += array[i];
    }

    average = values / length;
    return average;
}



/* アニメーション */
var animation = document.getElementById("animation");
var c = animation.getContext("2d");
var images = new Array();
var animations = {}
animations.fps = 24;//フレームレート
animations.frame = 0;
animations.onceFlg = true;

for (var i = 1; i <= 520; i++) { //iの最大数はサーバからクエリとかでもらう?
    images[i] = new Image();
    images[i].src = "/images/" + i + ".jpg";
}

images['520'].onload = function() {
    c.drawImage(images['1'], 0, 0);
}

function animationStart () {
    clearInterval(animation);
    var interval = 1/animations.fps*1000;
    animation = setInterval(intervalEvent, interval);
    animations.frame = Math.floor(Math.random() * 521);
    // sourceNode2.noteOff(0);
    // sourceNode2 = context2.createBufferSource();
    // sourceNode2.connect(context2.destination);
    // sourceNode2.noteOn(0);//noteOn("sometime") sometimeを制御する。
}

function animationStop () {
    clearInterval( animation );
}

function intervalEvent(){
    animations.frame++;
    c.drawImage(images[animations.frame], 0, 0);

    if (animations.frame>=520) {
        if (animations.onceFlg) {
            clearInterval(animation);
        }
        animations.frame = 0;
    };
}
