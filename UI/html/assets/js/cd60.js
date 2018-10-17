$(function(){
  let time = 60;
  
  setInterval(function(){
    $('#timer').text('' + parseInt(time / 10) + time % 10);
    if (time > 1) {
      time--;
    }
    /*
    else {
      $('#form').submit();
    }
    */
  },1000);
});
