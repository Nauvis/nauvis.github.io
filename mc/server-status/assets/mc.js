function getOnlineStatus(serverIP, statusQuerySel, countQuerySel, listQuerySel, divQuerySel) {
	MinecraftAPI.getServerStatus(serverIP, {}, function (err, status) {  
		if (err) {
			document.querySelector(statusQuerySel).innerHTML = 'Error';
			document.getElementById(divQuerySel).classList.add("offline");
			return;
		}
		document.querySelector(statusQuerySel).innerHTML = status.online ? 'Online' : 'Offline';
		if (status.online) {
			document.getElementById(divQuerySel).classList.remove("offline");
		}
		document.querySelector(countQuerySel).innerHTML = status.players.now + "/" + status.players.max;
		if (status.players.now > 0) {
			var playerList = "<br>";
			for (let i = 0; i < status.players.now; i++) {
				playerList = playerList + "- " + status.players.sample[i]["name"] + "<br>";
			} 
			document.querySelector(listQuerySel).innerHTML = playerList;
		}
	});
}
getOnlineStatus('mc.nauvis.dev', '.serverStatus1', '.playerCount1', '.playerList1', 'server1Div');
getOnlineStatus('kate.nauvis.dev', '.serverStatus2', '.playerCount2', '.playerList2', 'server2Div');