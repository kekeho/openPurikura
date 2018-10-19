$(function(){
  let time = 300;
  
  setInterval(function(){
    
    $('#timer').text('' + parseInt(time / 100) + parseInt(time % 100 / 10) +time % 100 % 10);
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
