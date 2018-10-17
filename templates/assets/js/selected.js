$(function(){
  $('input[type="checkbox"]').click(function(){
    if ($("input:checked").length < 3) {
      $('#number').text('あと ' + (3 - $('input:checked').length)  + ' 枚選べます');
      $('label[for="next"]').css('display', 'none');
    }
    else if ($("input:checked").length == 3) {
      $('#number').text('次へ進んでください');
      $('label[for="next"]').css('display', 'block');
    }
    else {
      $('#number').text('3枚選べます');
      $('label[for="next"]').css('display', 'none');
    }
  });
});