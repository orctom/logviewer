$(function() {
  $(".sites > li").removeClass('active');
  registerDateRangePicker();
});

var registerDateRangePicker = function() {
  var start = $('input[name="start"]').val()
  var end = $('input[name="end"]').val();
  var startDate = start ? moment(Number(start)) : moment().startOf('day').subtract(5, 'days');
  var endDate = end ? moment(Number(end)) : moment();

  $(".date-range").daterangepicker({
    "timePicker": true,
    timePickerIncrement: 5,
    "opens": "center",
    locale: {
      format: 'MM/DD/YYYY h:mm A'
    },
    ranges: {
      'Today': [moment().startOf('day'), moment()],
      'Yesterday': [moment().startOf('day').subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    },
    startDate: startDate,
    endDate: endDate
  }, ch);
};

var ch = function(start, end) {
  $('input[name="start"]').val(start.valueOf());
  $('input[name="end"]').val(end.valueOf());
};