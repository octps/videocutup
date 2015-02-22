//
//  ViewController.swift
//  videocutup
//
//  Created by kitajima on 2015/02/21.
//  Copyright (c) 2015年 kitajima. All rights reserved.
//

import UIKit
import AVFoundation
import CoreMedia

class ViewController: UIViewController {
    var playerItem : AVPlayerItem!
    var videoPlayer : AVPlayer!

    override func viewDidLoad() {
//        let path = NSBundle.mainBundle().pathForResource("test", ofType: "mp4")
//        let fileURL = NSURL(fileURLWithPath: path!)
//        let avAsset = AVURLAsset(URL: fileURL, options: nil)
//
//        playerItem = AVPlayerItem(asset: avAsset)
//        videoPlayer = AVPlayer(playerItem: playerItem)
//        let videoPlayerView = AVPlayerView(frame: self.view.bounds)
//        
//        let layer = videoPlayerView.layer as AVPlayerLayer
//        layer.videoGravity = AVLayerVideoGravityResizeAspect
//        layer.player = videoPlayer
//        
//        self.view.layer.addSublayer(layer)

        super.viewDidLoad()
        loadAddressURL()
    }
    
    @IBOutlet weak var webView: UIWebView!
    

    var targetURL = NSBundle.mainBundle().pathForResource("index", ofType: "html");

    func loadAddressURL() {
        let requestURL = NSURL(string: targetURL!)
        let req = NSURLRequest(URL: requestURL!)
        webView.loadRequest(req)
    }
    
    @IBAction func playMovie(sender: UIButton) {
        videoPlayer.seekToTime(CMTimeMakeWithSeconds(0, Int32(NSEC_PER_SEC)))
        videoPlayer.play()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }


}


// レイヤーをAVPlayerLayerにする為のラッパークラス.
class AVPlayerView : UIView{
    
    required init(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    
    override init(frame: CGRect) {
        super.init(frame: frame)
    }
    
    override class func layerClass() -> AnyClass{
        return AVPlayerLayer.self
    }
    
}
