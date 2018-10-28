$(function() {
  let time = 300;
  
  setInterval(function() {
    $('#timer').text('' + parseInt(time / 100) + parseInt(time % 100 / 10) +time % 100 % 10);

    if (time > 0) {
      time--;
    } else if (time == 0) {
        time--;
        saveImages();
        location.href = '/end';
    }
  }, 1000);
});
