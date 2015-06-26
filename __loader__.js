/**
 * This is the part of the GL abstraction layer; it works fine being included in the `../gl.js`
 */
module.exports = function (GL) {
	/**
	 * Load assets and run the callback once everything is loaded.
	 *
	 * @param {Object<key,Object>} assets   the description af the assets; keys mean asset names
	 * @param {String} assets.type          one of "shaders", "image", "text", "xml", "json"
	 * @param {String} [assets.v]           vertex shader filename (work with type === "shader")
	 * @param {String} [assets.f]           fragment shader filename (work with type === "shader")
	 * @param {String} assets.src           the filename for another kind of asset
	 *
	 * @return {Object<then,Function>}      a Promise with `.then()` method that expects the callback invoked after all assets are loaded.
	 *                                      The callback receives one {Object} param with keys from the `assets` and values equals to appropriate content:
	 *                                      - type === "shaders" -- {v: "shader text", f: "shader text"}
	 *                                      - type === "image" -- {Image}
	 *                                      - type === "text" -- {String}
	 *                                      - type === "xml" -- {Document|null}
	 *                                      - type === "json" -- {Object|null}
	 */
	GL.loadAssets = function (assets) {
		var _loadedAssets = {},
			files = {},
			infrastructure = {},
			callback = function () {
			};

		/**
		 * @private
		 * The hook for "file-is-loaded" event
		 */
		function _onload () {
			if (Object.keys(files).length === 0) {
				callback(_loadedAssets);
			}
		}

		/**
		 * @private
		 * Loads any text content (shaders, xml, json, etc) and performs the callback (XHR object is passed as the param)
		 */
		function _loadText (src, cb, mime) {
			var xhr = new XMLHttpRequest();

			files[src] = {type: 'text', callback: cb};
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					delete files[src];
					cb(xhr);
					_onload();
				}
			};
			xhr.open('GET', src, true);
			if (mime) {
				xhr.overrideMimeType(mime);
			}
			xhr.send();
		}

		function _loadImage (src, cb) {
			var img = new Image();

			files[src] = {type: 'image', callback: cb};
			img.onload = function () {
				delete files[src];
				cb(img);
				_onload();
			};
			img.src = src;
		}

		_.each(assets, function (asset, name) {
			if (asset.type === 'shaders') {
				_loadedAssets[name] = {};
				_loadText(asset.v, function (xhr) {
					_loadedAssets[name].v = xhr.responseText;
				});
				_loadText(asset.f, function (xhr) {
					_loadedAssets[name].f = xhr.responseText;
				});
			}

			if (asset.type === 'image') {
				_loadImage(asset.src, function (img) {
					_loadedAssets[name] = img;
				});
			}

			if (asset.type === 'text') {
				_loadText(asset.src, function (xhr) {
					_loadedAssets[name] = xhr.responseText;
				});
			}

			if (asset.type === 'xml') {
				_loadText(asset.src, function (xhr) {
					_loadedAssets[name] = xhr.responseXML;
					if (xhr.responseXML === null) {
						console.log('[ GL-WARN ] The resource "' + asset.src + '" wasn\'t interpreted as XML; the structure is corrupt');
					}
				}, 'application/xml');
			}

			if (asset.type === 'json') {
				_loadText(asset.src, function (xhr) {
					try {
						_loadedAssets[name] = JSON.parse(xhr.responseText);
					} catch (e) {
						_loadedAssets[name] = null;
						console.log('[ GL-WARN ] The resource "' + asset.src + '" wasn\'t parsed as JSON; the structure is corrupt');
					}
				});
			}
		});

		infrastructure.then = function (cb) {
			if (_.isFunction(cb)) {
				if (Object.keys(files).length > 0) {
					callback = cb;
				} else {
					cb(_loadedAssets);
				}
			}
		};

		setTimeout(function () {
			if (Object.keys(files).length > 0) {
				console.log('[ GL-WARN ] Not all the resources were loaded in 3s:');
				_.each(files, function (fileObj, src) {
					if (fileObj.type === 'text') {
						console.log('   > "' + src + '" - forced to empty text');
						fileObj.callback({responseText: '', responseXML: null});
					} else if (fileObj.type === 'image') {
						console.log('   > "' + src + '" - forced to empty image');
						fileObj.callback(GL.Texture.emptyImage);
					}
				});
				files = {};
				_onload();
			}
		}, 3 * 1000);
		return infrastructure;
	};

	return GL;
};