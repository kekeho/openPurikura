var shutter = new Audio('./assets/sounds/shutter.mp3');

$(function(){
  let time = 6;

  setInterval(function() {
    if (time > 0) {
      time--;
      $('.timer').text(time);

      if (time == 0) {
        shutter.play()
        $('#video').attr('src', './assets/src/white.png');
        $('#teacher').hide();

        $.ajax({
          type: 'POST',
          url: '/take',
          success: function() {
            $('#video').attr('src', './assets/photos/retouch.png');
            setTimeout(function() {
              location.reload();
            }, 3000);
          }
        });
      }
    }
  }, 300);
});
