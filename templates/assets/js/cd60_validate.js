$(function(){
  let time = 60;
  
  setInterval(function(){
    $('#timer').text('' + parseInt(time / 10) + time % 10);
    if (time > 1) {
      time--;
    }
    else {
      if ($("input:checked").length == 0) {
        $("input:not(:checked)").eq(0).prop('checked', true);
        $("input:not(:checked)").eq(0).prop('checked', true);
        $("input:not(:checked)").eq(0).prop('checked', true);
      }
      else if ($("input:checked").length == 1) {
        $("input:not(:checked)").eq(0).prop('checked', true);
        $("input:not(:checked)").eq(0).prop('checked', true);
      }
      else if ($("input:checked").length == 2) {
        $("input:not(:checked)").eq(0).prop('checked', true);
      }
      else if ($("input:checked").length == 4) {
        $("input:checked").eq(3).prop('checked', false);
      }
      else if ($("input:checked").length == 5) {
        $("input:checked").eq(3).prop('checked', false);
        $("input:checked").eq(3).prop('checked', false);
      }
      
      $('#form').submit();
    }
  },1000);
});
