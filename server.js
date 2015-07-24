
require('org.pinf.genesis.lib').forModule(require, module, function (API, exports) {


	API.VERBOSE = true;


	function establishStream (streamId, streamConfig) {

		API.console.verbose("Establish stream '" + streamId + "' with config:", streamConfig);

    	/*
    	// TODO: We may want to use the webhooks api instead of posting to pubsub links every time
    	//       we need to verify that hooks are created.
        return callGithub(userInfo, "GET", "/repos/" + org + "/" + repo + "/hooks", function(err, res, hooks) {
            if (err) return callback(err);
			
			console.log("hooks", hooks);

	        return callGithub(userInfo, "POST", "/repos/" + org + "/" + repo + "/hooks", {

	        }, function(err, res, result) {
	            if (err) return callback(err);

				console.log("result", result);
	        });
        });
		*/

		API.ASSERT.equal(typeof streamConfig.user, "object");
		API.ASSERT.equal(typeof streamConfig.user.accessToken, "string");
		API.ASSERT.equal(typeof streamConfig.channels, "object");

		function establishChannel (channelId, channelConfig) {

			return API.Q.denodeify(function (callback) {

				API.console.verbose("Establish channel '" + channelId + "' in stream '" + streamId + "' with config:", channelConfig);

				API.ASSERT.equal(typeof channelConfig.org, "string");
				API.ASSERT.equal(typeof channelConfig.repo, "string");
				API.ASSERT.equal(typeof channelConfig.event, "string");

				var callbackUrl = "http://test.com";
				var callbackSecret = "secret!!";

	console.log("callbackUrl", callbackUrl);

				var subscribeUrl = "https://api.github.com/hub";
				return API.REQUEST({
					method: "POST",
		            url: subscribeUrl,
		            headers: {
		                "User-Agent": "nodejs/request"
		            },
		            form: {
		        		"hub.mode": "subscribe",
		        		"hub.topic": "https://github.com/" + channelConfig.org + "/" + channelConfig.repo + "/events/" + channelConfig.event,
		        		"hub.secret": callbackSecret,
		        		"hub.callback": callbackUrl
	//	        		"hub.callback": HELPERS.makePublicklyAccessible(config.notificationUrl)
		            },
		            auth: {
		            	user: "user",
		            	pass: streamConfig.user.accessToken
		            }
		        }, function (err, res, body) {

console.log("subscribe response", body);

		            if (err) return callback(err);
		            if (res.statusCode === 422) {
		                console.log("userInfo", userInfo);
		                console.error("Got status '" + res.statusCode + "' for url '" + subscribeUrl + "'! This is likely due to NOT HAVING ACCESS to this API call because your OAUTH SCOPE is too narrow! You neeed 'write:repo_hook' access. See: https://developer.github.com/v3/oauth/#scopes", res.headers);
	/*
	// TODO: Upgrade auth scope ...
		                var scope = "write:repo_hook";
		                if (scope) {
		                    console.log("We are going to start a new oauth session with the new require scope added ...");
		                    var err = new Error("Insufficient privileges. Should start new session with added scope: " + scope);
		                    err.code = 403;
		                    err.requestScope = scope;
		                    return callback(err);
		                }
	*/	                
		                return callback(new Error("Insufficient privileges. There should be a scope upgrade handler declared!"));
		            }
		            if (res.statusCode !== 204) {
		                return callback(new Error("Got status '" + res.statusCode + "' while creating hook!"));
		            }
		        	// Hook successfully created!
					return callback(null);
		        });
			})();
		}

		return API.Q.all(Object.keys(streamConfig.channels).map(function (channelId) {
			return establishChannel(channelId, streamConfig.channels[channelId]);
		}));
	}

	function establishStreams () {
console.log("API.config.streams", API.config);
		if (
			!API.config ||
			!API.config.streams
		) {
			return API.Q.resolve();
		}

		return API.Q.all(Object.keys(API.config.streams).map(function (streamId) {
			return establishStream(streamId, API.config.streams[streamId]);
		}));
	}

	return establishStreams();
});
