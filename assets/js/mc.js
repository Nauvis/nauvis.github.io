function getOnlineStatus(serverIP, subdomain, element) {
	getJSON('https://api.mcsrvstat.us/3/' + serverIP, function (err, serverAPI) {
		element.innerHTML = serverIP + "<br>";
		if (err) {
			element.innerHTML = element.innerHTML + "<span class=\"icon solid fa-globe\"> No Response</span><br>"
			element.setAttribute("class", "centered-content offline");
			console.log(serverIP + " returned error: " + err);
			return;
		}
		var serverStatus = serverAPI.online ? 'Online' : 'Offline';
		element.innerHTML = element.innerHTML + "<span class=\"icon solid fa-globe\"> " + serverStatus + "</span><br>"
		if (serverAPI.online) {
			element.innerHTML = element.innerHTML + "Players: " + serverAPI.players.online + "/" + serverAPI.players.max + "<br>";
			if (serverAPI.players.online > 0) {
				var playerList = "";
				for (let i = 0; i < serverAPI.players.online; i++) {
					playerList = playerList + "- " + serverAPI.players.list[i]["name"] + "<br>";
				} 
				element.innerHTML = element.innerHTML + playerList;
			}
		}
	});
}

const server = {
	  1: { subdomain: "mc", 	color: '#ADD8E6', cacheexpire: 0 },
	  2: { subdomain: "kissi", 	color: '#006fb9', cacheexpire: 0 }
	};

/* 	  2: { subdomain: "kate", 	color: '#E69F96', cacheexpire: 0 },
	  3: { subdomain: "one", 	color: '#6FC276', cacheexpire: 0 }
*/

function loadServerStatus() {
	const serverListParent = document.getElementById("mcServerList");
	// if it has any children, delete them
	if (serverListParent.firstChild) {
		serverListParent.replaceChildren()
	}
	for (let i = 1; i <= Reflect.ownKeys(server).length; i++) {
		var subdomain = server[i]["subdomain"];
		var serverIP = server[i]["subdomain"]+".nauvis.dev";
		var serverRow = document.createElement("tr");
		serverRow.style.backgroundColor = server[i]["color"];
		serverRow.setAttribute("class", "mcServer");
		serverListParent.appendChild(serverRow);
		var serverData = document.createElement("td");
		serverData.innerHTML = serverIP + "<br>";
		serverData.innerHTML = serverData.innerHTML + "<span class=\"icon solid fa-globe\"> Pending</span>";
		serverRow.appendChild(serverData);
		getOnlineStatus(serverIP, subdomain, serverData);
	}
}