/*
 ** 動画の長さ取得
 */
$(window).load(function () {
  window.duration = window.video.duration;
});


/*
 ** 初期設定
 */
$(function(){
  window.duration = 0;
  window.sequence = 0;
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
  window.playFlag = 0;
  window.playRepeatFlag = 0;

  setInterval(
    function () {
      window.sequence = window.sequence + 0.01; 

      if (window.sequence > window.duration) {
        window.sequence = 0;
      }
    }
  , 10);
});


/*
 ** クリップ登録
 */
$(function(){
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


/*
 ** クリップ登録時のイメージ取得
 */
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


/*
 ** クリップの再生
 */
var clipPlay = function (t) {
  var index = $("#clip-play button").index(t);
  
  clearInterval(window.clipInterval);
  
  window.clipPlayCount = window.clipPlayCount + 1;
  
  if (clipPlayEndFlag == "first") {
    clipTapTime[index].push(Math.round(window.sequence * 100) / 100);
  }
  
  else if (clipPlayEndFlag === "false") {
    return false;
    //clipTapTime[index].push(window.lastClipTapTime);
  }
  
  else if (clipPlayEndFlag === "true") {
    clipTapTime[index].push(Math.round(window.sequence * 100) / 100);
  }
  
  window.clipPlayEndFlag = "false";
  window.video.currentTime = clipRecords[index][0];
  
  window.lastClipTapTime = clipTapTime[index][clipTapTime[index].length - 1];

  window.duration = window.duration + (clipRecords[index][1] - clipRecords[index][0]);

  console.log(clipRecords);
  console.log(clipTapTime);

  window.playFlag = 1;
  
  clipPlayToEnd(index);
};

var clipPlayToEnd = function (num) {
  window.clipInterval = setInterval(
    function () {
      if (window.video.currentTime > clipRecords[num][1]) {
        window.clipPlayEndFlag = "true";
        window.video.currentTime = lastClipTapTime;
        window.playFlag = 0;
        clearInterval(window.clipInterval);
      }
    }, 1
  );
}


/*
 ** クリップの削除
 */
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


/*
 ** 登録クリップの再生
 */
$(function(){
  setInterval(
    function () {
      if (window.playFlag == 0 && $.inArray(Math.round(window.sequence * 100) / 100, clipTapTime[0]) !== -1) {
        var cnum = $.inArray(Math.round(window.sequence * 100) / 100, clipTapTime[0]);

        window.video.currentTime = clipRecords[0][cnum];
        window.playRepeatFlag = 1;
        PlayToEnd(0, cnum);
      }

      if (window.playFlag == 0 && $.inArray(Math.round(window.sequence * 100) / 100, clipTapTime[1]) !== -1) {
        var cnum = $.inArray(Math.round(window.sequence * 100) / 100, clipTapTime[1]);

        window.video.currentTime = clipRecords[1][cnum];
        window.playRepeatFlag = 1;
        PlayToEnd(1, cnum);
      }

      if (window.playFlag == 0 && $.inArray(Math.round(window.sequence * 100) / 100, clipTapTime[2]) !== -1) {
        var cnum = $.inArray(Math.round(window.sequence * 100) / 100, clipTapTime[2]);

        window.video.currentTime = clipRecords[2][cnum];
        window.playRepeatFlag = 1;
        PlayToEnd(2, cnum);
      }
    }
  , 1);
});


var PlayToEnd = function (num, cnum) {
  window.clipInterval = setInterval(
    function () {
      if (window.playRepeatFlag == 1 && window.video.currentTime > clipRecords[num][1]) {
        window.clipPlayEndFlag = "true";
        window.video.currentTime = clipTapTime[num][cnum];
        window.playRepeatFlag = 0;
        clearInterval(window.clipInterval);
      }
    }, 1
  );
}
