$(document).ready(function () {
  $('.subnav-trigger').on('click', function () {
    $('.sub-nav').removeClass('is-active')
    $('.sub-nav', this).toggleClass('is-active')
  })
});