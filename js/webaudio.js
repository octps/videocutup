var context = new webkitAudioContext();
var audioBuffer;
var sourceNode;

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
    sourceNode = context.createBufferSource();
    sourceNode.connect(context.destination);
}

function loadSound(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
        context.decodeAudioData(request.response, function(buffer) {
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
    $("body").append("<input id='stop' type='button' onclick='stop()' value='stop'>");
}

function stop() {
    sourceNode.noteOff(0);
    $("#play").remove();
    $("#stop").remove();
    init();
}

function onError(e) {
    console.log(e);
}