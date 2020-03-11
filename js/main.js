/*
	Funzioni specifiche per struttura e il funzionamento della pagina principale.

	
	Progetto in fase di sviluppo, il codice potrebbe cambiare.
*/

// Regioni italiane
var listaRegioni =[
	"Abruzzo",
	"Basilicata",
	"Bolzano",
	"Calabria",
	"Campania",
	"Emilia Romagna",
	"Friuli Venezia Giulia",
	"Lazio",
	"Liguria",
	"Lombardia",
	"Marche",
	"Molise",
	"Piemonte",
	"Puglia",
	"Sardegna",
	"Sicilia",
	"Toscana",
	"Trento",
	"Umbria",
	"Valle d'Aosta",
	"Veneto"
];

var isMobile = false;


window.onload = function() {
	// Controllo se mobile
	if(screen.width <= 900)
		isMobile = true;

	// Aggiunge le regioni al menu
	var menuRegioni = document.getElementById("listaRegioni");
	for(var i = 0; i < listaRegioni.length; i++) {
		var link = document.createElement("a");
		link.setAttribute("class", "dropdown-item");
		link.setAttribute("href", "?regione="+listaRegioni[i]);
		link.innerHTML = listaRegioni[i];
		menuRegioni.appendChild(link);
	}

	// Controlla i parametri url
	// Se contiene il parametro "regione", visualizza i dati regionali
	// Altrimenti visualizza i dati nazionali
	var searchParams = new URLSearchParams(window.location.search);
	if(searchParams.has("regione") && searchParams.get("regione")) {
		initDatiRegionali(function() {
			var datiRegione = filterRegione(datiRegionali, searchParams.get("regione"));
			createChart(datiRegione, "Dati regione " + searchParams.get("regione"));
			setBoxes(datiRegione);
		});
	} else {
		initDatiNazionali(function() {
			createChart(datiNazionali, "Dati nazionali");
			setBoxes(datiNazionali);
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


function setBoxes(data) {
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