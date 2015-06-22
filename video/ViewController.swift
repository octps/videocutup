//
//  ViewController.swift
//  video
//
//  Created by n001 on 2015/06/19.
//  Copyright © 2015年 n001. All rights reserved.
//

import UIKit
import AVFoundation
import CoreMedia
import ImageIO
import MobileCoreServices

class ViewController: UIViewController,UINavigationControllerDelegate,UIImagePickerControllerDelegate {

    var playerItem : AVPlayerItem!
    var videoPlayer : AVPlayer!
    @IBOutlet weak var webView: UIWebView!

    override func viewDidLoad() {
        super.viewDidLoad()
        loadAddressURL()
    }

    
    @IBAction func selectMovie(sender: AnyObject) {
        if !UIImagePickerController.isSourceTypeAvailable(UIImagePickerControllerSourceType.PhotoLibrary) {
            UIAlertView(title: "警告", message: "Photoライブラリにアクセス出来ません", delegate: nil, cancelButtonTitle: "OK").show()
        } else {
            let imagePickerController = UIImagePickerController()
            imagePickerController.sourceType = UIImagePickerControllerSourceType.PhotoLibrary
            imagePickerController.mediaTypes = NSArray(object: kUTTypeMovie) as! [String]
            imagePickerController.allowsEditing = false
            imagePickerController.delegate = self
            self.presentViewController(imagePickerController,animated:true ,completion:nil)
        }
        //todo momentを選択すると落ちる
        
    }

    // カメラロールから選択後、選択した動画のurlを動画表示メソッドに渡す
    func imagePickerController(picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : AnyObject]) {
        let url = info[UIImagePickerControllerMediaURL] as! NSURL!
//        var pickedURL:NSURL = info[UIImagePickerControllerReferenceURL] as! NSURL
        self.dismissViewControllerAnimated(true, completion: nil)
        let JSScript =  "callFromSwift('" + url.absoluteString + "')"
        print(JSScript)
        webView.stringByEvaluatingJavaScriptFromString(JSScript);
    }

    func loadAddressURL() {
        let targetURL = NSBundle.mainBundle().pathForResource("htdocs/index", ofType: "html");

        let requestURL = NSURL(string: targetURL!)
        let req = NSURLRequest(URL: requestURL!)
        self.webView.allowsInlineMediaPlayback = true;
        webView.loadRequest(req)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }


}

