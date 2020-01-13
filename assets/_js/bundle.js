/* eslint-disable object-curly-spacing */
/* eslint-disable comma-dangle */
/* eslint-disable no-tabs */
/* eslint-disable no-unused-vars */
/* eslint-disable no-invalid-this */

import $ from 'jquery';
window.jQuery = $;
window.$ = $;

// import 'bootstrap-sass';
import { tns } from 'tiny-slider/src/tiny-slider';

let sliderInnerParitySigner = tns({
	container: '#nested_inner_parity_signer',
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

let sliderInnerPolkadotJsPlugin = tns({
	container: '#nested_inner_polkadot_js_plugin',
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

let sliderInnerPolkadotJs = tns({
	container: '#nested_inner_slider_polkadot_js',
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
				let sliderIndex = $(this).data('slider') - 1;
				slider.goTo(sliderIndex);
				let index = slider.getInfo().index;
				$('.jsSliderGoTo.jsActive').removeClass('active');
				$('.jsSliderGoTo.jsActive')
					.eq(index)
					.addClass('active');
			});
		});
	});
})(jQuery);

let sliderInnerA = tns({
	container: '#nested_innerA',
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

const sliderA = tns({
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
			$('.jsSliderGoToA').click(function() {
				let sliderIndex = $(this).data('slider') - 1;
				slider.goTo(sliderIndex);
				let index = slider.getInfo().index;
				$('.jsSliderGoToA.jsActive').removeClass('active');
				$('.jsSliderGoToA.jsActive')
					.eq(index)
					.addClass('active');
			});
		});
	});
})(jQuery);
