(function () {
	var IMAGE_EXTENSIONS = ('jpg,jpeg,gif,bmp,png').split(',');
	var VIDEO_EXTENSIONS = ('mpg,mpeg,mp4,flv,ogg').split(',');

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

			Array.prototype.slice.call(arguments).forEach(function (asset) {
				var ext = getExtension(asset);

				if (isImage(ext)) {
					// load image
					filesToLoad[asset] = {type: 'image'};
				} else if (isVideo(ext)) {
					// load video
					filesToLoad[asset] = {type: 'video'};
				} else {
					console.log('[ WARN ] Loader: unknown asset type: "' + asset + '"; skipping');
				}
			});

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
