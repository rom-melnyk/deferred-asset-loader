var contentDiv = document.querySelector('#content');
var loadingImg = document.querySelector('img');
var videos = document.querySelectorAll('video');
var v1 = videos[0];
var v2 = videos[1];

/**
 * Hide the DOM element
 * @param {HTMLElement} el
 */
function hide (el) {
	el.style.display = 'none';
}

/**
 * Show the DOM element
 * @param {HTMLElement} el
 */
function show (el) {
	el.style.display = '';
}

/**
 * Main logic of how the video elements are played and react on mouse click.
 * Example is provided
 * @param {HTMLMediaElement} v1
 * @param {HTMLMediaElement} v2
 * @param {HTMLMediaElement} v3
 * @param {HTMLMediaElement} v4
 */
function mainLogic (v1, v2, v3, v4) {
	show(v1);
	v1.play();

	setTimeout(function () {
		v1.pause();
		hide(v1);

		show(v2);
		v2.play();
	}, 10 * 1000);

	setTimeout(function () {
		v2.pause();
	}, 15 * 1000);
}

loadingImg.onload = function () {
	hide(loadingImg);
	show(contentDiv);
	mainLogic(v1, v2);
};
