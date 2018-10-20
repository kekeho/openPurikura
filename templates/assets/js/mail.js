$.ajax({
  type: 'POST',
  url: '/mail',
  success: function() {
    location.href = '/end';
  }
});

