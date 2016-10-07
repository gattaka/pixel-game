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
            if (response.status == 200) {
                // účet již existuje
                if (response.responseJSON && response.responseJSON[0] && response.responseJSON[0].userId) {
                    var userId = response.responseJSON[0].userId;
                    console.log("User '" + userKey + "' profile found in DB as '" + userId + "'");
                    return userId;
                }
                else {
                    // uživatel je tady nový, založ profil a dummy save
                    console.log("User '" + userKey + "' profile not found in DB -- creating one");
                    response = DB.runREST('saves/', Method.POST, undefined, {
                        userKey: userKey,
                        data: {}
                    });
                    if (response.status == 201 && response.responseJSON) {
                        var userId = response.responseJSON.id;
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
        };
        DB.saveData = function (data) {
            var userKey = DB.getUserKey();
            console.log("Trying to do SAVE for user '" + userKey + "'");
            var userId = DB.getUserId(userKey);
            var resp = DB.runREST('saves/' + userId, Method.PUT, undefined, {
                userKey: userKey,
                data: data
            });
            return resp.status == 200;
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
            if (options === void 0) { options = { async: false }; }
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
    var IndexedDB = (function () {
        function IndexedDB() {
            this.dbVersion = 1.0;
            this.dbName = "lich";
            this.objectstoreName = "saves";
            this.itemName = "savedMap";
            this.todo = new Array();
            var self = this;
            // IndexedDB
            var indexedDB = window.indexedDB || window["webkitIndexedDB"] || window["mozIndexedDB"] || window["OIndexedDB"] || window["msIndexedDB"];
            var IDBTransaction = window["IDBTransaction"] || window["webkitIDBTransaction"] || window["OIDBTransaction"] || window["msIDBTransaction"];
            // Create/open database
            var request = indexedDB.open(this.dbName, this.dbVersion);
            var createObjectStore = function (database) {
                // Create an objectStore
                console.log("Creating objectStore");
                database.createObjectStore(self.objectstoreName);
            };
            request.onerror = function (event) {
                console.log("Error creating/accessing IndexedDB database");
            };
            request.onsuccess = function (event) {
                console.log("Success creating/accessing IndexedDB database");
                self.db = request.result;
                self.db.onerror = function (event) {
                    console.log("Error creating/accessing IndexedDB database");
                };
                // Interim solution for Google Chrome to create an objectStore. Will be deprecated
                if (self.db.setVersion) {
                    if (self.db.version != self.dbVersion) {
                        var setVersion = self.db.setVersion(self.dbVersion);
                        setVersion.onsuccess = function () {
                            createObjectStore(self.db);
                            self.makeReady();
                        };
                    }
                }
                else {
                    self.makeReady();
                }
            };
            // For future use. Currently only in latest Firefox versions
            request.onupgradeneeded = function (event) {
                createObjectStore(event.target.result);
            };
        }
        IndexedDB.getInstance = function () {
            if (!IndexedDB.INSTANCE) {
                IndexedDB.INSTANCE = new IndexedDB();
            }
            return IndexedDB.INSTANCE;
        };
        IndexedDB.prototype.makeReady = function () {
            this.ready = true;
            this.todo.forEach(function (e) {
                if (e) {
                    e();
                }
            });
        };
        IndexedDB.prototype.loadData = function (callback) {
            var _this = this;
            var operation = function () {
                var transaction = _this.openTransaction();
                // Retrieve the file that was just stored
                transaction.objectStore(_this.objectstoreName).get(_this.itemName).onsuccess = function (event) {
                    var result = event.target.result;
                    if (result) {
                        console.log("Load:" + result.length);
                    }
                    else {
                        console.log("Load failed -- no data found");
                    }
                    callback(result);
                };
            };
            if (this.ready) {
                operation();
            }
            else {
                this.todo.push(operation);
            }
        };
        IndexedDB.prototype.saveData = function (data) {
            var _this = this;
            var operation = function () {
                console.log("Save:" + data.length);
                // Put the blob into the dabase
                var transaction = _this.openTransaction();
                var put = transaction.objectStore(_this.objectstoreName).put(data, _this.itemName);
            };
            if (this.ready) {
                operation();
            }
            else {
                this.todo.push(operation);
            }
            // TODO
            return true;
        };
        IndexedDB.prototype.openTransaction = function () {
            // Open a transaction to the database
            var readWriteMode = typeof IDBTransaction.READ_WRITE == "undefined" ? "readwrite" : IDBTransaction.READ_WRITE;
            var transaction = this.db.transaction([this.objectstoreName], readWriteMode);
            return transaction;
        };
        return IndexedDB;
    }());
    Lich.IndexedDB = IndexedDB;
})(Lich || (Lich = {}));
