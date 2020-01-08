/* eslint-disable object-curly-spacing */
/* eslint-disable comma-dangle */
/* eslint-disable no-tabs */
/* eslint-disable no-unused-vars */
/* eslint-disable no-invalid-this */

import $ from 'jquery';
window.jQuery = $;
window.$ = $;

import { tns } from 'tiny-slider/src/tiny-slider';

let sliderInner = tns({
	container: '#nested_inner',
	mode: 'gallery',
	items: 1,
	nested: 'inner',
	slideBy: 'page',
	speed: 400,
	controls: true,
	nav: true,
	navPosition: 'bottom',
	controlsPosition: 'bottom',
	autoplay: false,
	loop: false,
	lazyload: true
});

let sliderInner2 = tns({
	container: '#nested_inner_2',
	mode: 'gallery',
	items: 1,
	nested: 'inner',
	slideBy: 'page',
	speed: 400,
	controls: true,
	nav: true,
	navPosition: 'bottom',
	controlsPosition: 'bottom',
	autoplay: false,
	loop: false
});

const slider = tns({
	container: '.slider',
	mode: 'carousel',
	nested: 'outer',
	items: 1,
	slideBy: 'page',
	autoplay: false,
	controls: false,
	nav: false,
	loop: false,
	speed: 600
});

(function($) {
	$(function() {
		$(document).ready(function() {
			$('.jsSliderGoTo').click(function() {
				$('.jsSliderGoTo').removeClass('active');
				$(this).addClass('active');
				slider.goTo($('.jsSliderGoTo').index(this));
			});
		});
	});
})(jQuery);
