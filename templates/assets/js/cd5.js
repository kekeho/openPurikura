$(function(){
  let time = 5;

  setInterval(function(){
    console.log(time);
    $('.timer').text(time);

    if (time >= 0) {
      time--;

    if (time == 0)
      $.post("/take");
    }
  }, 1000);
});
