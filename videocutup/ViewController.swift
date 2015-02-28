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
import ImageIO
import MobileCoreServices


class ViewController: UIViewController,UIImagePickerControllerDelegate,UINavigationControllerDelegate  {
    
    @IBOutlet weak var photoSelectButton: UIButton!
    var playerItem : AVPlayerItem!
    var videoPlayer : AVPlayer!

    override func viewDidLoad() {
        super.viewDidLoad()
        loadAddressURL()
    }


    // カメラロールにアクセスする、動画のみを表示
    @IBAction func photoSelectButtonTouchDown(sender: AnyObject) {
        if !UIImagePickerController.isSourceTypeAvailable(UIImagePickerControllerSourceType.PhotoLibrary) {
            UIAlertView(title: "警告", message: "Photoライブラリにアクセス出来ません", delegate: nil, cancelButtonTitle: "OK").show()
        } else {
            var imagePickerController = UIImagePickerController()
            imagePickerController.sourceType = UIImagePickerControllerSourceType.PhotoLibrary
            imagePickerController.mediaTypes = NSArray(object: kUTTypeMovie)
            imagePickerController.allowsEditing = false
            imagePickerController.delegate = self
            self.presentViewController(imagePickerController,animated:true ,completion:nil)
        }
    }
    
    // カメラロールから選択後、選択した動画のurlを動画表示メソッドに渡す
    func imagePickerController(picker: UIImagePickerController!, didFinishPickingMediaWithInfo info: NSDictionary!) {
        var url = info[UIImagePickerControllerMediaURL] as NSURL!
        var pickedURL:NSURL = info[UIImagePickerControllerReferenceURL] as NSURL
        self.dismissViewControllerAnimated(true, completion: nil)
        var JSScript =  "callFromSwift('" + url.absoluteString! + "')"
        var htmlTitle = webView.stringByEvaluatingJavaScriptFromString(JSScript);
    }

    @IBOutlet weak var webView: UIWebView!
    
    var targetURL = NSBundle.mainBundle().pathForResource("index", ofType: "html");

    func loadAddressURL() {
        let requestURL = NSURL(string: targetURL!)
        let req = NSURLRequest(URL: requestURL!)
        self.webView.allowsInlineMediaPlayback = true;
        webView.loadRequest(req)
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

}
//
//
//// レイヤーをAVPlayerLayerにする為のラッパークラス.
//class AVPlayerView : UIView{
//    
//    required init(coder aDecoder: NSCoder) {
//        super.init(coder: aDecoder)
//    }
//    
//    override init(frame: CGRect) {
//        super.init(frame: frame)
//    }
//    
//    override class func layerClass() -> AnyClass{
//        return AVPlayerLayer.self
//    }
//    
//}
