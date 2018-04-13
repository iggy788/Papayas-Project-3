export function getFromStorage(key) {
	if (!key) {
		return null;
	}

	try {
		const valueStr = localStorage.getItem(key);
		if (valueStr) {
			return JSON.parse(valueStr);
		}
		return null;
	} catch (err) {
		return null;
	}
}

/////********************************************************
// Set the  the Current State of Home Class
export function setInStorage(key, obj) {
	if (!key) {
		console.error('Error: Key is Missing!');
	}

	try {
		localStorage.setItem(key, JSON.stringify(obj));
		return null;
	} catch (err) {
		console.error(err);
	}
}