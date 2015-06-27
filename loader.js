(function () {
	var IMAGE_EXTENSIONS = ('jpg,jpeg,gif,bmp,png').split(',');
	var VIDEO_EXTENSIONS = ('mpg,mpeg,mp4,flv,ogg').split(',');

	function getExtension (filename) {
		var ext = /\.([^.]*$)/i.exec(filename);
		ext = ext ? ext[1] : '';
		return ext.toLowerCase();
	}

	function isImage (ext) {
		return IMAGE_EXTENSIONS.indexOf(ext) !== -1;
	}

	function isVideo (ext) {
		return VIDEO_EXTENSIONS.indexOf(ext) !== -1;
	}

	var Loader = window.Loader = {
		/**
		 * @param {...String} assets					one or more filenames to load
		 * @param {Object} [options]
		 * @param {Number} [options.minTime=0]			minimum timeout for callback invoking
		 * 												(even if the resource was already loaded)
		 * @param {Number} [options.maxTime=10]			maximum waiting time (sec) for resource loading
		 * 												(any resource that was not loaded will be set to null)
		 */
		load: function (assets, options) {
			var filesToLoad = {};
			var loadedFiles = {};
			var callback = function () {};

			var args = Array.prototype.slice.call(arguments);
			options = args.pop();
			if (typeof options !== 'object') {
				args.push(options);
				options = {};
			}
			var minTime = +options.minTime || 0;
			var maxTime = +options.maxTime || 10;
			var now = Date.now();

			/**
			 * @private
			 * The hook for "file-is-loaded" event
			 */
			function __onload () {
				if (Object.keys(filesToLoad).length === 0) {
					setTimeout(
						function () {
							callback(loadedFiles);
						},
						now + minTime * 1000 - Date.now() - 10 // fix (minTime === maxTime) scenario
					);
				}
			}

			// traversing all the resources
			args.forEach(function (src) {
				var ext = getExtension(src),
					element;

				if (isImage(ext)) { // ------------ load image ------------
					filesToLoad[src] = {type: 'image'};

					element = document.createElement('img');
					element.crossOrigin = element.crossorigin = 'anonymous';
					element.onload = function () {
						delete filesToLoad[src];
						loadedFiles[src] = element;
						__onload();
					};
					element.src = src;

				} else if (isVideo(ext)) { // ------------ load video ------------
					filesToLoad[src] = {type: 'video'};

					element = document.createElement('video');
					element.crossOrigin = element.crossorigin = 'anonymous';
					element.preload = 'auto';
					element.oncanplay = function () {
						delete filesToLoad[src];
						loadedFiles[src] = element;
						__onload();
					};
					element.src = src;
				} else {
					console.log('[ WARN ] Loader: unknown asset type: "' + src + '"; skipping');
				}
			});

			setTimeout(function () {
				if (Object.keys(filesToLoad).length > 0) {
					console.log('[ WARN ] Not all the resources were loaded in time:');
					for (var src in filesToLoad) {
						console.log('   > ' + src);
						loadedFiles[src] = null;
					}
					filesToLoad = {};
					__onload();
				}
			}, maxTime * 1000);

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
