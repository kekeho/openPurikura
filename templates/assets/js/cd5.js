$(function(){
  let time = 6;

  setInterval(function(){
    if (time > 0) {
      time--;
      $('.timer').text(time);

      if (time == 0) {
        $.ajax({
          type: 'POST',
          url: '/take',
          success: function() {
            location.reload();
          }
        });
      }
    }
  }, 1300);
});
