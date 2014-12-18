var activeTab = null;

var socket = null;
var serverURL = "ws://10.164.39.64:3232";
var connect = function() {
    socket = new WebSocket(serverURL);
    socket.onopen = onOpen;
    socket.onclose = onClose;
    socket.onerror = onError;
    socket.onmessage = onMessage;
};
var close = function() {
    if (socket) {
        socket.close();
        socket = null;
    }
};
var reconnect = function() {
    close();
    connect();
};

var onOpen = function() {
    console.log("[OPENED]: " + serverURL);
};
var onClose = function() {
    console.log("[CLOSED]: " + serverURL);
};
var onError = function(e) {
    console.log("[ERROR]");
};
var onMessage = function(event) {
    if (event.data) {
        displayLog(event.data);
    } else {
        console.log(event);
    }
};

var displayLog = function(data) {
    var event = JSON.parse(data);
    var server = event.server;
    console.log("server: " + server);
    var message = "<p class='highlight'>" + event.message + "</p>";
    $("#container-" + server).append(message);
    var scrollToBottom = $(document).scrollTop() + $( window ).height() == $(document).height();
    if (scrollToBottom) {
        $("html, body").animate({ scrollTop: $(document).height() }, 1000);
    }
    $('.highlight').yellowFade().removeClass('highlight');
};

var init = function() {
    $(window).on("beforeunload", function() {
        socket.close();
    });

    window.onerror = function(error) {
        console.log("window error");
        console.dir(error);
    };

    connect();



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
        this.animate( { backgroundColor: '#ffffcc' }, 1 ).animate( { backgroundColor: '#F5F5F5' }, 5000 );
        return this;
    }
})(jQuery);
