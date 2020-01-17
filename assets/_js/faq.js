/* eslint-disable no-invalid-this */
/* eslint-disable comma-dangle */

$('.accordion-toggle').click(function() {
	$(this)
		.toggleClass('show')
		.next()
		.slideToggle();
	return false;
});
