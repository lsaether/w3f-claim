/* eslint-disable no-invalid-this */
/* eslint-disable comma-dangle */

$('#faq .list-group-item > div').click(function() {
	$(this)
		.next()
		.toggleClass('show');
	return false;
});
