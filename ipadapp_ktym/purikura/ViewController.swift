//
//  ViewController.swift
//  purikura
//
//  Created by KatayamaRyuichi on 2018/10/17.
//  Copyright © 2018年 shape. All rights reserved.
//

import UIKit
import WebKit

class ViewController: UIViewController, WKUIDelegate {
    
    var webView: WKWebView!
    
    override func loadView() {
        webView.frame = self.view.bounds
        webView.uiDelegate = self
        view = webView
    }
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let myURL = URL(string: "")//http://192.168.145.18:8080
        let myRequest = URLRequest(url: myURL!)
        webView.load(myRequest)
    }
    
}
