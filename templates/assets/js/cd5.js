$(function(){
  let time = 5;
  
  setInterval(function(){
    $('.timer').text(time);
    if (time > 1) {
      time--;
    }      
    /*
    var socket = new WebSocket('ws://127.0.0.1:80/');
    
    socket.onopen = function(event){
      socket.send('TEST');
      socket.close();
    };
    */
  },1000);
  
  setTimeout(function(){
    $('#redirect')[0].click();
  }, 5100);
});
