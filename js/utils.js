function getDataset(url, callback) {
	$.getJSON(url, function(dataset) {
		if(callback && typeof callback === 'function') {
			callback(dataset);
		}
	}).fail(function(error) {
		console.log(error);
	});
}

// Filtra il dataset per una regione specifica
function filterDatasetRegione(codiceRegione, dataset) {
	let regioneDataset = [];
	for(const data of dataset) {
		if(data.codice_regione == codiceRegione) {
			regioneDataset.push(data);
		}
	}
	return regioneDataset;
}

// Porziona il dataset
function sliceDataset(dataset, from, to) {
	if(dataset.length == 0) {
		console.log("Slice empty dataset");
		return null;
	}

	if(to < dataset.length) {
		if(to <= 0) {
		dataset = dataset.slice(from, dataset.length);
		} else {
			dataset = dataset.slice(from, to);
		}
	} else {
		return null;
	}

	return dataset;
}

// Restituisce un colore casuale in HEX string
function randomHexColor() {
	//const randomColor = Math.floor(Math.random()*16777215).toString(16);
	//return "#"+randomColor

	let colors = [
		"ECCAB4",
		"32a852",
		"D2AF30",
		"c972ca",
		"efcc09",
		"7e07f2",
		"4DA1F9",
		"B3BDE3",
		"EEF140",
		"E55458",
		"D529F8",
		"88FBA5",
		"DB0513",
		"21FE97",
		"2EEEEB",
		"D39923",
		"2361F2",
		"EC59CE"
	];

	return "#" + colors[Math.floor(Math.random() * colors.length)];
}