$(function(){
  window.clipCount = 0;
  window.clipPlayCount = 0;
  window.clipRecord = [];
  window.clipRecords = [];
  window.clipTapTime = [
    [],
    [],
    []
  ];
  window.lastClipTapTime = "";
  window.clipPlayEndFlag = "first";
  window.clipInterval = [];
  
  $("#clip-record button").bind('touchstart'
    , function () {
      if (window.clipCount < 3) {
        clipRecord.push(window.video.currentTime);
        $(this).html("now recording...");
      }
      else {
        return false;
      }
    }
  ).bind('touchend'
    , function () {
      if (window.clipCount < 3) {
        clipRecord.push(window.video.currentTime);

        clipRecords[clipCount] = clipRecord;
        clipRecord = [];

        captureImage(window.clipCount);
          
        $(this).html("record");

        window.clipCount = window.clipCount + 1;

        if (window.clipCount > 0) {
            btnView(window.clipCount);
        }
      }

      else {
          return false;
      }
    }
  );

  var btnView = function (index) {
    $("#clip-play button").eq(index - 1).html('play!');
  }
});

var clipPlay = function (t) {
  var index = $("#clip-play button").index(t);
  
  clearInterval(window.clipInterval);
  
  window.clipPlayCount = window.clipPlayCount + 1;
  
  
  if (clipPlayEndFlag == "first") {
    clipTapTime[index].push(window.video.currentTime);
  }
  
  else if (clipPlayEndFlag === "false") {
    clipTapTime[index].push(window.lastClipTapTime);
  }
  
  else if (clipPlayEndFlag === "true") {
    clipTapTime[index].push(window.video.currentTime);
  }
  
  window.clipPlayEndFlag = "false";
  window.video.currentTime = clipRecords[index][0];
  
  window.lastClipTapTime = clipTapTime[index][clipTapTime[index].length - 1];
  
  window.clipInterval = setInterval(
    function () {
      if (window.video.currentTime > clipRecords[index][1]) {
        window.clipPlayEndFlag = "true";
        window.video.currentTime = lastClipTapTime;
        clearInterval(window.clipInterval);
      }
    }, 1
  );
};

var captureImage = function (index) {
  var video  = document.getElementById('video')
    , output = $('.capture-output div')
    , canvas = capture(video)
    ;
  
  output.eq(index).html(canvas);
  
  function capture(video) {
    var w = video.videoWidth * 0.2
    , h = video.videoHeight * 0.2
    , canvas = document.createElement('canvas')
    ;
    
    canvas.width  = w;
    canvas.height = h;

    var ctx = canvas.getContext('2d');
    
    ctx.drawImage(video, 0, 0, w, h);
    
    return canvas;
  }

  $('.capture-output').eq(index).children('.capture-time')
    .html(
      clipRecords[index][0].toFixed(1)
      + ' 〜 '
      + clipRecords[index][1].toFixed(1)
    );
};

var clipDelete = function (t) {
  var division = $("#clip-play .box")
    , index = $("#clip-play a").index(t)
    , output = $('.capture-output div')
    ;

  output.eq(index).html('');
  $('.capture-output').eq(index).children('.capture-time').html('');
  $("#clip-play button").eq(index).html('no clip');
  $("#clip-play").append(division.eq(index).clone());

  division.eq(index).remove();

  clipRecords.splice(index, 1);

  window.clipCount = window.clipCount - 1;
};
