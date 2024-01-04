function getOnlineStatus(serverIP, statusQuerySel, countQuerySel, listQuerySel) {
	MinecraftAPI.getServerStatus(serverIP, {}, function (err, status) {  
		if (err) {  
			return document.querySelector(statusQuerySel).innerHTML = 'Error';  
		}
		document.querySelector(statusQuerySel).innerHTML = status.online ? 'Online' : 'Offline';
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
getOnlineStatus('mc.nauvis.dev', '.serverStatus1', '.playerCount1', '.playerList1');
getOnlineStatus('kate.nauvis.dev', '.serverStatus2', '.playerCount2', '.playerList2');