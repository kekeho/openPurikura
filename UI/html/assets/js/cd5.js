$(function(){
  let time = 5;
  
  setInterval(function(){
    $('.timer').text(time);
    if (time > 0) {
      time--;
    }
    /*
    else {
      $('#form').submit();
    }
    */
  },1000);
});
