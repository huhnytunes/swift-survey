
var getNextQuestion = function(e) {
  e.preventDefault();
  console.log("haha you clicked a choice");
}

$(document).ready(function() {

  console.log("document is ready");

  $('.choice').on('click', getNextQuestion);


});
