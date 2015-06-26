(function () {
	var IMAGE_EXTENSIONS = ('jpg,jpeg,gif,bmp,png').split(',');
	var VIDEO_EXTENSIONS = ('mpg,mpeg,mp4,flv,ogg').split(',');
	var LOADING_TIMEOUT = 5 * 1000; // 5 sec

	function getExtension (filename) {
		var ext = /\.([^.]*$)/i.exec(filename);
		ext = ext ? ext[1] : '';
		return ext.toLowerCase();
	}

	function isImage (ext) {
		return IMAGE_EXTENSIONS.indexOf(ext) > -1;
	}

	function isVideo (ext) {
		return VIDEO_EXTENSIONS.indexOf(ext) > -1;
	}

	var Loader = window.Loader = {
		/**
		 * @param {...String} assets					one or more filenames to load
		 */
		load: function (assets) {
			var filesToLoad = {};
			var loadedFiles = {};
			var callback = function () {};

			/**
			 * @private
			 * The hook for "file-is-loaded" event
			 */
			function __onload () {
				if (Object.keys(filesToLoad).length === 0) {
					callback(loadedFiles);
				}
			}

			Array.prototype.slice.call(arguments).forEach(function (asset) {
				var ext = getExtension(asset),
					element;

				if (isImage(ext)) { // ------------ load image ------------
					filesToLoad[asset] = {type: 'image'};

					element = document.createElement('image');
					element.crossOrigin = element.crossorigin = 'anonymous';
					element.onload = function () {
						delete filesToLoad[src];
						loadedFiles[asset] = element;
						__onload();
					};
					element.src = src;

				} else if (isVideo(ext)) { // ------------ load video ------------
					filesToLoad[asset] = {type: 'video'};

					element = document.createElement('image');
					element.crossOrigin = element.crossorigin = 'anonymous';
					element.preload = 'auto';
					element.oncanplay = function () {
						delete filesToLoad[src];
						loadedFiles[asset] = element;
						__onload();
					}
				} else {
					console.log('[ WARN ] Loader: unknown asset type: "' + asset + '"; skipping');
				}
			});

			setTimeout(function () {
				if (Object.keys(filesToLoad).length > 0) {
					console.log('[ WARN ] Not all the resources were loaded in time:');
					for (var asset in filesToLoad) {
						console.log('   > ' + asset);
						loadedFiles[asset] = null;
					}
					filesToLoad = {};
					__onload();
				}
			}, LOADING_TIMEOUT);

			return {
				then: function (cb) {
					if (typeof  cb === 'function') {
						if (Object.keys(filesToLoad).length > 0) {
							callback = cb;
						} else {
							cb(loadedFiles);
						}
					}
				}
			};
		},

		test: function () {
			document.querySelector('#content').innerHTML = 'Hello!';
		}
	};
})();
