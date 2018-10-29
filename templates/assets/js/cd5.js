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
            $('#video').attr('src', './assets/photos/c' + cache_num + '_before-' + take_num + '.png');
            setTimeout(function() {
              location.reload();
            }, 3000);
          }
        });
      }
    }
  }, 1300);
});
