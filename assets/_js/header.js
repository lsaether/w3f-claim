$(document).ready(function() {
	let $body = $('body');
	adjustHeader();

	$(window).scroll(function() {
		adjustHeader();
	});

	function adjustHeader() {
		if ($(window).scrollTop() > 70) {
			if (!$body.hasClass('navbar-hidden')) {
				$body.addClass('navbar-hidden');
			}
		} else {
			$body.removeClass('navbar-hidden');
		}
	}
});
