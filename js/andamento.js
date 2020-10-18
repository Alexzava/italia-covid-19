var baseUrl = "/andamento-nazionale/";

// Legge e lavora sul dataset
function doDataset(category) {
	let filtersForm = document.getElementById('filtersForm');
	if(filtersForm) {
		filtersForm.onsubmit = filtersFormOnSubmit;
	}

	let prop = ["data"];
	let lastDays = -1;
	let codiceRegione = 3;

	// Da mobile mostra gli ultimi 30 giorni di default
	if(screen.width <= 900) {
		lastDays = 30;
	}

	// Legge i parametri passati via URL
	const params = new URLSearchParams(window.location.search);
	if(params.get('prop')) {
		for(const p of params.get('prop').split(',')) {
			prop.push(p);
		}
	} else {
		prop.push("totale_positivi");
		prop.push("dimessi_guariti");
		prop.push("deceduti");
	}
	if(params.get('days')) {
		if(!isNaN(params.get('days'))) {
			lastDays = params.get('days');
		}
	}
	if(params.get('regione')) {
		codiceRegione = params.get('regione');
	}

	// Legge il dataset e popula la dashboard
	if(category === "nazionale") {
		baseUrl = "/andamento-nazionale/?";
		getDataset(andamentoNazionaleUrl, (dataset) => {
			// Inverto il dataset (Ordinato dal più recente)
			dataset.reverse();
			let newDataset = sliceDataset(dataset, 0, lastDays);
			applyDataset(newDataset, {properties: prop});

			applyRecentPanel(newDataset);

			// Inverto il dataset al suo stato iniziale (Ordine cronologico)
			newDataset.reverse();
			drawChart("chart", newDataset, {properties: prop});
		});
	} else if(category === "regionale") {
		baseUrl = "/andamento-regionale/?regione="+codiceRegione+"&";
		getDataset(andamentoRegioniUrl, (dataset) => {
			// Filtro il dataset per regione
			let newDataset = filterDatasetRegione(codiceRegione, dataset);

			// Titolo pagina dashboard
			let dashboardTitle = document.getElementById('dashboardTitle');
			if(dashboardTitle) {
				dashboardTitle.innerHTML = "Andamento " + newDataset[0].denominazione_regione;
			}

			// Inverto il dataset (Ordinato dal più recente)
			newDataset.reverse();
			newDataset = sliceDataset(newDataset, 0, lastDays);
			applyDataset(newDataset, {properties: prop});

			applyRecentPanel(newDataset);

			// Inverto il dataset al suo stato iniziale (Ordine cronologico)
			newDataset.reverse();
			drawChart("chart", newDataset, {properties: prop});
		});
	}
}

function filterDatasetRegione(codiceRegione, dataset) {
	let regioneDataset = [];
	for(const data of dataset) {
		if(data.codice_regione == codiceRegione) {
			regioneDataset.push(data);
		}
	}
	return regioneDataset;
}

// Applica i filtri selezionati nel form
function filtersFormOnSubmit(event) {
	event.preventDefault();
	var filters = document.getElementsByClassName('filter-checkbox');
	var params = [];
	for(const checkbox of filters) {
		if(checkbox.checked) {
			params.push(checkbox.value);
		}
	}
	let daysInput = document.getElementById('days');
	if(daysInput && daysInput.value.length > 0) {
		window.location.href = baseUrl + "prop=" + params.join() + "&days=" + daysInput.value;
	} else {
		window.location.href = baseUrl + "prop=" + params.join();
	}
}

// Mostra i dati più recenti nei pannelli dashboard
function applyRecentPanel(dataset) {
	let panelAttualiPositivi = document.getElementById('panelAttualiPositivi');
	let panelIncrementoPositivi = document.getElementById('panelIncrementoPositivi');

	let panelGuariti = document.getElementById('panelGuariti');
	let panelIncrementoGuariti = document.getElementById('panelIncrementoGuariti');

	let panelDeceduti = document.getElementById('panelDeceduti');
	let panelIncrementoDeceduti = document.getElementById('panelIncrementoDeceduti');

	let panelOspedalizzati = document.getElementById('panelTotaliOspedalizzati');
	let panelIncrementoOspedalizzati = document.getElementById('panelIncrementoOspedalizzati');

	dataset = sliceDataset(dataset, 0, 2);

	let incrementoPositivi = dataset[0].nuovi_positivi;
	let incrementoGuariti = dataset[0].dimessi_guariti - dataset[1].dimessi_guariti;
	let incrementoDeceduti = dataset[0].deceduti - dataset[1].deceduti;
	let incrementoOspedalizzati = dataset[0].totale_ospedalizzati - dataset[1].totale_ospedalizzati;

	panelAttualiPositivi.innerHTML = dataset[0].totale_positivi;
	panelIncrementoPositivi.innerHTML = dataset[0].variazione_totale_positivi;

	panelGuariti.innerHTML = dataset[0].dimessi_guariti;
	panelIncrementoGuariti.innerHTML = incrementoGuariti;

	panelDeceduti.innerHTML = dataset[0].deceduti;
	panelIncrementoDeceduti.innerHTML = incrementoDeceduti;

	panelOspedalizzati.innerHTML = dataset[0].totale_ospedalizzati;
	panelIncrementoOspedalizzati.innerHTML = incrementoOspedalizzati;
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

// Disegna il grafico basato sul dataset
function drawChart(chartID, dataset, filter) {
	var ctx = document.getElementById(chartID).getContext('2d');

	let labels = [];
	let dataConf = [];

	for(const prop of filter.properties) {
		if(prop === "data") {
			continue;
		}
		let color = randomHexColor();
		let element = {
			label: prop,
			backgroundColor: color,
			borderColor: color,
			data: [],
			fill: false,
		};
		dataConf.push(element);
	}

	if(dataset.length > 0) {
		for(const data of dataset) {
			for(const prop in data) {
				// Apply properties filter
				if(filter) {
					if(filter.properties && !filter.properties.includes(prop)) {
						continue;
					}
				}

				if(prop === "data") {
					let timestamp = new Date(data[prop]);
					let value = timestamp.getDate() + "/" + (timestamp.getMonth()+1) + "/" + timestamp.getFullYear();
					labels.push(value);
				} else {
					//values.push(data[prop]);
					for(let i = 0; i < dataConf.length; i++) {
						if(dataConf[i].label === prop) {
							dataConf[i].data.push(data[prop]);
						}
					}
				}
			}
		}
	}
	var config = {
		type: 'line',
		data: {
			labels: labels,
			datasets: dataConf,
		},
		options: {
			elements: {
				point: {
					radius: 0,
				},
			},
			legend: {
				display: true,
				labels: {
					fontColor: '#FFFFFF',
				},
			},
			responsive: true,
			title: {
				display: true,
				text: "Grafico dell'andamento",
			},
			tooltips: {
				mode: 'index',
				intersect: false,
			},
			hover: {
				mode: 'nearest',
				intersect: true
			},
			scales: {
				xAxes: [{
					ticks: {
						fontColor: '#FFFFFF',
					},
					gridLines: {
						color: '#616161',
					},
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Giorni'
					}
				}],
				yAxes: [{
					ticks: {
						fontColor: '#FFFFFF',
					},
					gridLines: {
						color: '#616161',
					},
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Valori'
					}
				}]
			}
		}
	};
	var chart = new Chart(ctx, config);
}

// Aggiunge i dati del dataset alla tabella
function applyDataset(dataset, filter) {
	let tableHead = document.getElementById("tableHead");
	let tableBody = document.getElementById("tableBody");

	if(tableHead && dataset.length > 0) {
		let data = dataset[0];
		for(const prop in data) {
			// Apply properties filter
			if(filter) {
				if(filter.properties && !filter.properties.includes(prop)) {
					continue;
				}
			}

			let name = prop;
			name = name.replace("_", " ");

			let th = document.createElement('th');
			let text = document.createTextNode(name);
			th.append(text);
			tableHead.append(th);
		}
	}

	if(tableBody && dataset.length > 0) {
		let row;
		for(const data of dataset) {
			row = document.createElement('tr');
			for(const prop in data) {
				// Apply properties filter
				if(filter) {
					if(filter.properties && !filter.properties.includes(prop)) {
						continue;
					}
				}

				let value = data[prop];

				if(prop === "data") {
					let timestamp = new Date(data[prop]);
					value = timestamp.getDate() + "/" + (timestamp.getMonth()+1) + "/" + timestamp.getFullYear();
				}

				let td = document.createElement('td');
				let text = document.createTextNode(value);
				td.append(text);
				row.append(td);
			}
			tableBody.append(row);
		}
	}
}

// Restituisce un colore casuale in HEX string
function randomHexColor() {
	//const randomColor = Math.floor(Math.random()*16777215).toString(16);
	//return "#"+randomColor

	var colors = [
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