$(function(){
  let time = 6;

  setInterval(function(){
    if (time > 0) {
      time--;
      $('.timer').text(time);

      if (time == 0) {
        $.post("/take");
        location.reload();
      }
    }
  }, 1300);
});
