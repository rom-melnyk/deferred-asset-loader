// ---------------------------------------------
// Replace this with your media paths
// ---------------------------------------------
var loadingImg = './img/ajax_loader_blue_512.gif';
var videoOne = './video/big_buck_bunny.mp4';
var videoTwo = './video/sea-01.ogg';
var videoThree = './video/sea-02.ogg';
var videoFour = './video/sea-03.ogg';

var contentDiv = document.querySelector('#content');

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
	}, 5 * 1000);
}

Loader.load(loadingImg).then(function (imgAssets) {
	if (imgAssets[loadingImg]) {
		contentDiv.appendChild(imgAssets[loadingImg]);
	}

	Loader.load(videoOne, videoTwo, videoThree, videoFour, {minTime: 5, maxTime: 5}).then(function (videoAssets) {
		var v1, v2, v3, v4;
		hide(imgAssets[loadingImg]);

		var isError = false;
		[videoOne, videoTwo, videoThree, videoFour].forEach(function (src) {
			if (videoAssets[src]) {
				switch (src) {
					case videoOne:
						v1 = videoAssets[src];
						break;
					case videoTwo:
						v2 = videoAssets[src];
						break;
					case videoThree:
						v3 = videoAssets[src];
						break;
					case videoFour:
						v4 = videoAssets[src];
						break;
				}
				hide(videoAssets[src]);
				contentDiv.appendChild(videoAssets[src]);
			} else {
				console.log('Error: unable to use ' + src);
				isError = true;
				return false;
			}
		});
		if (isError) return false;

		// ------------ now we can play with all the videos ------------
		console.log('[ i ] All the video elements are ready to play');
		mainLogic(v1, v2, v3, v4);
	});
});

