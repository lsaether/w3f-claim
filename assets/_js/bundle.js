/* eslint-disable object-curly-spacing */
/* eslint-disable no-invalid-this */
/* eslint-disable comma-dangle */

import $ from 'jquery';
window.jQuery = $;
window.$ = $;

import './slider.js';
import 'jquery-smooth-scroll';
import AOS from 'aos';

AOS.init({
	duration: 1100,
	once: true,
	disable: false,
	startEvent: 'load'
});

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

	document.addEventListener('aos:in:step-checker', ({ detail }) => {
		setTimeout(function() {
			$('.process-overview-line-progress').addClass('visible');
		}, 1200);
	});

	$('a').smoothScroll();

	$('.jsGoToAnchor').on('click', function() {
		let anchor = $(this).data('anchor');
		$.smoothScroll({
			scrollTarget: anchor
		});
		return false;
	});
});
