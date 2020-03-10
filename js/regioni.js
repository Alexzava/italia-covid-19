/*
	Funzioni specifiche per la manipolazione dei dati regionali

	Progetto in fase di sviluppo, il codice potrebbe cambiare.
*/

// Filtra i dati per una regione specifica
// data => datiRegionali (vedi dataset.js)
// regione => string
// return dataset filtrato
function filterRegione(data, regione) {
	var datiRegione = [];
	for(var i = 0; i < data.length; i++) {
		var key = Object.keys(data[i])[0];
		if(data[i][key]["denominazione_regione"] == regione) {
			var datiGiorno = {};
			datiGiorno[key] = data[i][key];
			datiRegione.push(datiGiorno);
		}
	}
	return datiRegione;
}

// Funzione sperimentale!
// Restituisce {denominazione_regione:NOME, parametro:numero} del parametro specificato maggiore tra tutte le regioni
// data => datiRagionali
// parametro => string
function getMaxParametroRegioni(data, parametro) {
	var regione = {};
	regione["denominazione_regione"] = "";
	regione[parametro] = "0";
	for(var i = 0; i < data.length; i++) {
		var giorno = Object.keys(data[i])[0];
		if(data[i][giorno][parametro] > regione[parametro]) {
			regione["denominazione_regione"] = data[i][giorno]["denominazione_regione"];
			regione[parametro] = data[i][giorno][parametro];
		}
	}
	return regione;
}

// Funzione sperimentale!
// Restituisce {denominazione_regione:NOME, parametro:numero} del parametro specificato minore tra tutte le regioni
// data => datiRagionali
// parametro => string
function getMinParametroRegioni(data, parametro) {
	var regione = {};
	regione["denominazione_regione"] = "";
	regione[parametro] = "999999";
	for(var i = 0; i < data.length; i++) {
		var giorno = Object.keys(data[i])[0];
		if(data[i][giorno][parametro] < regione[parametro]) {
			regione["denominazione_regione"] = data[i][giorno]["denominazione_regione"];
			regione[parametro] = data[i][giorno][parametro];
		}
	}
	return regione;
}

// Restituisce un array con i nomi di tutte le regioni
// data => datiRegionali
// return ["Liguria","Toscana", ...] (Non in ordine alfabetico)
function getRegioni(data) {
	var regioni = [];
	for(var i = 0; i < data.length; i++) {
		var giorno = Object.keys(data[i])[0];
		regioni.push(data[i][giorno]["denominazione_regione"]);
	}
	return [...new Set(regioni)]; // Elimina eventuali ripetizioni
}

// Verifica se una regione è presente nel dataset
// data => datiRegionali
// regione => string
// return bool
function checkRegione(data, regione) {
	var regioni = getRegioni(data);
	for(var i = 0; i < regioni.length; i++) {
		if(regione == regioni[i])
			return true
	}
	return false;
}