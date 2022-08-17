/* jshint esversion: 11 */

const yes = true, no = false, enable = true, disable = false, enabled = true, disabled = false;

var Settings = {
	"I understand that by changing these settings I make my account subject to a manual or automated ban, and I claim full responsibility": no,

	"Bypass 30 action limit": disable,
	"Don't wait 10 seconds": disabled
};

const setting = (key) => Settings[{
	"unsafe": "I understand that by changing these settings I make my account subject to a manual or automated ban, and I claim full responsibility",
	"bypass": "Bypass 30 action limit",
	"nowait": "Don't wait 10 seconds"
}[key]];

if (!setting("unsafe") && (setting("bypass") || setting("nowait"))) throw "You did not claim full responsibility when modifying settings.";

var HTML_SubText = null;
var HTML_WatchAdBtn = null;
var HTML_ActionText = null;
var AUTHTOKEN = null;
var lastActions = 0;
const myver = "v1.0";

async function allu_waitTime(ms) {
	return await new Promise(function (response, reject) {
		setTimeout(response, ms);
	});
}

(async () => {
	HTML_SubText = $$("div[dir=auto]").find((x) => x.innerText.startsWith("Your actions are"));
	HTML_WatchAdBtn = $$("div[dir=auto]").find((x) => x.innerText == "WATCH AN AD");
	HTML_ActionText = $$("div[dir=auto]").find((x) => x.innerText.startsWith("You have"));
	var HTML_UpgradePlan = $$("div[dir=auto]").find((x) => x.innerText.toLowerCase() == "upgrade plan").parentElement.parentElement.parentElement;
	var HTML_Autoplay = $$("div[dir=auto]").find((x) => x.innerText == "Autoplay Ads").parentElement.parentElement;
	if (!HTML_SubText || !HTML_WatchAdBtn || !HTML_ActionText || !HTML_UpgradePlan || !HTML_Autoplay) throw "Couldn't find a required HTML element.";
	lastActions = Number.parseInt(HTML_ActionText.innerText.match(/\d+/)[0]);
	HTML_SubText.innerHTML = '<center>Welcome to AI Dungeon Farmer ' + myver + '!<br>' + (setting("unsafe") ? '<span style="color: #f73a2d">You are running the unsafe version! I hope you understand what you\'re doing.</span>' : '<span style="color: #15e823">You are running the safe version!</span>') + '<br><small><i>Alluseri worked hard on this one.<br>Please enjoy!</i> <3</small></center>';
	HTML_SubText.parentElement.style.alignSelf = "center";
	HTML_WatchAdBtn.innerText = "INITIALIZE FARMER";
	HTML_UpgradePlan.remove();
	HTML_Autoplay.remove();
	_aidfuck_fetch = fetch;
	fetch = async function (n, capture) {
		var auth = capture.headers?.authorization;
		if (auth && !AUTHTOKEN) {
			AUTHTOKEN = auth;
		}
	};
	(uni = function ($, getEventListeners, document) {
		if (AUTHTOKEN) postInit($, getEventListeners, document);
		else setTimeout(uni, 1000, $, getEventListeners, document);
	})($, getEventListeners, document);
})();

function fuckgraphql(eventName, clientInfo) { // it's so gay istg
	return {
		"operationName": "EventHookSendUserEvent",
		"variables": {
			"input": {
				"eventName": eventName,
				"variation": "web",
				"clientInfo": clientInfo
			}
		},
		"query": "mutation EventHookSendUserEvent($input: EventInput) {\n  sendUserEvent(input: $input)\n}\n"
	};
}

async function easy(query) {
	return await (await _aidfuck_fetch("https://api.aidungeon.io/graphql", {
		"method": "POST",
		"body": JSON.stringify(query),
		"headers": {
			"authorization": AUTHTOKEN,
			"content-type": "application/json",
			"accept": "*/*"
		}
	})).json();
}

function setupButtonText(state, fn) {
	switch (state) {
		case 0: // Enable click
			if (!setting("bypass") && lastActions >= 30) {
				HTML_WatchAdBtn.parentElement.parentElement.onclick = null;
				HTML_WatchAdBtn.innerText = "LIMIT REACHED";
				HTML_WatchAdBtn.parentElement.parentElement.style.backgroundColor = "#f73a2d";
				HTML_SubText.innerHTML = "<center>Uh oh! It seems like you reached the 30-action limit.<br>Please refresh the page now and proceed to playing.</center>";
			} else {
				HTML_WatchAdBtn.parentElement.parentElement.onclick = fn;
				HTML_WatchAdBtn.innerText = "+10 ACTIONS";
				HTML_WatchAdBtn.parentElement.parentElement.style.backgroundColor = "#00c1d6";
			}
			return;
		case 1: // Please wait
			HTML_WatchAdBtn.parentElement.parentElement.onclick = null;
			HTML_WatchAdBtn.innerText = "PLEASE WAIT...";
			HTML_WatchAdBtn.parentElement.parentElement.style.backgroundColor = "#3b3b3b";
			return;
		case 2: // Time
			HTML_WatchAdBtn.parentElement.parentElement.onclick = null;
			HTML_WatchAdBtn.innerText = "WAITING 10 SECONDS...";
			HTML_WatchAdBtn.parentElement.parentElement.style.backgroundColor = "#3b3b3b";
			return;
	}
}

async function postInit($, getEventListeners, document) {
	console.log("Pre-init routine complete.");
	setTimeout((document) => Array.from(document.body.children).find((x) => x.tagName == "DIV" && x.id == "" && x.children.length > 0).remove(), 200, document);
	HTML_SubText.innerHTML = "<center><b>Refresh</b> the page after you're done farming.<br><i><small>Powered by catgirl supremacy, provided to you by the API king.</small></i></center>";
	$("#root").removeEventListener("click", getEventListeners($("#root")).click[0].listener);
	_backup = async function () {
		setupButtonText(1, _backup);
		var clientInfo = {
			"os": "web",
			"model": navigator.userAgent.toLowerCase(),
			"version": "unknown"
		};
		var Query1 = fuckgraphql("ad_reward_button_press", clientInfo);
		var Query2 = fuckgraphql("ad_rewarded_reward_earned", clientInfo);
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
		await easy(Query1);
		if (!setting("nowait")) {
			setupButtonText(2, _backup);
			await allu_waitTime(10000);
			setupButtonText(1, _backup);
		}
		easy(Query2);
		await easy(Query3);
		HTML_ActionText.innerHTML = "You have " + (lastActions = (await easy(Query4)).data.adCountdown.currentCount) + " Actions";
		setupButtonText(0, _backup);
	};
	setupButtonText(0, _backup);
}

// "haven't seen worse code in my entire life" - (C) Someone, definitely
