"use strict";

const ID_COLOR = {
  deepred    : 0,
  red        : 1,
  salmonpink : 2,
  hotpink    : 3,
  pink       : 4,
  purple     : 5,
  blue       : 6,
  deepblue   : 7,
  lightblue  : 8,
  vividblue  : 9,
  green      : 10,
  yellow     : 11,
  vividorange: 12,
  orange     : 13,
  beige      : 14,
  vividgreen : 15,
  darkgreen  : 16,
  gray       : 17,
  black      : 18,
  white      : 19
};

const RGB_COLOR = [
  [193, 39 , 45 ], // deepred
  [255, 0  , 0  ], // red
  [237, 30 , 121], // salmonpink
  [255, 105, 180], // hotpink
  [255, 192, 203], // pink
  [160, 0  , 160], // purple
  [0  , 0  , 255], // blue
  [0  , 113, 176], // deepblue
  [50 , 200, 255], // lightblue
  [0  , 255, 255], // vividblue
  [0  , 255, 0  ], // green
  [255, 255, 0  ], // yellow
  [251, 176, 59 ], // vividorange
  [247, 147, 30 ], // orange
  [198, 156, 109], // beige
  [127, 200, 33 ], // vividgreen
  [85 , 107, 47 ], // darkgreen
  [128, 128, 128], // gray
  [20 , 20 , 20 ], // black
  [255, 255, 255]  // white
];

// 色を表すクラス
class Color {
  constructor(id_color) {
    this.id = id_color;
  }

  // カラーIDの設定
  set id(id_color) {
    this._id = id_color;
    this.r = RGB_COLOR[this.id][0];
    this.g = RGB_COLOR[this.id][1];
    this.b = RGB_COLOR[this.id][2];
  }

  get id() {
    return this._id;
  }

  // CSS形式の色を表す文字列
  get str_color() {
    return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
  }
}
