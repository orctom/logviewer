var activeSite = 'www';
var socket = null;

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

var registerMenuEvents = function() {
  $(".sites > li > a").on("click", function(e) {
    var $site = $(e.target);
    $(".sites > li").removeClass('active');
    $site.parent().addClass('active');
    var site = $site.data('site');
    console.log("clicked on: " + site);
    activeSite = site;

    restartTailLogs();
  });
};

var registerClearEvent = function() {
  $("#clearBtn").on("click", function() {
    $("#container").empty();
  });
};

var startTailLogs = function() {
  console.log("startTailLogs...");
  socket.on('connect', function() {
    var clientId = localStorage.getItem("clientId");
    if (null === clientId) {
      clientId = socket.id;
      localStorage.setItem("clientId", clientId);
    }
    socket.emit('clientId', clientId);
  });
  socket.on('log-' + activeSite, function(msg) {
    console.dir(msg);
    // displayLog(msg.data);
    var message = "<p class='highlight'>" + msg.data + "</p>";
    $("#container-www01").append(message);
  });
};

var restartTailLogs = function() {
  socket.disconnect();
  socket = io();

  startTailLogs(socket);
};

$(function() {
  registerMenuEvents();
  registerClearEvent();

  socket = io();
  startTailLogs();
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