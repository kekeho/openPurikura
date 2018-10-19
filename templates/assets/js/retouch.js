$.ajax({
  type: 'POST',
  url: '/retouching',
  success: function() {
    location.href = '/select2';
  }
});

