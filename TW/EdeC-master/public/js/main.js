$(document).ready(function() {

	// START GENERAL JS //
	resizeWrapper();
	$('.slider-arrow').css('left', ($('.active-nav').width()/2 - 15)*$('.active-nav').data('nav'));
	setTimeout(function() {
		$('body').css('visibility', 'visible');
	}, 300);

	$(window).on('resize', function() {
		resizeWrapper();
		$('.slider-arrow').css('left', ($('.active-nav').width()/2 - 15)*$('.active-nav').data('nav'));
	})

	$('body').on('click', '#logout', function() {
		$('#logout-form').submit();
	});

	// END GENERAL JS //

// ######################################################################################################################################

	// START HOMEPAGE JS //
	$('body').on('click', '.homepage-slider-nav', function() {
		if (!$('.active-slide').hasClass('slide-' + $(this).data('nav'))) {
			$('.active-slide').fadeOut(500);
			var slideNumber = $(this).data('nav');
			setTimeout(function() {
				$('.active-slide').removeClass('active-slide');
				$('.slide-' + slideNumber).fadeIn(500);
			}, 500);
			setTimeout(function() {	
				$('.slide-' + slideNumber).addClass('active-slide');
			}, 1000);

			$('.slider-arrow').animate({
				left: ($('.active-nav').width()/2 - 15) + $('.active-nav').width()*(slideNumber-1)
			}, 750);
		}

	});
	// END HOMEPAGE JS //

// ######################################################################################################################################

	// START REGISTRATION PAGE JS //
	var error;

	$('body').on('click', '.go-to-optional-registration', function() {
		error = '<div class="error-message"><ul>';
		var r = '.register-form .registration-mandatory ';
		if ($(r+'#password').val() != $(r+'#repeat-password').val()) error += '<li>The two passwords do not match !</li>';
		$(r+'input').each(function(){
			if ($(this).val() == '') error += "<li>Please fill in all the required fields !</li>"
		});

		scrollToTop();
		
		if (error == '<div class="error-message"><ul>') {
			error = '';
			$('.error-message').remove();
			$('.registration-mandatory').fadeOut(500);
			setTimeout(function(){
				resizeWrapper();
				$('.registration-optional').fadeIn(500);
			}, 500)
		} else {
			error += "</ul></div>";
			$('.error-message').remove();
			$('.register-main-wrapper h2').before(error);
			var windowHeight = $(window).height() - 200;
			if ($('.main-wrapper').hasClass('adjusted-height')) $('.main-wrapper').height(windowHeight + $('.error-message').height());
		}
	});

	$('body').on('click', '.go-to-mandatory-registration', function() {
		error = '<div class="error-message"><ul>';
		scrollToTop();
		$('.registration-optional').fadeOut(500);
		setTimeout(function(){
			$('.registration-mandatory').fadeIn(500);
		}, 500)
	});	

	$('body').on('click', '.submit-registration', function() {
		if (error == '') $('.register-form').submit();
		else {
			scrollToTop();
			$('.registration-optional').fadeOut(500);
			setTimeout(function(){
				$('.registration-mandatory').fadeIn(500);
			}, 500)
		}
	}) 
	// END REGISTRATION PAGE JS//

// ######################################################################################################################################

	// START PRODUCTS PAGE JS //

	// END PRODUCTS PGAE JS //
});

var timeOut;
function scrollToTop() {
  if (document.body.scrollTop != 0 || document.documentElement.scrollTop != 0){
    window.scrollBy(0, -50);
    timeOut = setTimeout('scrollToTop()', 10);
  } else clearTimeout(timeOut);
}

function resizeWrapper() {
	var windowHeight = $(window).height()-200;
	$('.main-wrapper').css('min-height', windowHeight);
}

// START PROFILE PAGE


$('body').on('click', '.submit-edit-info', function() {
	$('.edit-profile-info-form').submit();
});

var er;
$('body').on('click', '.mail', function() {
var re = '.edit-profile-info-form';
	if ($(re+'#password-edit').val() != $(re+'#repeat-password-edit').val()) er += '<li>The two passwords do not match !</li>';
	console.log(er);
});

// END PROFILE PAGE
