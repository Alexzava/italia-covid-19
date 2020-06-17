/*
	Funzioni specifiche per struttura e il funzionamento della pagina principale.

	
	Progetto in fase di sviluppo, il codice potrebbe cambiare.
*/

// Regioni italiane
// I numeri verdi fanno riferimento alla pagina dedicata del Ministero della Salute (salute.gov.it)
var listaRegioni ={
	"Abruzzo":{"numero_verde":"L’Aquila:118, Chieti-Lanciano-Vasto: 800 860 146, Pescara: 118, Teramo: 800 090 147"},
	"Basilicata":{"numero_verde":"800 99 66 88 "},
	"P.A. Bolzano":{"numero_verde":"800 751 751"},
	"Calabria":{"numero_verde":"800 76 76 76"},
	"Campania":{"numero_verde":"800 90 96 99 "},
	"Emilia-Romagna":{"numero_verde":"800 033 033"},
	"Friuli Venezia Giulia":{"numero_verde":"800 500 300"},
	"Lazio":{"numero_verde":"800 11 88 00"},
	"Liguria":{"numero_verde":""},
	"Lombardia":{"numero_verde":"800 89 45 45"},
	"Marche":{"numero_verde":"800 93 66 77"},
	"Molise":{"numero_verde":"0874 313000 e 0874 409000"},
	"Piemonte":{"numero_verde":"800 19 20 20"},
	"Puglia":{"numero_verde":"800 713 931"},
	"Sardegna":{"numero_verde":"800 311 377"},
	"Sicilia":{"numero_verde":"800 45 87 87"},
	"Toscana":{"numero_verde":"800 55 60 60"},
	"P.A. Trento":{"numero_verde":"800 867 388"},
	"Umbria":{"numero_verde":"800 63 63 63"},
	"Valle d'Aosta":{"numero_verde":"800 122 121"},
	"Veneto":{"numero_verde":"800 462 340"},
};
var numero_nazionale = "1500";
var isMobile = false;

window.onload = function() {
	// Controllo se mobile
	if(screen.width <= 900) {
		isMobile = true;
		// Nasconde la pagina "dati regionali" dal menu
		// Non visualizzabile da mobile per via della grande quantità di dati da visualizzare
		hideElement('datiRegionaliNav');
	}

	// Aggiunge le regioni al menu
	var menuRegioni = document.getElementById("listaRegioni");
	var regioni = Object.keys(listaRegioni);
	for(var i = 0; i < regioni.length; i++) {
		var link = document.createElement("a");
		link.setAttribute("class", "dropdown-item");
		link.setAttribute("href", "?q="+regioni[i]);
		link.innerHTML = regioni[i];
		menuRegioni.appendChild(link);
	}

	// Controlla i parametri url
	// Se non sono presenti mostra i dati nazionali
	var searchParams = new URLSearchParams(window.location.search);
	if(searchParams.has("q") && searchParams.get("q")) {
		initDatiRegionali(function() {
			var regione = searchParams.get("q");
			if(regione === "riepilogo") {
				// Mostra il repilogo dei dati regionali
				var datiRecenti = getRegioniRecentData(datiRegionali);
				createChart(datiRecenti, "Dati regionali");

				hideElement("boxRow");
				hideElement("loader");
				showElement("mainContainer");
			} else {
				// Mostra i dati delle singole regioni

				// Crea grafici e box con gli ultimi dati
				var datiRegione = filterRegione(datiRegionali, regione);
				createChart(datiRegione, "Dati regione " + regione);
				setBoxes(datiRegione);
			}
			// Nasconde il loader e mostra i grafici
			hideElement("loader");
			showElement("mainContainer");
		});
	} else {
		// Mostra i dati nazionali
		initDatiNazionali(function() {
			// Crea grafici e box con gli ultimi dati
			createChart(datiNazionali, "Dati nazionali");
			setBoxes(datiNazionali);

			// Nasconde il loader e mostra i grafici
			hideElement("loader");
			showElement("mainContainer");
		});
	}
};

// Crea i grafici nella pagina principale
// data => dataset convertito (Vedi dataset.js => datasetConversion())
function createChart(data, label) {
	// Se da mobile mostra gli ultimi 4 giorni, altrimenti mostra i dati degli ultimi 30 giorni
	if(isMobile)
		data = sliceDataset(data, (data.length-4), data.length);
	else
		data = sliceDataset(data, (data.length-30), data.length);
	
	// Crea datasets per i grafici
	var totale_casi = datasetsParametro(data, "totale_casi", "Casi totali", "#FF0000");
	var deceduti = datasetsParametro(data, "deceduti", "Deceduti", "#2196F3");
	var dimessi_guariti = datasetsParametro(data, "dimessi_guariti", "Dismessi guariti", "#66BB6A");
	var tamponi = datasetsParametro(data, "tamponi", "Tamponi effettuati", "#FBC02D");
	var isolamento_domiciliare = datasetsParametro(data, "isolamento_domiciliare", "Isolamento domiciliare", "#FF5722");
	var ricoverati_con_sintomi = datasetsParametro(data, "ricoverati_con_sintomi", "Ricoverati con sintomi", "#607D8B");
	var terapia_intensiva = datasetsParametro(data, "terapia_intensiva", "Ricoverati in terapia intensiva", "#00838F");
	var totale_ospedalizzati = datasetsParametro(data, "totale_ospedalizzati", "Totale degli ospedalizzati", "#FF8F00");
	//var nuovi_attualmente_positivi = datasetsParametro(data, "nuovi_attualmente_positivi", "Nuovi attualmente positivi", "#FF0000");
	var totale_positivi = datasetsParametro(data, "totale_positivi", "Totale attualmente positivi", "#00FF00");

	// Disegna i grafici
	drawChart("totale_casi", totale_casi);
	drawChart("deceduti", deceduti);
	drawChart("dimessi_guariti", dimessi_guariti);
	drawChart("tamponi", tamponi);
	drawChart("isolamento_domiciliare", isolamento_domiciliare);
	drawChart("ricoverati_con_sintomi", ricoverati_con_sintomi);
	drawChart("terapia_intensiva", terapia_intensiva);
	drawChart("totale_ospedalizzati", totale_ospedalizzati);
	//drawChart("nuovi_attualmente_positivi", nuovi_attualmente_positivi);
	drawChart("totale_positivi", totale_positivi);

	// Imposta il titolo della pagina
	document.getElementById("titoloPagina").innerHTML = label;
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

// Aggiunge titolo e messaggio ad un alert box (vedi index.html come esempio)
// boxID => string
// title => string
// message => string
function setAlertBox(boxID, title, message) {
	var alert = document.getElementById(boxID);
	alert.innerHTML = alert.innerHTML.replace("$title$", title);
	alert.innerHTML = alert.innerHTML.replace("$message$", message);
}

// Aggiorna gli utlimi dati nei box
// data => dataset convertito (Vedi dataset.js => datasetConversion())
function setBoxes(data) {
	// Prende gli ultimi dati dal dataset
	var totale_casi = datasetGetLastValue(data, "totale_casi");
	var totale_positivi = datasetGetLastValue(data, "totale_positivi");
	var deceduti = datasetGetLastValue(data, "deceduti");
	var totale_ospedalizzati = datasetGetLastValue(data, "totale_ospedalizzati");

	document.getElementById("box_totale_casi").innerHTML = totale_casi;
	document.getElementById("box_totale_positivi").innerHTML = totale_positivi;
	document.getElementById("box_deceduti").innerHTML = deceduti;
	document.getElementById("box_totale_ospedalizzati").innerHTML = totale_ospedalizzati;
}

// Nasconde un grafico specifico
function hideChart(e) {
	e.parentNode.parentNode.style = "display: none;";
}

// Zoom(+)/Zoom(-) per un grafico specifico
function zoomChart(e) {
	var parent = e.parentNode.parentNode;
	if(parent.getAttribute("class") == "col-md-6") {
		parent.setAttribute("class", "col-md-10");
	} else {
		parent.setAttribute("class", "col-md-6");
	}
}

// Nasconde un elemento
function hideElement(e) {
	document.getElementById(e).style = "display: none;";
}

// Mostra un elemento
function showElement(e) {
	document.getElementById(e).style = "display: block;";
}