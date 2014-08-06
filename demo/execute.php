<?php

$movie = (object) $_FILES['movie'];
$movie_path = "/vagrant/videocutup/demo/movies/" . $movie->name;

move_uploaded_file($movie->tmp_name, $movie_path);

$sha1 = sha1(date( "Y/m/d (D) H:i:s", time() ) . rand());
$path = "/vagrant/videocutup/demo/images/" . $sha1;
$infomation = "/home/vagrant/bin/ffmpeg -i /vagrant/videocutup/demo/movies/" . $movie->name . " -ss 1 -vframes 10 -f image2 " . $path . "_frame%d.jpg";

$sounds_path = (object) $_FILES['movie'];
$sound = "/home/vagrant/bin/ffmpeg -y -i /vagrant/videocutup/demo/movies/" . $movie->name . " -ss 0 -t 10 /vagrant/videocutup/demo/sounds/" . $sha1 . "_" . str_replace('.mp4', '', $movie->name) . ".mp3 2>&1";
print_r($sound);

exec($infomation, $out, $ret);

// print('<pre>');
// print_r($out);
// print_r($ret);
// print('</pre>');

exec($sound, $out, $ret);

$redirectPath = "/demo/index.php";
header("Location: $redirectPath");


///*
// ** ffmpeg コマンド実行
// */
//$command = "ffmpeg 2>&1";
//var_dump(exec($command, $out, $ret));
//
//print('<pre>');
//print_r($out);
//print_r($ret);
//print('</pre>');
//
//
//
//
///*
// ** 音声抜き出し
// */
//var_dump(exec('ffmpeg -y -i movies/sample.mp4 -ss 0 -t 10 sounds/sample.mp3 2>&1', $out, $ret));
//
//print('<pre>');
//print_r($out);
//print_r($ret);
//print('</pre>');
//
//
///*
// ** 画像抜き出し
// */
//var_dump(exec('ffmpeg -i movies/sample.mp4 -f image2 images/%d.jpg 2>&1', $out, $ret));
//
//print('<pre>');
//print_r($out);
//print_r($ret);
//print('</pre>');
