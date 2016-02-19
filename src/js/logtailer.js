$(function() {
  loadLogContainer();
  socket = io();
  startTailLogs();
  window.onresize = resizeLogPanel;
});