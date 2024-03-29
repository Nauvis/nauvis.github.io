$(document).on("change", "input[type='checkbox']", function () {
		$(this).closest('tr').toggleClass("highlight", this.checked)
		toggleSpell($(this).attr('id'));
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

$(document).on("change", "input[type='radio']", function () {
	gridPage = $(this).val();
		displayPage();
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

function selectAll() {
	console.log("selectAll prior state: " + spells);
	var loopSpell = "";
	for (let i = 0; i < maxSpells; i++) {
		loopSpell += '1';
	}
	spells = loopSpell;
	setQueryVariable("spells", urlEncode(spells));
	if (gridMode) {
		displayPage();
	} else {
		loadSpells();
	}
}

function clearAll() {
	console.log("clearAll prior state: " + spells);
	var loopSpell = "";
	for (let i = 0; i < maxSpells; i++) {
		loopSpell += '0';
	}
	spells = loopSpell;
	setQueryVariable("spells", urlEncode(spells));
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
	console.log(maxSpells);
	var zeroString = "";
	for (let i = 0; i < maxSpells; i++) {
		zeroString += 0;
	}
	checkedTotal = 0;
	updateCounter();
	console.log(zeroString);
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

function getBluSpells() {
	getJSON('../assets/json/blu.json', function (err, bluSpellAPI) {
		if (err) {
			console.log(err);
			return;
		}
		var spellParent = null;
		var checkmarkParent = null;
		var spellChild = null;
		maxSpells = Object.keys(bluSpellAPI).length;
		for (let i = 1; i <= maxSpells; i++) {
			spellParent = document.createElement("tr");
			spellParent.setAttribute("id", "tr"+i);
			spellsParentDiv.appendChild(spellParent);
			
			checkmarkParent = document.createElement("td");
			spellChild = document.createElement("input");
			spellChild.setAttribute("type", "checkbox");
			spellChild.setAttribute("id", i);
			checkmarkParent.appendChild(spellChild);
			spellParent.appendChild(checkmarkParent);
			
			spellChild = document.createElement("td");
			spellChild.innerHTML = i;
			spellParent.appendChild(spellChild);
			
			spellChild = document.createElement("td");
			spellChild.innerHTML = bluSpellAPI[i]["name"];
			spellParent.appendChild(spellChild);
			
			spellChild = document.createElement("td");
			spellChild.innerHTML = bluSpellAPI[i]["get"];
			spellParent.appendChild(spellChild);
			
			spellChild = document.createElement("td");
			spellChild.innerHTML = bluSpellAPI[i]["note"];
			spellParent.appendChild(spellChild);
		}
		
		var radioLabel = null;
		var radioInput = null;
		for (let i = 1; i <= Math.ceil(maxSpells/16); i++) {
			radioLabel = document.createElement("label");
			radioLabel.setAttribute("class", "radio-inline");
			
			radioInput = document.createElement("input");
			radioInput.setAttribute("type", "radio");
			radioInput.setAttribute("name", "page");
			radioInput.setAttribute("value", i);
			radioInput.setAttribute("id", "r"+i);
			
			radioLabel.appendChild(radioInput);
			
			radioLabel.innerHTML = radioLabel.innerHTML + i+" ";
			radioParentDiv.appendChild(radioLabel);
		}
		
		encodeCompatLength = Math.ceil((Math.ceil(maxSpells/8)*8)/6);
		document.getElementById('r1').checked = true;
		spells = getQueryVariable("spells");
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
	});
}

var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

var maxSpells = 0;
var checkedTotal = 0;
var gridMode = false;
var gridPage = 1;
var encodeCompatLength = 0;
var spells = null;
const spellsParentDiv = document.getElementById("spells")
const radioParentDiv = document.getElementById("radio")
getBluSpells(spellsParentDiv);
