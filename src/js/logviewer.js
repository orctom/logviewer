var activeSite = 'www';
var socket = null;
var dirtyFlags = {
  'www': false,
  'bsd': false
};

var highlightPattern = /(.*\.)(\w+(?:Exception|Error))(.*)/g;

var displayLog = function(data) {
  var server = data.server;
  var message = "<p class='highlight'>" + data.message + "</p>";
  var $pre = $("#container-" + server);

  var isCurrentServerActive = $pre.parent().hasClass("active");
  if (isCurrentServerActive) {
    var $panelBody = $pre.parent().parent().parent();
    var panelBodyScrollHeight = $panelBody.prop("scrollHeight");
    var scrollToBottom = $panelBody.scrollTop() + $panelBody.parent().height() == panelBodyScrollHeight;
    if (scrollToBottom) {
      $panelBody.animate({
        scrollTop: panelBodyScrollHeight
      }, 1000);
    }
  }

  $pre.append(highlightException(message));
  $('.highlight').yellowFade().removeClass('highlight');
  updateBadge(server);
};

var updateBadge = function(server) {
  var $badge = $("#badge-" + server);
  var count = Number($badge.text()) + 1;
  $badge.html(count);
  $badge.addClass("badge-highlight").delay(500).queue(function() {
    $(this).removeClass('badge-highlight').dequeue();
  });
};

var highlightException = function(message) {
  return message.replace(highlightPattern, "$1<span class='label label-primary'>$2</span>$3");
};

var registerMenuEvents = function() {
  $(".sites > li > a").on("click", function(e) {
    var $site = $(e.target);
    $(".sites > li").removeClass('active');
    $site.parent().addClass('active');
    var site = $site.data('site');
    activeSite = site;

    loadLogContainer();
    restartTailLogs();
  });
};

var registerClearEvent = function() {
  $("#clearBtn").on("click", function(e) {
    $(".tab-pane.active > pre").empty();
    $("#badge-" + $(".tab-pane.active").prop("id")).html(0);
  });
};

var startTailLogs = function() {
  socket.on('connect', function() {
    var clientId = localStorage.getItem("clientId");
    if (null === clientId) {
      clientId = socket.id;
      localStorage.setItem("clientId", clientId);
    }
    socket.emit('request', {
      'clientId': clientId,
      'site': activeSite
    });
  });
  console.log('sub: ' + activeSite);
  socket.on(activeSite, function(msg) {
    displayLog(msg);
    dirtyFlags[activeSite] = true;
  });
};

var restartTailLogs = function() {
  socket.disconnect();
  socket = io();
  startTailLogs();
};

var loadLogContainer = function() {
  var $logContainer = $('.logContainer');
  $logContainer.load('/' + activeSite, function() {
    registerClearEvent();
    resizeLogPanel();
  });
};

var resizeLogPanel = function() {
  $(".panel-body").css("height", $(window).height() - 138);
};

$(function() {
  registerMenuEvents();
  loadLogContainer();

  socket = io();
  startTailLogs();

  window.onresize = resizeLogPanel;
});

(function($) {
  $.fn.yellowFade = function() {
    this.animate({
      backgroundColor: '#ffffcc'
    }, 1).animate({
      backgroundColor: '#F5F5F5'
    }, 5000);
    return this;
  };
})(jQuery);