function getBluSpells() {
	getJSON('assets/json/blu.json', function (err, bluSpellAPI) {
		if (err) {
			console.log(err);
			return;
		}
		var spellParent = null;
		var checkmarkParent = null;
		var spellChild = null;
		for (let i = 1; i <= Object.keys(bluSpellAPI).length; i++) {
			spellParent = document.createElement("tr");
			spellParent.setAttribute("id", "spell"+i);
			bluParentDiv.appendChild(spellParent);
			
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
	});
}
const bluParentDiv = document.getElementById("bluSpellList")