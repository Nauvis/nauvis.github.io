function getBluSpells(parentDiv) {
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
			parentDiv.appendChild(spellParent);
			
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
const parentDiv = document.getElementById("bluSpellList")
getBluSpells(parentDiv);