jQuery(function(){
	window.clipCount = 0;

  var clipRecord = [];
  var clipRecords = [];
  
  jQuery("#clip-record button").mousedown(
    function(){
      clipRecord.push(window.video.currentTime);
      $(this).html("now recording...");
    }
  ).mouseup(
    function(){
      clipRecord.push(window.video.currentTime);

      clipRecords[clipCount] = clipRecord;
      clipRecord = [];
      console.log(clipRecords);
      console.log(clipRecords[0][0]);
      console.log($("#clip-play button"));
      $(this).html("record");

      jQuery.each(clipRecords, function(i) {
        $("#clip-play button").eq(i).click(function () {
          window.video.currentTime = clipRecords[i][0];
        });
      });

      window.clipCount = window.clipCount + 1;

      if (window.clipCount > 0) {
        btnView(window.clipCount);
      }

      if (window.clipCount == 3) {
      	window.clipCount = 0;
      }
    }
  );

  var btnView = function (index) {
    $("#clip-play button").eq(index - 1).html('clip');
  }
});


//window.onload = function() {
//	window.records = [];
//	window.recordsArray = [];
//	window.video = document.getElementById("video");
//	window.clipCount = 0;
//}
//
//var clipStart = function() {
//	window.records[0] = window.video.currentTime;
//}
//
//var clipStop = function() {
//	window.records[1] = window.video.currentTime;
//  console.log(window.records)
//	window.recordsArray[clipCount] = [window.records[0], window.records[1]]
//
//	window.clipCount = window.clipCount + 1;
//	if (window.clipCount == 3) {
//		window.clipCount = 0;
//	}
//}
//
//var clipPlay0 = function() {
//	window.video.currentTime = window.recordsArray[0][0];
//	window.clipInterval = setInterval("clip(" + window.recordsArray[0] +")", 10)
//}
//
//var clipPlay1 = function() {
//	window.video.currentTime = window.recordsArray[1][0];
//	window.clipInterval = setInterval("clip(" + window.recordsArray[1] +")", 10)
//}
//
//var clipPlay2 = function() {
//	window.video.currentTime = window.recordsArray[2][0];
//	window.clipInterval = setInterval("clip(" + window.recordsArray[2] +")", 10)
//}
//
//var clip = function (array) {
//    var clipTime = window.video.currentTime
//	if (clipTime > array[1]) {
//    	window.video.currentTime = array[1];
//		clearInterval(window.clipInterval);
//	}
//}
