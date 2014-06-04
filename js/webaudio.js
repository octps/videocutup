if (! window.AudioContext) {
    if (! window.webkitAudioContext) {
        alert('no audiocontext found');
    }
    window.AudioContext = window.webkitAudioContext;
}

var context = new AudioContext();
var audioBuffer;
var sourceNode;

// setup a analyzer
var splitter;
var analyser, analyser2;
var javascriptNode;

// get the context from the canvas to draw on
var ctx = $("#canvas").get()[0].getContext("2d");

// create a gradient for the fill. Note the strange
// offset, since the gradient is calculated based on
// the canvas, not the specific element we draw
var gradient = ctx.createLinearGradient(0,0,0,130);
gradient.addColorStop(1,'#000000');
gradient.addColorStop(0.75,'#ff0000');
gradient.addColorStop(0.25,'#ffff00');
gradient.addColorStop(0,'#ffffff');

// load the sound
setupAudioNodes();
loadSound("/sounds/sample.mp3");

function init() {
    var context = new webkitAudioContext();
    var audioBuffer;
    var sourceNode;

    setupAudioNodes();
    loadSound("/sounds/sample.mp3");
}

function setupAudioNodes() {
    javascriptNode = context.createScriptProcessor(2048, 1, 1);
    javascriptNode.connect(context.destination);

    analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = 1024;

    // analyser2 = context.createAnalyser();
    // analyser2.smoothingTimeConstant = 0.0;
    // analyser2.fftSize = 1024;

    sourceNode = context.createBufferSource();
    splitter = context.createChannelSplitter();

    sourceNode.connect(splitter);

    splitter.connect(analyser,0,0);
    // splitter.connect(analyser2,1,0);

    analyser.connect(javascriptNode);

    sourceNode.connect(context.destination);
}

// load the specified sound
function loadSound(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // When loaded decode the data
    request.onload = function() {

        // decode the data
        context.decodeAudioData(request.response, function(buffer) {
            // when the audio is decoded play the sound
            $("body").append("<input id='play' type='button' onclick='playSound()' value='play'>");
           setSound(buffer);
        }, onError);
    }
    request.send();
}

function setSound(buffer) {
    sourceNode.buffer = buffer;
}

function playSound() {
    sourceNode.noteOn(0);
    $("#play").remove();
    $("body").append("<input id='stop' type='button' onclick='stop()' value='stop'>");
    animationStart();
}

function stop() {
    sourceNode.noteOff(0);
    $("#play").remove();
    $("#stop").remove();
    init();
    animationStop();
}

// log if an error occurs
function onError(e) {
    console.log(e);
}

// when the javascript node is called
// we use information from the analyzer node
// to draw the volume
javascriptNode.onaudioprocess = function() {

    // get the average for the first channel
    var array =  new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    var average = getAverageVolume(array);

    // get the average for the second channel
    // var array2 =  new Uint8Array(analyser2.frequencyBinCount);
    // analyser2.getByteFrequencyData(array2);
    // var average2 = getAverageVolume(array2);

    // clear the current state
    ctx.clearRect(0, 0, 60, 130);

    // set the fill style
    ctx.fillStyle=gradient;

    // create the meters
    ctx.fillRect(0,130-average,25,130);
    // ctx.fillRect(30,130-average2,25,130);
}

function getAverageVolume(array) {
    var values = 0;
    var average;

    var length = array.length;

    // get all the frequency amplitudes
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
var fps = 24;//フレームレート
var frame = 0;
var onceFlg = true;

for (var i = 1; i <= 520; i++) { //iの最大数はサーバからクエリとかでもらう?
    images[i] = new Image();
    images[i].src = "/images/" + i + ".jpg";
}

images['520'].onload = function() {
    c.drawImage(images['1'], 0, 0);
}

function animationStart () {
    var interval = 1/fps*1000;
    animation = setInterval(intervalEvent, interval);
}

function animationStop () {
    clearInterval( animation );
}

function intervalEvent(){
    frame++;
    c.drawImage(images[frame], 0, 0);

    if (frame>=520) {
        if (onceFlg) clearInterval( animation );
        frame = 0;
    };
}
