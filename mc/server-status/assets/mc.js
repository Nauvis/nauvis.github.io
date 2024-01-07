function getOnlineStatus(serverIP, element) {
	getJSON('https://api.mcsrvstat.us/3/' + serverIP, function (err, serverAPI) {
		element.innerHTML = serverIP + "</b><br><br>";
		element.innerHTML = element.innerHTML + "Status: ";
		if (err) {
			element.innerHTML = element.innerHTML + "Error<br><br>"
			element.setAttribute("class", "centered-content offline");
			console.log(serverIP + " returned error: " + err);
			return;
		}
		var serverStatus = serverAPI.online ? 'Online' : 'Offline';
		element.innerHTML = element.innerHTML + serverStatus+"<br><br>"
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

const serverListDiv = document.getElementById("serverList");
const server = {
  1: { subdomain: "mc", 	color: '#ADD8E6' },
  2: { subdomain: "kate", 	color: '#E69F96' },
  3: { subdomain: "one", 	color: '#6FC276' }
};
for (let i = 1; i <= Reflect.ownKeys(server).length; i++) {
	var serverIP = server[i]["subdomain"]+".nauvis.dev";
	var element = document.createElement("tr");
	element.style.backgroundColor = server[i]["color"];
	element.style.fontWeight = "bold";
	element.setAttribute("class", "centered-content");
	element.innerHTML = serverIP + "</b><br><br>";
	element.innerHTML = element.innerHTML + "Status: Pending";
	serverListDiv.appendChild(element);
	getOnlineStatus(serverIP, element);
	serverListDiv.appendChild(document.createTextNode(" ")); // spacer
}