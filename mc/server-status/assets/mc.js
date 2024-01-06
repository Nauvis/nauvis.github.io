function getOnlineStatus(serverIP, statusQuerySel, countQuerySel, listQuerySel, divQuerySel) {
	getJSON('https://api.mcsrvstat.us/3/' + serverIP, function (err, data) {
		if (err) {
			document.querySelector(statusQuerySel).innerHTML = 'Offline';
			document.getElementById(divQuerySel).classList.add("offline");
			console.log(serverIP + " returned error: " + err);
			return;
		}
		document.querySelector(statusQuerySel).innerHTML = data.online ? 'Online' : 'Offline';
		if (data.online) {
			document.getElementById(divQuerySel).classList.remove("offline");
			document.querySelector(countQuerySel).innerHTML = "Players: " + data.players.online + "/" + data.players.max;
			// list current players if any are online
			if (data.players.online > 0) {
				var playerList = "<br>";
				for (let i = 0; i < data.players.online; i++) {
					playerList = playerList + "- " + data.players.list[i]["name"] + "<br>";
				} 
				document.querySelector(listQuerySel).innerHTML = playerList;
			}
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

getOnlineStatus('mc.nauvis.dev', '.serverStatus_mc', '.playerCount_mc', '.playerList_mc', 'server_mc');
getOnlineStatus('kate.nauvis.dev', '.serverStatus_kate', '.playerCount_kate', '.playerList_kate', 'server_kate');
getOnlineStatus('one.nauvis.dev', '.serverStatus_one', '.playerCount_one', '.playerList_one', 'server_one');