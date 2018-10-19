//
//  ViewController.swift
//  purikura
//
//  Created by KatayamaRyuichi on 2018/10/17.
//  Copyright © 2018年 shape. All rights reserved.
//

import UIKit
import WebKit

class ViewController: UIViewController, UIWebViewDelegate {
    @IBOutlet weak var myWebView: UIWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        URLCache.shared.diskCapacity = 0
        URLCache.shared.memoryCapacity = 0
        let url = URL(string: "http://sekiei.jp")
        let request = URLRequest(url: url!)
        myWebView.loadRequest(request)
    }
}
