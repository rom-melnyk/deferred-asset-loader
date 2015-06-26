(function () {
	function Promise () {
		this.filesToLoad = {};
		this.loadedFiles = {};
		this.callback = function () {};
		this.then = function (cb) {
			if (typeof  cb === 'function') {
				if (Object.keys(this.filesToLoad).length > 0) {
					this.callback = cb;
				} else {
					cb(this.loadedFiles);
				}
			}
		};
	}

	var Loader = window.Loader = {
		/**
		 * @param {...String} asset					one or more filenames to load
		 */
		load: function (asset) {
			var filesToLoad = {};
			var loadedFiles = {};
			var callback = function () {};

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
