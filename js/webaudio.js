if (! window.AudioContext) {
    if (! window.webkitAudioContext) {
        alert('no audiocontext found');
    }
    window.AudioContext = window.webkitAudioContext;
}

var context = new AudioContext();
var context2 = new AudioContext();
var context3 = new AudioContext();
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
           bufferRe = buffer;
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
    sourceNode2.noteOn(0);
    animationStart();
}

function stop() {
    sourceNode.noteOff(0);
    sourceNode2.noteOff(0);
    $("#play").remove();
    $("#stop").remove();
    init1();
    init2();
    animationStop();
}

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

/* urlクエリ取得*/
var getQueryVariable = function (variable) {
    if (1 < document.location.search.length) {
        var query = document.location.search.substring(1);
        var parameters = query.split('&');
        var result = new Object();
        for (var i = 0; i < parameters.length; i++) {
            var element = parameters[i].split('=');

             var paramName = decodeURIComponent(element[0]);
            var paramValue = decodeURIComponent(element[1]);
            result[paramName] = decodeURIComponent(paramValue);
        }
    return result;
  }
  return {};
}

/* アニメーション */
var animation = document.getElementById("animation");
var c = animation.getContext("2d");
var images = new Array();
var animations = {}
animations.fps = 24;//フレームレート
animations.frame = 0;
animations.onceFlg = true;
var query = getQueryVariable();

if (query.path !== undefined) {
    for (var i = 1; i <= 144; i++) { //iの最大数はサーバからクエリとかでもらう? ffmpegで処理する秒数と連動する。現状6秒
        images[i] = new Image();
        images[i].src = "/convert/images/" + query.path + "_frame" + i + ".jpg";
    }

    images['144'].onload = function() { //image['foo']はiの最大値と同一
        c.drawImage(images['1'], 0, 0);
    }
}

function animationStart () {
    clearInterval(animation);
    var interval = 1/animations.fps*1000;
    animation = setInterval(intervalEvent, interval);
    animations.frame = Math.floor(Math.random() * 521);
    sourceNode2.noteOff(0);
    if(typeof src !== 'undefined') {
        src.stop(0);
    };
    src = context3.createBufferSource();
    src.buffer = bufferRe;
    src.connect(context3.destination);
    src.start(0, (animations.frame)/15);
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
