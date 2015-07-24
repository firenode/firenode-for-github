
require('org.pinf.genesis.lib/lib/api').forModule(require, module, function (API, exports) {

	// Expose a HTTP interface.
	exports["github.com/creationix/stack/0"] = function (req, res, next) {

console.log("req.url", req.url);
console.log("req.args", req.args);
console.log("req.params", req.params);
console.log("req.body", req.body);


		return res.end("Hello World!!!");
	}

});


/*

    app.post("/notify", function (req, res, next) {
        var r = res.r;
        var info = null;
        try {
            var payload = JSON.parse(req.body.payload);
            if (payload.ref) {
                var branchMatch = payload.ref.match(/^refs\/heads\/(.+)$/);
                if (branchMatch) {
                    info = {
                        id: "github.com/" + payload.repository.organization + "/" + payload.repository.name + "/build/" + payload.after,
                        repository: "github.com/" + payload.repository.organization + "/" + payload.repository.name,
                        commit: payload.after,
                        branch: branchMatch[1],
                        createdOn: (new Date(payload.head_commit.timestamp)).getTime(),
                        createdBy: "github.com/" + payload.pusher.name,
                        status: "pending"
                    };
                } else {
                    console.log("payload", JSON.stringify(payload, null, 4));
                    console.log("Warning: Ignoring event as branch '" + payload.ref + "' could not be matched!");
                }
            } else {
                console.log("payload", JSON.stringify(payload, null, 4));
                console.log("Warning: Ignoring event as branch '" + payload.ref + "' not set!");
            }
        } catch(err) {
            console.log("req.body.payload", req.body.payload);
            console.error("Error '" + err.message + "' parsing payload");
            return next(err);
        }
    }

*/

