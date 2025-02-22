const _ = {

	e(str) {
		if (typeof str !== 'string') {
			str = String(str);
		}
		return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, '&apos;');
	},
	
	toNothing(label = 'n/a') {
		return `<i class="null">${label}</i>`;
	},

	toList(arr, sort = false, formatter = null) {
		let list = arr;
		let tag = 'ul';
		if (!Array.isArray(arr)) {
			arr = [arr];
		}
		if (sort) {
			list = list.slice(0);
			if (typeof sort === 'function') {
				list.sort(sort);
			}
			else {
				list.sort();
			}
			tag = 'ol';
		}
		if (typeof formatter === 'function') {
			list = list.map(formatter);
		}
		if (list.length === 0) {
			return _.toNothing();
		}
		else if (list.length === 1) {
			return list[0];
		}
		else {
			return `<${tag}><li>${list.join("</li><li>")}</li></${tag}>`;
		}
	},

	toLink(url, title = "", rel = "", target = "_blank") {
		if (!title) {
			if (url.length > 50) {
				title = url.replace(/^\w+:\/\/([^\/]+)((\/[^\/\?]+)*\/([^\/\?]+)(\?.*)?)?$/i, function(...x) {
					if (x[4]) {
						return x[1] + '​/[…]/​' + x[4]; // There are invisible zero-width whitespaces after and before the slashes. It allows breaking the link in the browser. Be careful when editing.
					}
					return x[1];
				});
			}
			else {
				title = url.replace(/^\w+:\/\//i, '');
			}
		}
		return `<a href="${_.e(url)}" rel="${_.e(rel)}" target="${_.e(target)}">${_.e(title)}</a>`;
	},

	toObject(obj, formatter = null) {
		let html = '<dl>';
		for(let key in obj) {
			// ToDo: also convert CamelCase? but not abbreviations like "USA".
			let label = _.formatKey(key, true);
			let value = obj[key];
			if (typeof formatter === 'function') {
				value = formatter(value, key, obj);
			}
			// TODO: Format label (also in arrays)
			html += `<dt>${label}</dt><dd>${value}</dd>`;
		}
		html += `</dl>`;
		return html;
	},

	abbrev(short, long) {
		return `<abbr title="${_.e(long)}">${_.e(short)}</abbr>`;
	},

	isObject(obj) {
		return (typeof obj === 'object' && obj === Object(obj) && !Array.isArray(obj));
	},

	formatKey(key, prefix = false) {
		if (prefix === false) {
			key = key.replace(/^\w+:/i, '');
		}
		return _.e(key).split(/[:_\-\s]/g).map(part => part.substr(0, 1).toUpperCase() + part.substr(1)).join(' ');
	},

	hexToUint8(hexString) {
		if(hexString.length === 0 || hexString.length % 2 !== 0){
			throw new Error(`The string "${hexString}" is not valid hex.`)
		}
  		return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
	},

	uint8ToHex(bytes) {
		return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
	},

	keysFromListOfObjects(objectList) {
		return objectList.reduce(
			(arr, o) => Object.keys(o).reduce(
				(a, k) => {
					if (a.indexOf(k) == -1) {
						a.push(k);
					}
					return a;
				},
				arr
			),
			[]
		);
	},

	unit(value, unit = '') {
		if (typeof unit === 'string' && unit.length > 0) {
			return `${value}&nbsp;<span class="unit">${unit}</unit>`;
		}
		return value;
	}

};

module.exports = _;