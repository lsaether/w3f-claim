/* eslint-disable no-invalid-this */
/* eslint-disable comma-dangle */

import 'jquery-smooth-scroll';

$(document).ready(function() {
	$('a').smoothScroll();

	$('.jsGoToAnchor').on('click', function() {
		let anchor = $(this).data('anchor');
		$.smoothScroll({
			scrollTarget: anchor
		});
		return false;
	});
});
