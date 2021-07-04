$(document).ready(function () {

    const filterBar = $('#filter_bar');
    $("#filter_open").on('click', function () {
        filterBar.css('width', '300px');
        filterBar.css('display', 'block');
    });

    $("#filter_close").on('click', function () {
        filterBar.css('width', '0px');
        filterBar.css('display', 'none');
    });

    $("#budgetSlider").on('change', function () {
        $("#rangeValue").text($(this).val().toString()+"€")
    })
});