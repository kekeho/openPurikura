$(function(){
  $('input[type="checkbox"]').click(function(){
    $('#number').text('あと ' + (3 - $('input:checked').length)  + ' 枚選べます');
    
    if ($("input:checked").length == 3) {
      $('label[for="next"]').css('display', 'block');
    }
    else {
      $('label[for="next"]').css('display', 'none');
    }
  });
});