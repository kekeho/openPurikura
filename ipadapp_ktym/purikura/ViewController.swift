//
//  ViewController.swift
//  purikura
//
//  Created by KatayamaRyuichi on 2018/10/17.
//  Copyright © 2018年 shape. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var purikuraWeb: UIWebView!
    var requestURL: NSURL?
    var req: NSURLRequest?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        requestURL = NSURL(string: "/Users/katayamaryuichi/Documents/openPurikura/templates/purikura.html")
        req = NSURLRequest(url: requestURL! as URL)
        
        purikuraWeb.loadRequest(req! as URLRequest)
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }


}

