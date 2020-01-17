/* eslint-disable object-curly-spacing */
/* eslint-disable comma-dangle */

'use strict';

import 'bootstrap-sass';

import AOS from 'aos';

AOS.init({
	duration: 1100,
	once: true,
	disable: false,
	startEvent: 'load'
});

document.addEventListener('aos:in:step-checker', ({ detail }) => {
	setTimeout(function() {
		document
			.querySelector('.process-overview-line-progress')
			.classList.add('visible');
	}, 1200);
});

import './scroll.js';
import './slider.js';
import './header.js';
