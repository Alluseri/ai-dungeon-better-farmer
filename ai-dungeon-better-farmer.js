// ==UserScript==
// @name         AI Dungeon Better Farmer
// @namespace    https://www.youtube.com/playlist?list=PLuPCd5VIscosG72QWT03BBZriNDEbryea
// @version      2.3
// @description  Gets rid of the need to spend your precious time to watch ads.
// @author       Alluseri
// @match        https://play.aidungeon.io/*
// @icon         https://cdn.discordapp.com/attachments/853155168170147910/1022980412731039855/hibi_transp.ico
// @grant        none
// ==/UserScript==

/* jshint esversion: 11 */
(function() {
	'use strict';
	(async () => {
		var isNodeJS = false;
		try {
			isNodeJS = !!require;
		} catch { isNodeJS = false; }
		if (isNodeJS) {
			console.log("Running in Node.js environment.");
			await runNodeJS();
		} else {
			console.log("Running in UserScript environment.");
			runUserScript();
		}
	})();

	async function runNodeJS() {
		const fetch = require("node-fetch");
		const rl = require("readline").createInterface(process.stdin, process.stdout);
		const prompt = async (q) => await new Promise((r) => rl.question(q, r));
		const fse = require("fs-extra");
		
		if (!fse.existsSync("login.txt")) {
			console.log("ERROR: Credentials file doesn't exist.");
			return;
		}
		const _x_fd = fse.readFileSync("login.txt").split("\n");
		const Login = _x_fd[0];
		const Password = _x_fd[1];
		
		console.log("For advanced users(feel free to skip all of the below):");
		const UA = (await prompt("Enter your useragent: ")).trim() || "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.115 Safari/537.36";
		const GraphQL_UA = UA.toLowerCase();
		const FirebaseKey = "AIzaSyCnvo_XFPmAabrDkOKBRpbivp5UH8r_3mg";
		const FirebaseCV = (await prompt("Enter your Firebase CV: ")).trim() || "Chrome/JsCore/9.6.7/FirebaseCore-web";
		const FirebaseUA = (await prompt("Enter your Firebase UA: ")).trim() || "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.115 Safari/537.36";

		const FirebaseHeaders = {
			"origin": "https://play.aidungeon.io",
			"x-client-version": FirebaseCV,
			"user-agent": FirebaseUA,
			"content-type": "application/json"
		};
		const GraphQLHeaders = (auth) => ({
			"origin": "https://play.aidungeon.io",
			"user-agent": GraphQL_UA,
			"content-type": "application/json",
			"authorization": auth
		});

		const GraphQLDatabase = {
			"firebaseLogin": JSON.stringify({
				"operationName": "EventHookSendUserEvent",
				"variables": {
					"input": {
						"eventName": "logged_in_email_firebase",
						"variation": "aidungeon",
						"clientInfo": {
							"os": "mobile",
							"model": GraphQL_UA,
							"version": "unknown",
							"buildNumber": "unknown",
							"appVersion": "unknown",
							"applicationName": "unknown"
						}
					}
				},
				"query": "mutation EventHookSendUserEvent($input: EventInput) {\n  sendUserEvent(input: $input)\n}\n"
			}),
			"getUserData": JSON.stringify({
				"operationName": "UserContextGetUser",
				"variables": {},
				"query": "query UserContextGetUser {\n  user {\n    id\n    createdAt\n    acceptCommunityGuidelines\n    blockedUsers\n    canCreatorApply\n    creator\n    email\n    accessibleFeatures\n    hasPremium\n    isAlpha\n    isCurrentUser\n    isDeveloper\n    enableTestPayments\n    newNotificationCount\n    privateId\n    firebaseUid\n    rewardAvailable\n    shouldPromptReview\n    shouldShowModelPromo\n    username\n    verifiedAt\n    hasHadSubscriptionAccess\n    profile {\n      id\n      shortId\n      title\n      description\n      thumbImageUrl\n      __typename\n    }\n    activePremium {\n      userId\n      name\n      status\n      platform\n      activeUntil\n      accessUntil\n      subscriptionId\n      __typename\n    }\n    actionsBalance {\n      id\n      currentBalance\n      __typename\n    }\n    creditsBalance {\n      id\n      currentBalance\n      __typename\n    }\n    scalesBalance {\n      id\n      currentBalance\n      __typename\n    }\n    goldBalance {\n      id\n      currentBalance\n      __typename\n    }\n    gameSettings {\n      id\n      ai21CountPen\n      ai21FreqPen\n      ai21PresPen\n      alignCommands\n      bannedWords\n      commandList\n      defaultMode\n      displayColors\n      displayTheme\n      enableAlpha\n      enableBeta\n      griffinRepPen\n      isFullScreen\n      lowBandwidth\n      memoryLength\n      mobileActionWindowSize\n      modelType\n      nsfwGeneration\n      searchfilterFollowing\n      searchfilterPublished\n      searchfilterSafe\n      searchfilterThirdPerson\n      showFeedback\n      showIconText\n      showModes\n      storyLineBreak\n      temperature\n      textFont\n      textLength\n      textSize\n      textSpeed\n      topK\n      topP\n      trainTheAi\n      unrestrictedInput\n      webActionWindowSize\n      worldInfoCardStyle\n      settingsDrawerOpened\n      advancedSettingsOpened\n      imageCacheSelected\n      rawModelOutput\n      imageSettingsOpened\n      imgWidth\n      imgHeight\n      imgCfgScale\n      imgSteps\n      imgSampler\n      imgSeed\n      imgSeedSafe\n      shouldAutoplayAds\n      activeTab\n      __typename\n    }\n    newProductUpdates {\n      id\n      title\n      description\n      createdAt\n      __typename\n    }\n    continueAdventure {\n      id\n      publicId\n      __typename\n    }\n    __typename\n  }\n}\n"
			})
		};

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

		async function fastJSON(url, body) {
			return await (await fetch(url, body)).json();
		}

		async function easy(auth, query) {
			return await (await fetch("https://api.aidungeon.io/graphql", {
				"method": "POST",
				"body": JSON.stringify(query),
				"headers": {
					"authorization": auth,
					"content-type": "application/json",
					"accept": "*/*",
					"user-agent": UA
				}
			})).json();
		}

		var runFarm = async function (auth, fast) {
			var clientInfo = {
				"os": "mobile",
				"model": GraphQL_UA,
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
			if (fast) {
				easy(auth, Query1);
				easy(auth, Query2);
				easy(auth, Query3);
			} else {
				await easy(auth, Query1);
				await easy(auth, Query2);
				await easy(auth, Query3);
			}
			return (await easy(auth, Query4)).data.adCountdown.currentCount;
		};

		await fetch("https://play.aidungeon.io/main/loginRegister", {
			method: "GET",
			referrer: "",
			headers: {
				"user-agent": UA
			}
		});
		var signInResponse = await fastJSON("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + FirebaseKey, {
			method: "POST",
			referrer: "",
			headers: FirebaseHeaders,
			body: JSON.stringify({ "returnSecureToken": true, "email": Login, "password": Password })
		});
		setTimeout(()=>{throw "Token has timed out. Please reopen the application.";}, signInResponse.expiresIn * 1000);
		var idToken = signInResponse.idToken;
		var account = (await fastJSON("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" + FirebaseKey, {
			method: "POST",
			referrer: "",
			headers: FirebaseHeaders,
			body: JSON.stringify({ idToken: idToken })
		})).users[0];
		if (account.disabled) {
			throw "Your account is disabled.";
		}
		var authToken = "firebase " + idToken;
		await fetch("https://api.aidungeon.io/graphql", {
			method: "POST",
			referrer: "https://play.aidungeon.io/",
			headers: GraphQLHeaders(authToken),
			body: GraphQLDatabase.firebaseLogin
		});
		var _ = await fastJSON("https://api.aidungeon.io/graphql", {
			method: "POST",
			referrer: "https://play.aidungeon.io/",
			headers: GraphQLHeaders(authToken),
			body: GraphQLDatabase.getUserData
		});
		var nickname = _.data.user.profile.title || _.data.user.username;
		console.log("\nWelcome, " + nickname + "!");
		console.log("Please pick the farmer mode.");
		console.log("1. Default mode(safest)");
		console.log("2. Fast mode(safe, out-of-sync)");
		console.log("3. Super fast mode(unsafe)");
		console.log("*. Exit");
		var z = (await prompt("> ")).trim() - 0;
		if (![1,2,3].includes(z)) {
			process.exit();
			return;
		}
		console.log("Please add AT MOST (10 * 80) actions everyday for your own safety!!!");
		var amount = ((await prompt("Add this many actions * 80: ")).trim() - 0) || 1;
		switch (z) {
			case 1:
				for (var i = 1;i <= amount;i++)
					console.log("Your current actions: " + (await runFarm(authToken, false)) +"(farmed "+i+" * 80 actions)");
				console.log("Routine finished, you may exit now.");
			break;
			case 2:
				for (var j = 1;j <= amount;j++)
					console.log("Your current actions: " + (await runFarm(authToken, true)) +"(farmed "+j+" * 80 actions)");
				console.log("Routine finished, you may exit in 5 seconds.");
			break;
			case 3:
				for (var k = 1;k <= amount;k++) {
					runFarm(authToken, true);
					console.log("Farmed "+k+" * 80 actions(can't evaluate current actions)");
				}
				console.log("Routine finished, you may exit in around "+amount+" seconds.");
			break;
		}
	}

	function runUserScript() {
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

		function genericPayload(eventName, clientInfo) {
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

            var ariset = $("[aria-label='Settings']");
			var spx = document.createElement("span");
			spx.innerText = "AIDBF READY!";
			spx.style.color = $("[aria-label='Story']").firstChild.firstChild.firstChild.firstChild.style.color;
			spx.style.fontSize = "24px";
			spx.style.marginTop = "-7px";
            ariset.parentElement.insertBefore(spx, ariset);

			var cycle = async function (spx, auxBtn, fast) {
				var clientInfo = {
					"os": "web",
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
				spx.innerText = (await easy(Query4)).data.adCountdown.currentCount + " Actions";
				auxBtn.style.backgroundColor = auxBtn.ogBg;
				auxBtn.style.borderColor = auxBtn.ogBorder;
			};

			buildElement("div", { className: auxBtn.className }, x => {
				x.style.cssText = auxBtn.style.cssText;
				x.ogBg = x.style.backgroundColor = "#112244";
				x.ogBorder = x.style.borderColor = "#223355";
				x.onclick = cycle.bind(globalThis, spx, x, false);
				parent.appendChild(x);
				return x;
			},
				buildElement("div", { className: auxVisuals.className }, x => style(x, auxVisuals),
					buildElement("div", { className: auxText.className, innerText: "+80 ACTIONS" }, x => style(x, auxText))
				)
			);

			buildElement("div", { className: auxBtn.className }, x => {
				x.style.cssText = auxBtn.style.cssText;
				x.ogBg = x.style.backgroundColor = "#113355";
				x.ogBorder = x.style.borderColor = "#224466";
				x.onclick = cycle.bind(globalThis, spx, x, true);
				parent.appendChild(x);
				return x;
			},
				buildElement("div", { className: auxVisuals.className }, x => style(x, auxVisuals),
					buildElement("div", { className: auxText.className, innerText: "+80 ACTIONS [FAST]" }, x => style(x, auxText))
				)
			);
		}

		(function initalizeChain() {
			var ctr = 0;
			var timebk = globalThis.setTimeout;

			globalThis.setTimeout = function (a, b) {
				if (!document.location.href.includes("/main/adventurePlay"))
					return (globalThis.setTimeout = timebk)(a, b);
				if (a.toString().match(/function\(\){return \w+\(!0\)}/))
					console.log("[AIDBF] Capture: " + (++ctr));
				if (ctr >= 3) {
					var e = $('[aria-label="Commands list"]');
					if (!e) return timebk(a, b);
					routineAdventurePlay(e);
                    globalThis.setTimeout = timebk;
				}
				return timebk(a, b);
			};
		})();

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
	}
})();
