window.onload = init;

function init() {
	setRegioniNavbar();
	$('[data-toggle="tooltip"]').tooltip();
	let categoryNode = document.getElementById("category");
	if(categoryNode) {
		let category = categoryNode.getAttribute("data-category")
		if(category === "generic") {
			hidePreloader();
		} else if(category === "nazionale" || category === "regionale") {
			$.getScript("/js/andamento.js", function() {
				doDataset(category);
				hidePreloader();
			});
		}
	}
}

function setRegioniNavbar() {
	let navItems = document.getElementsByClassName('regioniDropdown');
	if(navItems) {
		for(let btn of navItems) {
			for(const regione of regioni) {
				let element = document.createElement('a');
				element.classList.add('dropdown-item');
				element.href = "/andamento-regionale/?regione=" + regione.codice_regione;

				let text = document.createTextNode(regione.denominazione_regione);
				element.append(text);
				btn.append(element);
			}
		}
	}
}

function hidePreloader() {
	let preloader = document.getElementById('preloader');
	if(preloader) {
		$('#preloader').fadeToggle("slow", "linear");
	}
}