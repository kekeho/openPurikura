$(function(){
  let shutter = new Audio("./assets/sounds/shutter.mp3");
  let countdown = new Audio("./assets/sounds/countdown.mp3");

  let time = 5;

  let interval = setInterval(function() {
    $(".timer").text(time);

    if (time > 0) {
      countdown.play();

    } else if (time == 0) {
      shutter.play();
      $("#video").attr("src", "./assets/src/white.png");
      $("#teacher").hide();

      $.ajax({
        type: "POST",
        url: "/take",
        success: function() {
          $("#video").attr("src", "./assets/photos/c" + cache_num + "_before-" + take_num + ".png");
          setTimeout(function() {
            location.reload();
          }, 3000);
        }
      });

      clearInterval(interval);
    }

    time--;
  }, 1300);
});
