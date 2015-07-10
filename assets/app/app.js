$(document).ready(function () {

  $('.subnav-trigger').on('click', function () {
    $('.sub-nav').removeClass('is-active')
    $('.sub-nav', this).toggleClass('is-active')
  });

  $('#menu-toggle').on('click', function () {
    $('#menu-button').toggleClass('on')
    // $(this).toggleClass('on')
    $('.sidebar').toggleClass('show');
  });

});