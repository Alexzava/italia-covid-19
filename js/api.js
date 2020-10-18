function getDataset(url, callback) {
	$.getJSON(url, function(dataset) {
		if(callback && typeof callback === 'function') {
			callback(dataset);
		}
	}).fail(function(error) {
		console.log(error);
	});
}