(function($) {

	var $window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
	breakpoints({
		xlarge: ['1281px', '1680px'],
		large: ['981px', '1280px'],
		medium: ['737px', '980px'],
		small: ['481px', '736px'],
		xsmall: ['361px', '480px'],
		xxsmall: [null, '360px']
	});

	// Play initial animations on page load.
	$window.on('load', function() {
		window.setTimeout(function() {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Fix: Flexbox min-height bug on IE.
	if (browser.name == 'ie') {

		var flexboxFixTimeoutId;

		$window.on('resize.flexbox-fix', function() {

			clearTimeout(flexboxFixTimeoutId);

			flexboxFixTimeoutId = setTimeout(function() {

				if ($wrapper.prop('scrollHeight') > $window.height())
					$wrapper.css('height', 'auto');
				else
					$wrapper.css('height', '100vh');

			}, 250);

		}).triggerHandler('resize.flexbox-fix');

	}

	// Nav.
	var $nav = $header.children('nav'),
		$nav_li = $nav.find('li');

	// Add "middle" alignment classes if we're dealing with an even number of items.
	if ($nav_li.length % 2 == 0) {

		$nav.addClass('use-middle');
		$nav_li.eq(($nav_li.length / 2)).addClass('is-middle');

	}

	// Main.
	var delay = 325,
		locked = false;

	// Methods.
	$main._show = function(id, initial) {

		var $article = $main_articles.filter('#' + id);

		// No such article? Bail.
		if ($article.length == 0)
			return;
		
		// Check if its an article that requires building/updating on visible
		if (id == "server") {
			loadServerStatus();
		}
		
		// Handle lock.

		// Already locked? Speed through "show" steps w/o delays.
		if (locked || (typeof initial != 'undefined' && initial === true)) {

			// Mark as switching.
			$body.addClass('is-switching');

			// Mark as visible.
			$body.addClass('is-article-visible');

			// Deactivate all articles (just in case one's already active).
			$main_articles.removeClass('active');

			// Hide header, footer.
			$header.hide();
			$footer.hide();

			// Show main, article.
			$main.show();
			$article.show();

			// Activate article.
			$article.addClass('active');

			// Unlock.
			locked = false;

			// Unmark as switching.
			setTimeout(function() {
				$body.removeClass('is-switching');
			}, (initial ? 1000 : 0));

			return;

		}

		// Lock.
		locked = true;

		// Article already visible? Just swap articles.
		if ($body.hasClass('is-article-visible')) {

			// Deactivate current article.
			var $currentArticle = $main_articles.filter('.active');

			$currentArticle.removeClass('active');

			// Show article.
			setTimeout(function() {

				// Hide current article.
				$currentArticle.hide();

				// Show article.
				$article.show();

				// Activate article.
				setTimeout(function() {

					$article.addClass('active');

					// Window stuff.
					$window
						.scrollTop(0)
						.triggerHandler('resize.flexbox-fix');

					// Unlock.
					setTimeout(function() {
						locked = false;
					}, delay);

				}, 25);

			}, delay);

		}

		// Otherwise, handle as normal.
		else {

			// Mark as visible.
			$body
				.addClass('is-article-visible');

			// Show article.
			setTimeout(function() {

				// Hide header, footer.
				$header.hide();
				$footer.hide();

				// Show main, article.
				$main.show();
				$article.show();

				// Activate article.
				setTimeout(function() {

					$article.addClass('active');

					// Window stuff.
					$window
						.scrollTop(0)
						.triggerHandler('resize.flexbox-fix');

					// Unlock.
					setTimeout(function() {
						locked = false;
					}, delay);

				}, 25);

			}, delay);

		}

	};

	$main._hide = function(addState) {

		var $article = $main_articles.filter('.active');

		// Article not visible? Bail.
		if (!$body.hasClass('is-article-visible'))
			return;
		
		// Add state?
		if (typeof addState != 'undefined' &&
			addState === true)
			history.pushState(null, null, '#');

		// Handle lock.

		// Already locked? Speed through "hide" steps w/o delays.
		if (locked) {

			// Mark as switching.
			$body.addClass('is-switching');

			// Deactivate article.
			$article.removeClass('active');

			// Hide article, main.
			$article.hide();
			$main.hide();

			// Show footer, header.
			$footer.show();
			$header.show();

			// Unmark as visible.
			$body.removeClass('is-article-visible');

			// Unlock.
			locked = false;

			// Unmark as switching.
			$body.removeClass('is-switching');

			// Window stuff.
			$window
				.scrollTop(0)
				.triggerHandler('resize.flexbox-fix');

			return;

		}

		// Lock.
		locked = true;

		// Deactivate article.
		$article.removeClass('active');

		// Hide article.
		setTimeout(function() {

			// Hide article, main.
			$article.hide();
			$main.hide();

			// Show footer, header.
			$footer.show();
			$header.show();

			// Unmark as visible.
			setTimeout(function() {

				$body.removeClass('is-article-visible');

				// Window stuff.
				$window
					.scrollTop(0)
					.triggerHandler('resize.flexbox-fix');

				// Unlock.
				setTimeout(function() {
					locked = false;
				}, delay);

			}, 25);

		}, delay);


	};

	// Articles.
	$main_articles.each(function() {
		
		var $this = $(this);
		
		// If article has trap class, give all close prevention classes
		if ($this.hasClass('trap')) {
			$this.addClass('trapclose trapesc trapclick');
		}
		
		// If article has softtrap class, give all but clicking on the x as close methods
		if ($this.hasClass('softtrap')) {
			$this.addClass('trapesc trapclick');
		}
		
		// Prevent clicks from inside article from bubbling.
		$this.on('click', function(event) {
			event.stopPropagation();
		});
		
		if ($this.hasClass('trapclose')) { return; }
		// Close.
		$('<div class="close">Close</div>')
			.appendTo($this)
			.on('click', function() {
				location.hash = '';
			});
	});

	// Events.
	$body.on('click', function(event) {
		var $article = $main_articles.filter('.active');
		if ($article.hasClass('trapclick')) {
			return;
		}
		
		// Article visible? Hide.
		if ($body.hasClass('is-article-visible'))
			$main._hide(true);

	});

	$window.on('keyup', function(event) {
		var $article = $main_articles.filter('.active');
		if ($article.hasClass('trapesc')) {
			return;
		}

		switch (event.keyCode) {

			case 27:

				// Article visible? Hide.
				if ($body.hasClass('is-article-visible'))
					$main._hide(true);

				break;

			default:
				break;

		}

	});

	$window.on('hashchange', function(event) {

		// Empty hash?
		if (location.hash == '' ||
			location.hash == '#') {

			// Prevent default.
			event.preventDefault();
			event.stopPropagation();

			// Hide.
			$main._hide();

		}

		// Otherwise, check for a matching article.
		else if ($main_articles.filter(location.hash).length > 0) {

			// Prevent default.
			event.preventDefault();
			event.stopPropagation();

			// Show article.
			$main._show(location.hash.substr(1));

		}

	});

	// Scroll restoration.
	// This prevents the page from scrolling back to the top on a hashchange.
	if ('scrollRestoration' in history)
		history.scrollRestoration = 'manual';
	else {

		var oldScrollPos = 0,
			scrollPos = 0,
			$htmlbody = $('html,body');

		$window
			.on('scroll', function() {

				oldScrollPos = scrollPos;
				scrollPos = $htmlbody.scrollTop();

			})
			.on('hashchange', function() {
				$window.scrollTop(oldScrollPos);
			});

	}

	// Initialize.

	// Hide main, articles.
	$main.hide();
	$main_articles.hide();

	// Initial article.
	if (location.hash != '' &&
		location.hash != '#')
		$window.on('load', function() {
			$main._show(location.hash.substr(1), true);
		});

})(jQuery);

// minecraft server status
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

const server = {
	  1: { subdomain: "mc", 	color: '#ADD8E6', cacheexpire: 0 },
	  2: { subdomain: "kate", 	color: '#E69F96', cacheexpire: 0 },
	  3: { subdomain: "one", 	color: '#6FC276', cacheexpire: 0 }
	};

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