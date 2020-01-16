/* eslint-disable object-curly-spacing */
/* eslint-disable no-invalid-this */
/* eslint-disable comma-dangle */

import $ from 'jquery';
window.jQuery = $;
window.$ = $;

import AOS from 'aos';

AOS.init({
	duration: 1100,
	once: true,
	disable: false
});

import './slider.js';
import 'jquery-smooth-scroll';

$('a').smoothScroll();

$('.jsGoToAnchor').on('click', function() {
	let anchor = $(this).data('anchor');
	$.smoothScroll({
		scrollTarget: anchor
	});
	return false;
});
