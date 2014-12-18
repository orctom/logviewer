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
    displayLog(event.data);
};

var displayLog = function(data) {
    $("#container").append(data);
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

