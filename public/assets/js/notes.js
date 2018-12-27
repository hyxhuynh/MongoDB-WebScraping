var addNoteButton = document.getElementById("addNote");
var saveButton = document.getElementById("saveArticle");

addNoteButton.onsubmit = function(event) {
    event.preventDefault();
    
    var id = addNoteButton.getAttribute('data-id');

    $.ajax({
        method: "POST",
        url: "/api/NewsArticles/" + id,
        data: {
          title: $("#noteTitle").val(),
          body: $("#noteBody").val()
        }
      }).then(function(data) {
        location.reload();
    });
}

saveButton.onclick = function(event) {
  var id = saveButton.getAttribute('data-id');
  var saveIt = saveButton.getAttribute('data-set');

  $.ajax({
    method: "POST",
    url: "/api/NewsArticles/save/" + id,
    data: {
      save: saveIt,
    }
  }).then(function(data) {
    location.reload();
  });
}

$(".deleteNote").on('click', function(event){

  var id = $(this).data("id");

  $.ajax({
    method: "POST",
    url: "/api/Notes/delete/" + id
  }).then(function(data) {
    location.reload();
  });

});