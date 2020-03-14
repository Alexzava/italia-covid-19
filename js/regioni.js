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

// Restituisce un array con i nomi di tutte le regioni
// data => datiRegionali (vedi dataset.js)
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
// data => datiRegionali (vedi dataset.js)
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

// Restituisce la regione con il parametro più elevato
// data => datiReginali (vedi dataset.js)
// parametro => string
// return { parametro: "valore", denominazione_regione: "Regione" }
function regioniMaxParametro(data, parametro) {
	var regioni = getRegioni(data);
	var recenti = [];

	// Filtra i valori per i più recenti
	for(var i = 0; i < regioni.length; i++) {
		var datiRegione = filterRegione(data, regioni[i]);
		datiRegione = datiRegione[datiRegione.length-1];
		recenti.push(Object.values(datiRegione)[0]);
	}
	// Filtre le regioni per il parametro specificato
	var result = {};
	result[parametro] = 0;
	for(var i = 0; i < recenti.length; i++) {
		if(recenti[i][parametro] > result[parametro]){
			result[parametro] = recenti[i][parametro];
			result["denominazione_regione"] = recenti[i]["denominazione_regione"];
		}
	}
	return result;
}

// Restituisce i dati più recenti di tutte le regioni
// data => datiRegionali (vedi dataset.js)
// return [{Regione:{parametro:"valore",...}},...]
function getRegioniRecentData(data) {
	var regioni = getRegioni(data);
	//  [{Regione:{parametro:"valore",...}},...]
	var recenti = [];

	// Filtra i valori per i più recenti
	for(var i = 0; i < regioni.length; i++) {
		var datiRegione = filterRegione(data, regioni[i]);
		datiRegione = datiRegione[datiRegione.length-1];
		var key = Object.keys(datiRegione)[0];
		var nomeRegione = datiRegione[key]["denominazione_regione"];
		var obj = {};
		obj[nomeRegione] = datiRegione[key];
		recenti.push(obj);
	}
	return recenti;
}