// ==UserScript==
// @name         AI Dungeon Better Farmer
// @namespace    https://www.youtube.com/playlist?list=PLuPCd5VIscosG72QWT03BBZriNDEbryea
// @version      2.0
// @description  Gets rid of the need to spend your precious time to watch ads.
// @author       Alluseri
// @match        https://play.aidungeon.io/*
// @icon         https://cdn.discordapp.com/attachments/853155168170147910/1022980412731039855/hibi_transp.ico
// @grant        none
// ==/UserScript==

/* jshint esversion: 11 */

(function () {
	'use strict';
	var AUTHTOKEN;

	const $ = document.querySelector.bind(document);
	function buildElement(Tag, Characteristics, Callback, Inner) {
		var elem = document.createElement(Tag);
		for (let _ in (Characteristics || {})) {
			elem[_] = Characteristics[_];
		}
		var ix = (Inner ? Inner.constructor.name == "Array" ? Inner : [Inner] : []);
		for (let _ in ix) {
			elem.appendChild(ix[_]);
		}
		return (Callback || ((x) => x))(elem);
	}
	const style = (x, y) => ((x.style.cssText = y.style.cssText), x);

	function isPagePatched() {
		return !!($(".aidbf--alluseri-loves-you") || $("aidbf--pgr-kurogame-net"));
	}

	function genericPayload(eventName, clientInfo) {
		return {
			"operationName": "EventHookSendUserEvent",
			"variables": {
				"input": {
					"eventName": eventName,
					"variation": "mobile",
					"clientInfo": clientInfo
				}
			},
			"query": "mutation EventHookSendUserEvent($input: EventInput) {\n  sendUserEvent(input: $input)\n}\n"
		};
	}

	async function easy(query) {
		return await (await fetch("https://api.aidungeon.io/graphql", {
			"method": "POST",
			"body": JSON.stringify(query),
			"headers": {
				"authorization": AUTHTOKEN,
				"content-type": "application/json",
				"accept": "*/*"
			}
		})).json();
	}

	function routineAdventurePlay(parent) {
		var auxBtn = parent.firstElementChild;
		var auxVisuals = auxBtn.firstElementChild;
		var auxText = auxVisuals.lastElementChild;

		var cycle = async function (auxBtn, fast) {
			var clientInfo = {
				"os": "mobile",
				"model": navigator.userAgent.toLowerCase(),
				"version": "unknown"
			};
			var Query1 = genericPayload("ad_reward_button_press", clientInfo);
			var Query2 = genericPayload("ad_rewarded_reward_earned", clientInfo);
			var Query3 = {
				"operationName": "IncreaseAdCounterAdContext",
				"variables": {},
				"query": "mutation IncreaseAdCounterAdContext($addActions: Int) {\n  increaseAdCountdown(addActions: $addActions)\n}\n"
			};
			var Query4 = {
				"operationName": "UserContextGetAdCountdown",
				"variables": {},
				"query": "query UserContextGetAdCountdown {\n  adCountdown {\n    id\n    currentCount\n    enforceAds\n    shouldAutoplayAds\n    __typename\n  }\n}\n"
			};
			auxBtn.style.backgroundColor = "#F64627";
			auxBtn.style.borderColor = "#E24C32";
			if (fast) {
				easy(Query1);
				easy(Query2);
				easy(Query3);
			} else {
				await easy(Query1);
				await easy(Query2);
				await easy(Query3);
			}
			auxBtn.style.backgroundColor = "#43DB7C";
			auxBtn.style.borderColor = "#30F178";
			$('img[src="https://static.aidungeon.io/artwork/actions.png"]').parentElement.parentElement.parentElement.lastElementChild.firstElementChild.innerText = (await easy(Query4)).data.adCountdown.currentCount;
			auxBtn.style.backgroundColor = auxBtn.ogBg;
			auxBtn.style.borderColor = auxBtn.ogBorder;
		};

		buildElement("div", { className: auxBtn.className + " aidbf--alluseri-loves-you" }, x => {
			x.style.cssText = auxBtn.style.cssText;
			x.ogBg = x.style.backgroundColor = "#112244";
			x.ogBorder = x.style.borderColor = "#223355";
			x.onclick = cycle.bind(window, x, false);
			parent.appendChild(x);
			return x;
		},
			buildElement("div", { className: auxVisuals.className }, x => style(x, auxVisuals),
				buildElement("div", { className: auxText.className, innerText: "+20 ACTIONS" }, x => style(x, auxText))
			)
		);

		buildElement("div", { className: auxBtn.className + " aidbf--pgr-kurogame-net" }, x => {
			x.style.cssText = auxBtn.style.cssText;
			x.ogBg = x.style.backgroundColor = "#113355";
			x.ogBorder = x.style.borderColor = "#224466";
			x.onclick = cycle.bind(window, x, true);
			parent.appendChild(x);
			return x;
		},
			buildElement("div", { className: auxVisuals.className }, x => style(x, auxVisuals),
				buildElement("div", { className: auxText.className, innerText: "+20 ACTIONS [FAST]" }, x => style(x, auxText))
			)
		);
	}

	function initializeChain() {
		if (isPagePatched()) {
			console.log("Not repatching page!");
			return;
		}
		var ctr = 0;
		var timebk = window.setTimeout;

		window.setTimeout = function (a) {
			var e = $('[aria-label="Commands list"]');
			if (!e) return timebk.apply(window, arguments);
			routineAdventurePlay(e);
			window.setTimeout = timebk;
			return timebk.apply(window, arguments);
		};
	}

	(function initializeIntercept() {
		var sendbk = window.WebSocket.prototype.send;
		window.WebSocket.prototype.send = function (a) {
			var o = JSON.parse(a);
			if (o.type == "connection_init") {
				AUTHTOKEN = o.payload.token;
				window.WebSocket.prototype.send = sendbk;
			}
			return sendbk.apply(this, arguments);
		};
	})();

	var oldHref = document.location.href;

	window.onload = function() {
		if (document.location.href.includes("/main/adventurePlay"))
			initializeChain();

		(new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (oldHref != document.location.href) {
					oldHref = document.location.href;
					if (document.location.href.includes("/main/adventurePlay"))
						initializeChain();
				}
			});
		})).observe(document.querySelector("body"), {
			childList: true,
			subtree: true
		});
	};
})();
