namespace Lich {

    enum Method {
        GET, PUT, POST, DELETE
    }

    export class DB {

        private static createUserKey(): string {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < 10; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        }

        private static getUserKey(): string {
            let key = Cookies.get(Resources.COOKIE_KEY);
            if (key) {
                return key;
            } else {
                key = DB.createUserKey();
                Cookies.set(Resources.COOKIE_KEY, key, { expires: 10 * 365 });
                return key;
            }
        }

        private static getUserId(userKey: string): number {
            // nejprve získám 'rychle' id dle userKey
            let response = DB.runREST('profiles/?userKey=' + userKey, Method.GET);
            if (response.status == 200) {
                // účet již existuje
                if (response.responseJSON && response.responseJSON[0] && response.responseJSON[0].userId) {
                    let userId = response.responseJSON[0].userId;
                    console.log("User '" + userKey + "' profile found in DB as '" + userId + "'");
                    return userId;
                } else {
                    // uživatel je tady nový, založ profil a dummy save
                    console.log("User '" + userKey + "' profile not found in DB -- creating one");
                    response = DB.runREST('saves/', Method.POST, undefined, {
                        userKey: userKey,
                        data: {}
                    });
                    if (response.status == 201 && response.responseJSON) {
                        let userId = response.responseJSON.id;
                        if (userId) {
                            response = DB.runREST('profiles/', Method.POST, undefined, {
                                userKey: userKey,
                                userId: userId
                            });
                            if (response.status == 201 && response.responseJSON) {
                                console.log("A profile (userId: '" + userId + "') for the new user '" + userKey + "' was successfully created");
                                return userId;
                            }
                        }
                    }
                    console.log("Failed to create new profile for user '" + userKey + "'");
                }
            }
            console.log("User '" + userKey + "' profile search failed (response.status = " + response.status + ")");
            return null;
        }

        public static saveData(data) :boolean {
            let userKey = DB.getUserKey();
            console.log("Trying to do SAVE for user '" + userKey + "'");
            let userId = DB.getUserId(userKey);
            let resp = DB.runREST('saves/' + userId, Method.PUT, undefined, {
                userKey: userKey,
                data: data
            });
            return resp.status == 200;
        }

        public static loadData() {
            let userKey = DB.getUserKey();
            console.log("Trying to do LOAD for user '" + userKey + "'");
            let userId = DB.getUserId(userKey);
            let response = DB.runREST('saves/' + userId, Method.GET);
            if (response.status == 200 && response.responseJSON) {
                return response.responseJSON.data;
            } else {
                return null;
            }
        }

        private static runREST(url: string,
            method: Method,
            options: {
                async: boolean,
                onSuccess?: (arg: any) => void,
                onError?: (arg: any) => void
            } = { async: false },
            data?
        ): JQueryXHR {
            let args: any = {
                url: url,
                type: Method[method],
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
            };
            return jQuery.ajax(args);
        }
    }
}