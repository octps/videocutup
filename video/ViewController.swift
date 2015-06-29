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

import AssetsLibrary

class ViewController: UIViewController,UINavigationControllerDelegate,UIImagePickerControllerDelegate,AVCaptureFileOutputRecordingDelegate {

    /* カメラ使用のための定義 */
    let captureSession = AVCaptureSession()
    var previewLayer : AVCaptureVideoPreviewLayer?
    var captureDevice : AVCaptureDevice?
    let fileOutput = AVCaptureMovieFileOutput()
    var isRecording = false
    /* カメラ使用のための定義 */
    

    override func viewDidLoad() {
        super.viewDidLoad()
        startCamera()
        
        /* webviewの読み込み */
        loadAddressURL()
        /* webviewの読み込み */
    }
    
    
    @IBAction func doCamera(sender: AnyObject) {
//        startCamera()
            showCamera()
    }
    
    func showCamera(){
        previewLayer?.hidden = false
    }
    
    func startCamera() {
    /* */
        captureSession.sessionPreset = AVCaptureSessionPresetHigh
        let devices = AVCaptureDevice.devices()
        for device in devices {
            if (device.hasMediaType(AVMediaTypeVideo)) {
                // 背面カメラあるかどうか。ここを調整して全面カメラにしたりもできる
                if(device.position == AVCaptureDevicePosition.Back) {
                    captureDevice = device as? AVCaptureDevice
                    if captureDevice != nil {
                        beginCamera()
                    }
                }
            }
        }
    }
    
    //カメラ設定
    func configureDevice() {
        if let device = captureDevice {
            do {
                try device.lockForConfiguration()
            }
            catch {
                print(error)
            }
            device.focusMode = .Locked
            device.unlockForConfiguration()
        }
    }

    //カメラ開始！
    func beginCamera() {
        configureDevice()
        let err : NSError? = nil
        do {
            try captureSession.addInput(AVCaptureDeviceInput(device: captureDevice))
            captureSession.addOutput(fileOutput)
        } catch {
            print(err)
        }
        
        if err != nil {
            print("エラー: \(err?.localizedDescription)")
        }
        
        previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
        self.view.layer.addSublayer(previewLayer!)
        previewLayer?.frame = CGRectMake(10, 20, 300, 300)
        previewLayer?.hidden = true  // カメラの表示を隠す
        captureSession.startRunning()
        
    }
    
    
    @IBAction func record(sender: AnyObject) {
        startRecordings(sender as! UIButton)
    }
    
    func startRecordings(sender: UIButton){
        if !isRecording {
            // start recording
            let paths = NSSearchPathForDirectoriesInDomains(.DocumentDirectory, .UserDomainMask, true)
            let documentsDirectory = paths[0] as String
            let filePath : String? = "\(documentsDirectory)/temp.mp4"
            let fileURL : NSURL = NSURL(fileURLWithPath: filePath!)
            
            if (NSFileManager.defaultManager().fileExistsAtPath(filePath!)) {
                do {
                    try NSFileManager.defaultManager().removeItemAtPath(filePath!)
                } catch {
                    print("error")
                }
            }
            fileOutput.startRecordingToOutputFileURL(fileURL, recordingDelegate: self)

            isRecording = true
            
//            passToWebview(fileURL)

            //            self.changeButtonColor(self.startButton, color: UIColor.grayColor())
            //            self.changeButtonColor(self.stopButton, color: UIColor.redColor())
        }
    }
    
    @IBAction func stop(sender: AnyObject) {
        stopRecordings(sender as! UIButton)
    }
    
    func stopRecordings(sender: UIButton){
        if isRecording {
//            print("stop")
            fileOutput.stopRecording()
            
            isRecording = false
            
            previewLayer?.hidden = true

            //            self.changeButtonColor(self.startButton, color: UIColor.redColor())
            //            self.changeButtonColor(self.stopButton, color: UIColor.grayColor())
        }
    }
    
    func captureOutput(captureOutput: AVCaptureFileOutput!, didStartRecordingToOutputFileAtURL fileURL: NSURL!, fromConnections connections: [AnyObject]!) {
    }
    
    func captureOutput(captureOutput: AVCaptureFileOutput!, didFinishRecordingToOutputFileAtURL outputFileURL: NSURL!, fromConnections connections: [AnyObject]!, error: NSError!) {
        let assetsLib = ALAssetsLibrary()
        assetsLib.writeVideoAtPathToSavedPhotosAlbum(outputFileURL, completionBlock: nil)
        passToWebview(outputFileURL)
    }

/* */
    
    var playerItem : AVPlayerItem!
    var videoPlayer : AVPlayer!
    @IBOutlet weak var webView: UIWebView!

    
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
        passToWebview(url)
    }
    
    func passToWebview(url:NSURL) {
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

