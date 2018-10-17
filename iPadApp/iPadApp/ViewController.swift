//
//  ViewController.swift
//  iPadApp
//
//  Created by Hiroki.T on 10/17/30 H.
//  Copyright © 30 Heisei Hiroki.T. All rights reserved.
//

import UIKit
import WebKit

class ViewController: UIViewController, WKUIDelegate {
    var webView: WKWebView!
    override func loadView() {
        let webConfiguration = WKWebViewConfiguration()
        webView = WKWebView(frame: .zero, configuration: webConfiguration)
        webView.uiDelegate = self
        view = webView
    }
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let myURL = URL(string: "http://www.nagano-nct.ac.jp/")
        let myRequest = URLRequest(url: myURL!)
        webView.load(myRequest)
    }
}

