$(function() {
	$("input[type='checkbox']").change(function() {
		$(this).closest('tr').toggleClass("highlight", this.checked)
		toggleSpell($(this).attr('id'));
	});
});

document.querySelector('#spells')
	.addEventListener('click', (ev) => {
		const [x, y] = [
			ev.target.cellIndex,
			ev.target.parentElement.rowIndex
		];
		if (x === undefined || y === undefined) {
			return;
		}
		if (x != 0) {
			return;
		}
		if (y == 0) {
			return;
		}
		document.getElementById(y).click()
	});

$(function() {
	$("input[type='radio']").change(function() {
		gridPage = $(this).val();
		displayPage();
	});
});

document.querySelector('#spellsGrid')
	.addEventListener('click', (ev) => {
		const [x, y] = [
			ev.target.cellIndex,
			ev.target.parentElement.rowIndex
		];
		if (x === undefined || y === undefined) {
			return;
		}
		var spellID = ((x + 1) + (4 * y) + (16 * (gridPage - 1)));
		if (spellID > maxSpells) {
			return;
		} // clicked empty slot at last page
		var currentCell = $("#c" + ((x + 1) + (4 * y)));
		// highlight the spell as clicked
		currentCell.toggleClass("highlightCell");
		toggleSpell(spellID);

	});

function toggleMode() {
	if (gridMode) {
		gridMode = false; // go back to normal view
		loadSpells();
	} else {
		gridMode = true; // enter grid selection
		// set grid's displayed spells based on page
		displayPage();
	}
	$("#divGrid").toggle();
	$("#divSpells").toggle();
}

function selectAll() { // for length of encodeCompatLength, set query to '_'
	console.log("selectAll prior state: " + spells);
	var loopSpell = "";
	for (let i = 0; i < encodeCompatLength; i++) {
		loopSpell += '_';
	}
	spells = urlDecode(loopSpell);
	setQueryVariable("spells", loopSpell);
	if (gridMode) {
		displayPage();
	} else {
		loadSpells();
	}
}

function clearAll() { // for length of encodeCompatLength, set query to 'A'
	console.log("clearAll prior state: " + spells);
	var loopSpell = "";
	for (let i = 0; i < encodeCompatLength; i++) {
		loopSpell += 'A';
	}
	spells = urlDecode(loopSpell);
	setQueryVariable("spells", loopSpell);
	if (gridMode) {
		displayPage();
	} else {
		loadSpells();
	}
}

function displayPage() {
	$(".highlightCell").toggleClass("highlightCell");
	var currentCell = null;
	var spellID = 0;
	for (var i = 1; i < 17; i++) {
		currentCell = $("#c" + i);
		spellID = i + (16 * (gridPage - 1));
		if (spellID > maxSpells) { // empty slot on last page
			currentCell.text("");
			continue;
		}
		if (spells.charAt(spellID - 1) == 1) {
			currentCell.toggleClass("highlightCell");
		}
		currentCell.text("#" + spellID);
	}
}

function getQueryVariable(input) {
	let url = new URL(location.href);
	let params = new URLSearchParams(url.search);
	if (params.has(input)) {
		return params.get(input);
	}
	return false;
}

function setQueryVariable(paramName, paramValue) {
	let url = new URL(location.href);
	let params = new URLSearchParams(url.search);
	params.set(paramName, paramValue)
	window.history.replaceState('', '', "?" + params);
	//console.log("spells updated: " + paramValue);
	return;
}

function toggleSpell(spellID) {
	//console.log("spell toggle: " + spellID);
	var spellState = (spells.charAt(spellID - 1));
	// set spellID to spellState
	if (spellState == 1) {
		spells = setCharAt(spells, spellID - 1, '0');
		checkedTotal -= 1;
	} else {
		spells = setCharAt(spells, spellID - 1, '1');
		checkedTotal += 1;
	}
	setQueryVariable("spells", urlEncode(spells));
	updateCounter();
}

function setCharAt(str, index, chr) {
	//console.log("setChar: " + str + ", " + index + ", from char: " + chr);
	if (index > str.length - 1) return str;
	return str.substring(0, index) + chr + str.substring(index + 1);
}

function urlEncode(input) {
	// binary to ascii
	var result = "";
	var arr = input.match(/.{1,8}/g);
	for (var i = 0; i < arr.length; i++) {
		result += String.fromCharCode(parseInt(arr[i], 2).toString(10));
	}
	// ascii to b64
	result = btoa(result);
	// encode to url
	result = result.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
	return result;
}

function urlDecode(input) {
	// decode from url
	input = (input + '===').slice(0, input.length + (input.length % 4));
	input = input.replace(/-/g, '+').replace(/_/g, '/');

	// b64 to ascii
	try {
		input = atob(input);
	} catch {
		console.error("AtoB error, invalid char in input: " + input)
		setQueryVariable("spells", urlEncode(blankSpells()));
		return blankSpells();
	}
	// ascii to binary
	var result = "";
	for (var i = 0; i < input.length; i++) {
		var bin = input[i].charCodeAt().toString(2);
		result += Array(8 - bin.length + 1).join("0") + bin;
	}
	return result;
}

function blankSpells() {
	var zeroString = "";
	for (let i = 0; i < maxSpells; i++) {
		zeroString += 0;
	}
	checkedTotal = 0;
	updateCounter();
	return zeroString;
}

function loadSpells() {
	// take global spells value, and alter checkboxes/highlight to match
	$(".highlight").toggleClass("highlight", false);
	$('input:checkbox').removeAttr('checked');
	spellID = 0;
	checkedTotal = 0;
	for (let i = 0; i < maxSpells; i++) {
		if (spells.charAt(i) == 0) {
			continue;
		}
		spellID = i + 1;
		checkedTotal += 1;
		document.getElementById(spellID).checked = 1;
		document.getElementById("tr" + spellID).classList.toggle("highlight");
	}
	updateCounter();
}

function updateCounter() {
	document.title = "BLU Checklist " + checkedTotal + "/" + maxSpells;
}

function padSpells() {
	patchSpells = spells.padEnd(encodeCompatLength, 'A')
	console.log("Updated old link format to '" + patchSpells + "' of length " + patchSpells.length);
	setQueryVariable("spells", patchSpells);
	return patchSpells;
}

function trimSpells() {
	var patchSpells = spells.substring(0, encodeCompatLength)
	setQueryVariable("spells", patchSpells);
	console.log("Trimmed spell query to '" + patchSpells + "' of length " + patchSpells.length);
	return patchSpells
}

// global
var baseUrl = location.protocol + '//' + location.host + location.pathname;
baseUrl = baseUrl.replace(/\.html$/, '');
window.history.replaceState('', '', baseUrl + location.search);
const maxSpells = 124;
const encodeCompatLength = 22;
var checkedTotal = 0;
var gridMode = false;
var gridPage = 1;
document.getElementById('r1').checked = true;
var spells = getQueryVariable("spells");
if (spells.length < encodeCompatLength) { // if spells length indicates an old patch version, pad the right with blank slots to fix.
	console.log("Old patch link detected: '" + spells + "'");
	spells = padSpells();
}
if (spells.length > encodeCompatLength) { // trim any spaces or artifacts on the right of the url
	console.log("Attempting to trim excess query data: '" + spells + "'");
	spells = trimSpells();

}
if (spells) {
	try {
		// try to decode
		spells = urlDecode(spells);
		// then apply across checkboxes
		loadSpells();
	} catch {
		// invalid input, set to default
		console.error("Invalid spells on load: " + spells);
		setQueryVariable("spells", urlEncode(blankSpells()));
		spells = blankSpells();
	}
} else {
	// no spells supplied, set to default
	setQueryVariable("spells", urlEncode(blankSpells()));
	spells = blankSpells();
}