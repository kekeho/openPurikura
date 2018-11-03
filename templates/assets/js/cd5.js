$(function(){
  let time = 5;

  let interval = setInterval(function() {
    $(".timer").text(time);

    if (time > 0) {
      $.ajax({
        type: "POST",
        url: "/take",
        data: {
          "time": time
        }
      });

    } else if (time == 0) {
      $.ajax({
        type: "POST",
        url: "/take",
        data: {
          "time": time
        },
        success: function() {
          // プレビューを表示後リロード
          $("#video").attr("src", "./assets/photos/c" + cache_num + "_before-" + take_num + ".png");
          setTimeout(function() {
            location.reload();
          }, 3000);
        }
      });

      // フラッシュ
      $("#video").attr("src", "./assets/src/white.png");

      // タイマーストップ
      clearInterval(interval);
    }

    time--;
  }, 1300);
});
