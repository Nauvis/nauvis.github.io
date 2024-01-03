function getOnlineStatus(serverIP, statusQuerySel, countQuerySel, divQuerySel) {
	MinecraftAPI.getServerStatus(serverIP, {}, function (err, status) {  
	if (err) {  
	return document.querySelector(divQuerySel).innerHTML = 'Error loading status';  
	}
	document.querySelector(statusQuerySel).innerHTML = status.online ? 'Online' : 'Offline';
	document.querySelector(countQuerySel).innerHTML = status.players.now + "/" + status.players.max;
	});
}
getOnlineStatus('mc.nauvis.dev', '.serverStatus1', '.playerCount1', '.errDiv1');
getOnlineStatus('kate.nauvis.dev', '.serverStatus2', '.playerCount2', '.errDiv2');