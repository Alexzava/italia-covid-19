# Italia COVID-19

*La documentazione è in fase di scrittura*


## Come implementare il codice

```html
<!DOCTYPE html>
<html>
<head>
	<script src="js/const.js"></script>
	<script src="js/utils.js"></script>
</head>
<body>
	<!-- ... -->
</body>
</html>
```

### Andamento nazionale
```javascript
window.onload = function() {
	getDataset(andamentoNazionaleUrl, (dataset) => {
		// Ordinare il dataset dal giorno più recente
		dataset.reverse();

		// ...
	});
};
```


### Andamento per regione
```javascript
window.onload = function() {
	getDataset(andamentoRegioniUrl, (dataset) => {
		// Ordinare il dataset dal giorno più recente
		dataset.reverse();

		let codiceRegione = 3;
		let datasetRegione = filterDatasetRegione(codiceRegione, dataset);

		// ...
	});
};
```

## Documentazione

### Costanti (const.js)

```javascript
const andamentoNazionaleUrl

const andamentoRegioniUrl

const regioni
```

### Funzioni (utils.js)

```javascript
function getDataset(url, callback)
```

Legge il dataset dalla repo del Dipartimento di Protezione Civile

* *url* - string
* *callback* - function
* *return* - Array[{...}, {...}]

---

```javascript
function filterDatasetRegione(codiceRegione, dataset)
```

Filtra il dataset per una regione specifica

* *codiceRegione* - int
* *dataset* - Array[{...}, {...}]
* *return* - Array[{...}, {...}]

---

```javascript
function sliceDataset(dataset, from, to)
```

Ritorna la porzione di array specificata

* *dataset* - Array[{...}, {...}]
* *from* - int
* *to* - int
* *return* - Array[{...}, {...}]
