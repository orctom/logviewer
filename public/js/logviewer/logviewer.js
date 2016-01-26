var activeTab = null;

var displayLog = function(data) {
  var event = JSON.parse(data);
  var server = event.server;
  console.log("server: " + server);
  var message = "<p class='highlight'>" + event.message + "</p>";
  $("#container-" + server).append(message);
  var scrollToBottom = $(document).scrollTop() + $(window).height() == $(document).height();
  if (scrollToBottom) {
    $("html, body").animate({
      scrollTop: $(document).height()
    }, 1000);
  }
  $('.highlight').yellowFade().removeClass('highlight');
};

var init = function() {

  $("#clearBtn").on("click", function() {
    $("#container").empty();
  });

  $("#reconnect").on("click", function() {
    reconnect();
  });
};

$(function() {
  init();
});

(function($) {
  $.fn.yellowFade = function() {
    this.animate({
      backgroundColor: '#ffffcc'
    }, 1).animate({
      backgroundColor: '#F5F5F5'
    }, 5000);
    return this;
  }
})(jQuery);