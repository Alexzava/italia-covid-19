/*
	Funzioni specifiche per struttura e il funzionamento della pagina principale.

	
	Progetto in fase di sviluppo, il codice potrebbe cambiare.
*/

// Regioni italiane
// I numeri verdi fanno riferimento alla pagina dedicata del Ministero della Salute (salute.gov.it)
var listaRegioni ={
	"Abruzzo":{"numero_verde":"L’Aquila:118, Chieti-Lanciano-Vasto: 800 860 146, Pescara: 118, Teramo: 800 090 147"},
	"Basilicata":{"numero_verde":"800 99 66 88 "},
	"Bolzano":{"numero_verde":"800 751 751"},
	"Calabria":{"numero_verde":"800 76 76 76"},
	"Campania":{"numero_verde":"800 90 96 99 "},
	"Emilia Romagna":{"numero_verde":"800 033 033"},
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
	"Trento":{"numero_verde":"800 867 388"},
	"Umbria":{"numero_verde":"800 63 63 63"},
	"Valle d'Aosta":{"numero_verde":"800 122 121"},
	"Veneto":{"numero_verde":"800 462 340"},
};
var numero_nazionale = "1500";
var isMobile = false;

window.onload = function() {
	// Controllo se mobile
	if(screen.width <= 900)
		isMobile = true;

	// Aggiunge le regioni al menu
	var menuRegioni = document.getElementById("listaRegioni");
	var regioni = Object.keys(listaRegioni);
	for(var i = 0; i < regioni.length; i++) {
		var link = document.createElement("a");
		link.setAttribute("class", "dropdown-item");
		link.setAttribute("href", "?regione="+regioni[i]);
		link.innerHTML = regioni[i];
		menuRegioni.appendChild(link);
	}

	// Controlla i parametri url
	// Se contiene il parametro "regione", visualizza i dati regionali
	// Altrimenti visualizza i dati nazionali
	var searchParams = new URLSearchParams(window.location.search);
	if(searchParams.has("regione") && searchParams.get("regione")) {
		initDatiRegionali(function() {
			var regione = searchParams.get("regione");
			// Aggiorna alert box
			var numero = listaRegioni[regione]["numero_verde"];
			if(numero === "")
				numero = numero_nazionale;
			setAlertBox("alertBox", "Numero dedicato all'emergenza COVID-19: ", numero);
			// Crea grafici e box con gli ultimi dati
			var datiRegione = filterRegione(datiRegionali, regione);
			createChart(datiRegione, "Dati regione " + regione);
			setBoxes(datiRegione);

			// Nasconde il loader e mostra i grafici
			hideLoader();
		});
	} else {
		initDatiNazionali(function() {
			// Aggiorna alert box
			setAlertBox("alertBox", "Numero nazionale dedicato all'emergenza COVID-19:", numero_nazionale);
			// Crea grafici e box con gli ultimi dati
			createChart(datiNazionali, "Dati nazionali");
			setBoxes(datiNazionali);

			// Nasconde il loader e mostra i grafici
			hideLoader();
		});
	}
};

// Crea i grafici nella pagina principale
// data => dataset convertito (Vedi dataset.js => datasetConversion())
function createChart(data, label) {
	// Se da mobile mostra gli ultimi 3 giorni
	if(isMobile)
		data = sliceDataset(data, (data.length-3), data.length);
	
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
	var totale_attualmente_positivi = datasetsParametro(data, "totale_attualmente_positivi", "Totale attualmente positivi", "#00FF00");

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
	drawChart("totale_attualmente_positivi", totale_attualmente_positivi);

	// Imposta il titolo della pagina
	document.getElementById("titoloPagina").innerHTML = label;
}

// Aggiunge titolo e messaggio ad un alert box
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
	var totale_attualmente_positivi = datasetGetLastValue(data, "totale_attualmente_positivi");
	var deceduti = datasetGetLastValue(data, "deceduti");
	var totale_ospedalizzati = datasetGetLastValue(data, "totale_ospedalizzati");

	document.getElementById("box_totale_casi").innerHTML = totale_casi;
	document.getElementById("box_totale_attualmente_positivi").innerHTML = totale_attualmente_positivi;
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

// Nasconde il loader e mostra i grafici
function hideLoader() {
	document.getElementById("loader").style = "display: none;";
	document.getElementById("mainContainer").style = "display: block;";
}