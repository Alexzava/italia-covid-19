// In fase di sviluppo
// non implementare

function getDataset(url, callback) {
	if(window.localStorage.getItem('dataset')) {
		let storedDataset = JSON.parse(window.localStorage.getItem('dataset'));
		let next_update = moment(storedDataset.next_update);
		if(moment().diff(next_update, 'seconds') < 0) {
			console.log("dataset already stored");
			callback(storedDataset.dataset);
		}
	} else {
		$.getJSON(url, function(dataset) {
			if(callback && typeof callback === 'function') {
				let next_update = moment();
				if(next_update.hour() > 18) {
					next_update.add(1, 'days');
				}
				next_update.set('hour', 18);
				next_update.set('minute', 0);
				next_update.set('second', 0);

				let datasetData = moment(dataset[0].data);
				if(next_update.diff(datasetData, 'seconds') > 0) {
					window.localStorage.setItem('dataset', JSON.stringify({'dataset':dataset, 'next_update':next_update.format()}));
				} else {
					console.log("the dataset is already updated");
				}

				callback(dataset);
			}
		}).fail(function(error) {
			console.log(error);
		});
	}
}