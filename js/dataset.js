/*
	Funzioni per il download e la manipolazione dei dati forniti dal Dipartimento della Protezione Civile.

	Progetto in fase di sviluppo, il codice potrebbe cambiare.
*/

/*
	datiRegionali
	[
		{2020-02-24 18:00:00:{denominazione_regione: "Abruzzo", deceduti: "0", dimessi_guariti: "0", … }},
		...
	]
*/
var datiRegionali = [];
/*
	datiNazionali
	[
		{2020-02-24 18:00:00:{deceduti: "7", dimessi_guariti: "1", isolamento_domiciliare: "94", …}},
		...
	]
*/
var datiNazionali = [];

var urlDatiRegionali = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
var urlDatiNazionali = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-andamento-nazionale/dpc-covid19-ita-andamento-nazionale.csv";

// Scarica sia i dati nazionali che i regionali, poi esegue la conversione
function init(callback) {
	d3.csv(urlDatiRegionali)
	.then(function(datiReg) {
		datiRegionali = datasetConversion(datiReg);
		d3.csv(urlDatiNazionali)
		.then(function(datiNaz){
			datiNazionali = datasetConversion(datiNaz);
			if(callback && typeof callback === 'function')
				callback();
		});
	});
}

// Scarica i dati regionali, poi esegue la conversione
function initDatiRegionali(callback) {
	d3.csv(urlDatiRegionali)
	.then(function(datiReg) {
		datiRegionali = datasetConversion(datiReg);
		if(callback && typeof callback === 'function')
			callback();
	});
}

// Scarica solo i dati nazionali, poi esegue la conversione
function initDatiNazionali(callback) {
	d3.csv(urlDatiNazionali)
	.then(function(datiNaz){
		datiNazionali = datasetConversion(datiNaz);
		if(callback && typeof callback === 'function')
			callback();
	});
}

// Converte i dati scaricati dalla repository della Protezione Civile
// Elimina le informazioni superflue
// data => dataset scaricato
// return dataset convertito
/*
	dataset convertito
	[
		{"2020-03-10 18:00:00": { deceduti: "631", dimessi_guariti: "1004", isolamento_domiciliare: "2599", … }},
		...
	]
*/
function datasetConversion(data) {
	var outData = [];
	for(var i = 0; i < data.length; i++) {
		var giorno = {};
		giorno[data[i]["data"]] = {
			"denominazione_regione": data[i]["denominazione_regione"],
			"deceduti": data[i]["deceduti"],
			"dimessi_guariti": data[i]["dimessi_guariti"],
			"isolamento_domiciliare": data[i]["isolamento_domiciliare"],
			"ricoverati_con_sintomi": data[i]["ricoverati_con_sintomi"],
			"tamponi": data[i]["tamponi"],
			"terapia_intensiva": data[i]["terapia_intensiva"],
			"totale_attualmente_positivi": data[i]["totale_attualmente_positivi"],
			"totale_casi": data[i]["totale_casi"],
			"totale_ospedalizzati": data[i]["totale_ospedalizzati"],
		};
		outData.push(giorno);
	}
	return outData;
}

// Seleziona una porzione del dataset convertito
// data => dataset convertito (vedi datasetConversion())
// from => int
// to => int
// return porzione di dataset
function sliceDataset(data, from, to) {
	if(to > data.length || from < 0)
		return undefined;
	return data.slice(from, to);
}

// Crea un dataset per il grafico riguardo uno specifico parametro
// data => dataset converito (vedi datasetConversion())
// parametro => string
// label => string
// color => string (HEX)
// return dataset per il grafico
function datasetsParametro(data, parametro, label, color) {
	var dataLabels = []; // Giorni
	var dataValues = []; // Numero di casi per giorno

	// Crea i dataLabels
	for(var i = 0; i < data.length; i++) {
		var giorno = Object.keys(data[i])[0];
		dataLabels.push(giorno);
		dataValues.push(data[i][giorno][parametro]);
	}

	return {
		labels: dataLabels,
		datasets: [{
			label: label,
			data: dataValues,
			backgroundColor: color,
		}],
	};
}

// Disegna il grafico con il dataset fornito
// chartID => id canvas
// data => dataset converito (vedi datasetConversion() e datasetsParametro())
function drawChart(chartID, data) {
	var chart = new Chart(chartID, {
		type: 'bar',
		data: data,
		options: {
			legend: {
				display: true,
				labels: {
					fontColor: '#FFFFFF',
				},
			},
			scales: {
				yAxes: [{
					ticks: {
						fontColor: '#FFFFFF',
					},
					gridLines: {
						color: '#616161',
					},
				}],
				xAxes: [{
					ticks: {
						fontColor: '#FFFFFF',
					},
					gridLines: {
						color: '#616161',
					},
				}],
			},
			plugins: {
	            datalabels: {
	            	color: '#FFFFFF',
	            	anchor: 'end',
	            },
	        },
		}
	});
}