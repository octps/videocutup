// var animation = document.getElementById("animation");
// var c = animation.getContext("2d");
// var images = new Array();
// var fps = 24;//フレームレート
// var frame = 0;
// var onceFlg = true;

// animation = {};
// animation.count = 0;

// for (var i = 1; i <= 520; i++) { //iの最大数はサーバからクエリとかでもらう?
//     images[i] = new Image();
//     images[i].src = "/images/" + i + ".jpg";
// }

// images['520'].onload = function() {
//     c.drawImage(images['1'], 0, 0);
//     var interval = 1/fps*1000;
//     animation = setInterval(intervalEvent, interval);
// }

// function intervalEvent(){
//     frame++;
//     c.drawImage(images[frame], 0, 0);

//     if (frame>=520) {
//         if (onceFlg) clearInterval( animation );
//         frame = 0;
//     };
// }
