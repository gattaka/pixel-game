var Lich;
(function (Lich) {
    var Method;
    (function (Method) {
        Method[Method["GET"] = 0] = "GET";
        Method[Method["PUT"] = 1] = "PUT";
        Method[Method["POST"] = 2] = "POST";
        Method[Method["DELETE"] = 3] = "DELETE";
    })(Method || (Method = {}));
    var DB = (function () {
        function DB() {
        }
        DB.createUserKey = function () {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < 10; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        };
        DB.getUserKey = function () {
            var key = Cookies.get(Lich.Resources.COOKIE_KEY);
            if (key) {
                return key;
            }
            else {
                key = DB.createUserKey();
                Cookies.set(Lich.Resources.COOKIE_KEY, key, { expires: 10 * 365 });
                return key;
            }
        };
        DB.getUserId = function (userKey) {
            // nejprve získám 'rychle' id dle userKey
            var response = DB.runREST('profiles/?userKey=' + userKey, Method.GET);
            if (response.status == 200 && response.responseJSON) {
                // účet již existuje
                var userId = response.responseJSON.userId;
                if (userId) {
                    console.log("User '" + userKey + "' profile found in DB as '" + userId + "'");
                    return userId;
                }
            }
            if (response.status == 404) {
                // uživatel je tady nový, založ profil a dummy save
                console.log("User '" + userKey + "' profile not found in DB -- creating one");
                response = DB.runREST('saves/' + userKey, Method.POST, null, {
                    userKey: userKey,
                    data: {}
                });
                if (response.status == 200 && response.responseJSON) {
                    var userId = response.responseJSON.id;
                    if (userId) {
                        response = DB.runREST('profiles/' + userKey, Method.POST, null, {
                            userKey: userKey,
                            userId: userId
                        });
                        if (response.status == 200 && response.responseJSON) {
                            console.log("A profile (userId: '" + userId + "') for the new user '" + userKey + "' was successfully created");
                            return userId;
                        }
                    }
                }
                console.log("Failed to create new profile for user '" + userKey + "'");
            }
            console.log("User '" + userKey + "' profile search failed");
            return null;
        };
        DB.saveData = function (data) {
            var userKey = DB.getUserKey();
            console.log("Trying to do SAVE for user '" + userKey + "'");
            var userId = DB.getUserId(userKey);
            return DB.runREST('saves/' + userId, Method.PUT, null, {
                userKey: userKey,
                data: data
            });
        };
        DB.loadData = function () {
            var userKey = DB.getUserKey();
            console.log("Trying to do LOAD for user '" + userKey + "'");
            var userId = DB.getUserId(userKey);
            var response = DB.runREST('saves/' + userId, Method.GET);
            if (response.status == 200 && response.responseJSON) {
                return response.responseJSON.data;
            }
            else {
                return null;
            }
        };
        DB.runREST = function (url, method, options, data) {
            var args = {
                url: url,
                type: Method[method]
            };
            if (options) {
                args.async = options.async;
                args.onSuccess = options.onSuccess;
                args.onError = options.onError;
            }
            switch (method) {
                case Method.POST:
                case Method.PUT:
                    args.contentType = 'application/json';
                    args.processData = false;
                    args.data = JSON.stringify(data);
            }
            ;
            return jQuery.ajax(args);
        };
        return DB;
    }());
    Lich.DB = DB;
})(Lich || (Lich = {}));
