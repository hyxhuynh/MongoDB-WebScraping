$(".saveArticle").on('click', function(event) {
    var id = $(this).data('id');
    var saveIt = $(this).data('set');
  
    $.ajax({
      method: "POST",
      url: "/api/NewsArticles/save/" + id,
      data: {
        save: saveIt,
      }
    }).then(function(data) {
      location.reload();
    });
  });