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
			setDatasetLastUpdate(dataset);
			let newDataset = sliceDataset(dataset, 0, lastDays);
			setTable(newDataset, {properties: prop});

			setDashboardBoxes(newDataset);

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
			setDatasetLastUpdate(dataset);
			newDataset = sliceDataset(newDataset, 0, lastDays);
			setTable(newDataset, {properties: prop});

			setDashboardBoxes(newDataset);

			// Inverto il dataset al suo stato iniziale (Ordine cronologico)
			newDataset.reverse();
			drawChart("chart", newDataset, {properties: prop});
		});
	}
}

function setDatasetLastUpdate(dataset) {
	let datasetLastUpdate = document.getElementById('datasetLastUpdate');
	if(datasetLastUpdate && dataset[0].data) {
		let timestamp = new Date(dataset[0].data);
		let value = timestamp.getDate() + "/" + (timestamp.getMonth()+1) + "/" + timestamp.getFullYear();
		datasetLastUpdate.innerHTML = value;
	}
}

// Applica i filtri selezionati nel form
function filtersFormOnSubmit(event) {
	event.preventDefault();
	let filters = document.getElementsByClassName('filter-checkbox');
	let params = [];
	for(const checkbox of filters) {
		if(checkbox.checked) {
			params.push(checkbox.value);
		}
	}
	let daysInput = document.getElementById('days');
	if(daysInput && daysInput.value.length > 0) {
		window.location.href = baseUrl + "prop=" + params.join() + "&days=" + daysInput.value + "#chart";
	} else {
		window.location.href = baseUrl + "prop=" + params.join() + "#chart";
	}
}

// Mostra i dati più recenti nei pannelli dashboard
function setDashboardBoxes(dataset) {
	// Dati box standard pagina dashboard
	let boxTotaliPositivi = document.getElementById('boxTotaliPositivi');
	let boxIncrementoPositivi = document.getElementById('boxIncrementoPositivi');

	let boxGuariti = document.getElementById('boxGuariti');
	let boxIncrementoGuariti = document.getElementById('boxIncrementoGuariti');

	let boxDeceduti = document.getElementById('boxDeceduti');
	let boxIncrementoDeceduti = document.getElementById('boxIncrementoDeceduti');

	let boxTotaleCasi = document.getElementById('boxTotaleCasi');
	let boxIncrementoTotaleCasi = document.getElementById('boxIncrementoTotaleCasi');

	dataset = sliceDataset(dataset, 0, 2);

	let incrementoGuariti = dataset[0].dimessi_guariti - dataset[1].dimessi_guariti;
	let incrementoDeceduti = dataset[0].deceduti - dataset[1].deceduti;

	boxTotaliPositivi.innerHTML = dataset[0].totale_positivi;
	boxIncrementoPositivi.innerHTML = dataset[0].variazione_totale_positivi;

	boxGuariti.innerHTML = dataset[0].dimessi_guariti;
	boxIncrementoGuariti.innerHTML = incrementoGuariti;

	boxDeceduti.innerHTML = dataset[0].deceduti;
	boxIncrementoDeceduti.innerHTML = incrementoDeceduti;

	boxTotaleCasi.innerHTML = dataset[0].totale_casi;
	boxIncrementoTotaleCasi.innerHTML = dataset[0].nuovi_positivi;

	// Dati box avanzato dashboard
	let boxTotaleOspedalizzati = document.getElementById('boxTotaleOspedalizzati');
	let boxIncrementoOspedalizzati = document.getElementById('boxIncrementoOspedalizzati');
	let incrementoOspedalizzati = dataset[0].totale_ospedalizzati - dataset[1].totale_ospedalizzati;
	boxTotaleOspedalizzati.innerHTML = dataset[0].totale_ospedalizzati
	boxIncrementoOspedalizzati.innerHTML = incrementoOspedalizzati;

	let boxIntensiva = document.getElementById('boxIntensiva');
	let boxIncrementoIntensiva = document.getElementById('boxIncrementoIntensiva');
	let incrementoIntensiva = dataset[0].terapia_intensiva - dataset[1].terapia_intensiva;
	boxIntensiva.innerHTML = dataset[0].terapia_intensiva;
	boxIncrementoIntensiva.innerHTML = incrementoIntensiva;

	let boxIsolamentoDomiciliare = document.getElementById('boxIsolamentoDomiciliare');
	let boxIncrementoIsolamentoDomiciliare = document.getElementById('boxIncrementoIsolamentoDomiciliare');
	let incrementoIsolamento = dataset[0].isolamento_domiciliare - dataset[1].isolamento_domiciliare;
	boxIsolamentoDomiciliare.innerHTML = dataset[0].isolamento_domiciliare;
	boxIncrementoIsolamentoDomiciliare.innerHTML = incrementoIsolamento;


	let boxTamponi = document.getElementById('boxTamponi');
	let boxIncrementoTamponi = document.getElementById('boxIncrementoTamponi');
	// Grazie Gabri :)
	let incrementoTamponi = dataset[0].tamponi - dataset[1].tamponi;
	//let rapportoTamponiPositivi = ((dataset[0].nuovi_positivi/tamponiGiornalieri)*100).toFixed(1);
	boxTamponi.innerHTML = dataset[0].tamponi;
	boxIncrementoTamponi.innerHTML = incrementoTamponi;
}

// Disegna il grafico basato sul dataset
function drawChart(chartID, dataset, filter) {
	let ctx = document.getElementById(chartID).getContext('2d');

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
	let config = {
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
	let chart = new Chart(ctx, config);
}

// Aggiunge i dati del dataset alla tabella
function setTable(dataset, filter) {
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