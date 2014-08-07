<?php

$movie = (object) $_FILES['movie'];
$movie_path = "/vagrant/videocutup/convert/movies/" . $movie->name;

move_uploaded_file($movie->tmp_name, $movie_path);

$sha1 = sha1(date( "Y/m/d (D) H:i:s", time() ) . rand());
$path = "/vagrant/videocutup/convert/images/" . $sha1;
$infomation = "/home/vagrant/bin/ffmpeg -i /vagrant/videocutup/convert/movies/" . $movie->name . " -ss 1 -vframes 144 -f image2 " . $path . "_frame%d.jpg";

$sounds_path = (object) $_FILES['movie'];
$sound = "/home/vagrant/bin/ffmpeg -y -i /vagrant/videocutup/convert/movies/" . $movie->name . " -ss 0 -t 6 /vagrant/videocutup/convert/sounds/" . $sha1 . "_" . str_replace('.mp4', '', $movie->name) . ".mp3 2>&1";
print_r($sound);

exec($infomation, $out, $ret);

exec($sound, $out, $ret);

$baseSoundInfomation = "/home/vagrant/bin/ffmpeg -i /vagrant/videocutup/sounds/sample.mp3 2>&1 ";
exec($baseSoundInfomation, $soundinfo, $ret);
$durations = array_merge(preg_grep('/Duration: ([^,]+)/',$soundinfo));
$duration = str_replace('.', 's', substr($durations[0], 18, 5));

$redirectPath = "/index.html?path=" . $sha1 . "&duration=" . $duration;
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
