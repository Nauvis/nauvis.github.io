$('input').on('input',function(e){
	var v = this.id;
	var parentDivID = $(this).parent().closest('div').attr('id');
	blnAltInput = (v == "oCoords" || v == "nCoords");
	if (blnAltInput) {
		altInput(this, parentDivID)
	} else {
		numInput(this, parentDivID)
	}
});

function numInput(element, parentDivID) {
	if (parentDivID == "oCoordsDiv") {
		writeValueIfNum(oCoordsX.value/8, nCoordsX);
		writeValueIfNum(oCoordsY.value, nCoordsY);
		writeValueIfNum(oCoordsZ.value/8, nCoordsZ);
		oCoords.value = Math.floor(oCoordsX.value) + " " + Math.floor(oCoordsY.value) + " " +  Math.floor(oCoordsZ.value);
		nCoords.value = Math.floor(nCoordsX.value) + " " + Math.floor(nCoordsY.value) + " " +  Math.floor(nCoordsZ.value);
	} else {
		writeValueIfNum(nCoordsX.value*8, oCoordsX);
		writeValueIfNum(nCoordsY.value, oCoordsY);
		writeValueIfNum(nCoordsZ.value*8, oCoordsZ);
		oCoords.value = Math.floor(oCoordsX.value) + " " + Math.floor(oCoordsY.value) + " " +  Math.floor(oCoordsZ.value);
		nCoords.value = Math.floor(nCoordsX.value) + " " + Math.floor(nCoordsY.value) + " " +  Math.floor(nCoordsZ.value);
	}
}

function altInput(element, parentDivID) {
	coordsArray = element.value.split(/[ ,]+/);
	if (parentDivID == "oCoordsDiv") {
		writeValueIfNum(coordsArray[0], oCoordsX);
		writeValueIfNum(coordsArray[1], oCoordsY);
		writeValueIfNum(coordsArray[2], oCoordsZ);
		writeValueIfNum(oCoordsX.value/8, nCoordsX);
		writeValueIfNum(oCoordsY.value, nCoordsY);
		writeValueIfNum(oCoordsZ.value/8, nCoordsZ);
		nCoords.value = Math.floor(nCoordsX.value) + " " + Math.floor(nCoordsY.value) + " " +  Math.floor(nCoordsZ.value);
	} else {
		writeValueIfNum(coordsArray[0], nCoordsX);
		writeValueIfNum(coordsArray[1], nCoordsY);
		writeValueIfNum(coordsArray[2], nCoordsZ);
		writeValueIfNum(nCoordsX.value*8, oCoordsX);
		writeValueIfNum(nCoordsY.value, oCoordsY);
		writeValueIfNum(nCoordsZ.value*8, oCoordsZ);
		oCoords.value = Math.floor(oCoordsX.value) + " " + Math.floor(oCoordsY.value) + " " +  Math.floor(oCoordsZ.value);
	}
}

function writeValueIfNum(coord, targetElement) {
	coord = parseIntOrZero(coord);
	if (isNaN(coord)) {
		targetElement.value = 0;
	} else {
		targetElement.value = Math.floor(coord);
	}
	return;
}

function parseIntOrZero(value) {
    try {
        return parseInt(value);
    } catch (e) {
        return 0;
    }
}