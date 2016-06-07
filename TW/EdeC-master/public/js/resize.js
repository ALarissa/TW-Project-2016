$(document).ready(function() {
	resizeWrapper();
	$('.slider-arrow').css('left', ($('.active-nav').width()/2 - 15)*$('.active-nav').data('nav'));
	setTimeout(function() {
		$('body').css('visibility', 'visible');
	}, 300);

	$(window).on('resize', function() {
		resizeWrapper();
		$('.slider-arrow').css('left', ($('.active-nav').width()/2 - 15)*$('.active-nav').data('nav'));
	})

	var page = window.location.origin+"/products/";
	var pageProduct = window.location.origin+"/product/";

	var pageCampaign = window.location.origin+"/campaigns/";

	var pageNumber = parseInt(window.location.href.split("/")[4]);
	var address, pageNumberNext, pageNumberPrev, addressCampaign;

	pageNumberNext = pageNumber + 1;
	address = page + pageNumberNext;

	pageNumberPrev = pageNumber - 1;
	if (pageNumberPrev == 0) pageNumberPrev = 1;
})

function resizeWrapper() {
	var windowHeight = $(window).height()-180;
	$('.main-wrapper').css('min-height', windowHeight);
}