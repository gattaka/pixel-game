var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    (function (EventType) {
        EventType[EventType["LOAD_PROGRESS"] = 0] = "LOAD_PROGRESS";
        EventType[EventType["LOAD_ITEM"] = 1] = "LOAD_ITEM";
        EventType[EventType["LOAD_FINISHED"] = 2] = "LOAD_FINISHED";
        EventType[EventType["HEALTH_CHANGE"] = 3] = "HEALTH_CHANGE";
        EventType[EventType["WILL_CHANGE"] = 4] = "WILL_CHANGE";
        EventType[EventType["MOUSE_MOVE"] = 5] = "MOUSE_MOVE";
        EventType[EventType["PLAYER_SPEED_CHANGE"] = 6] = "PLAYER_SPEED_CHANGE";
        EventType[EventType["FPS_CHANGE"] = 7] = "FPS_CHANGE";
        EventType[EventType["POINTED_AREA_CHANGE"] = 8] = "POINTED_AREA_CHANGE";
        EventType[EventType["SAVE_WORLD"] = 9] = "SAVE_WORLD";
        EventType[EventType["LOAD_WORLD"] = 10] = "LOAD_WORLD";
        EventType[EventType["NEW_WORLD"] = 11] = "NEW_WORLD";
        EventType[EventType["MAP_SHIFT_X"] = 12] = "MAP_SHIFT_X";
        EventType[EventType["MAP_SHIFT_Y"] = 13] = "MAP_SHIFT_Y";
        EventType[EventType["PLAYER_POSITION_CHANGE"] = 14] = "PLAYER_POSITION_CHANGE";
    })(Lich.EventType || (Lich.EventType = {}));
    var EventType = Lich.EventType;
    var EventPayload = (function () {
        function EventPayload(type) {
            this.type = type;
        }
        return EventPayload;
    }());
    var SimpleEventPayload = (function (_super) {
        __extends(SimpleEventPayload, _super);
        function SimpleEventPayload(type) {
            _super.call(this, type);
        }
        return SimpleEventPayload;
    }(EventPayload));
    Lich.SimpleEventPayload = SimpleEventPayload;
    var StringEventPayload = (function (_super) {
        __extends(StringEventPayload, _super);
        function StringEventPayload(type, payload) {
            _super.call(this, type);
            this.payload = payload;
        }
        return StringEventPayload;
    }(EventPayload));
    Lich.StringEventPayload = StringEventPayload;
    var NumberEventPayload = (function (_super) {
        __extends(NumberEventPayload, _super);
        function NumberEventPayload(type, payload) {
            _super.call(this, type);
            this.payload = payload;
        }
        return NumberEventPayload;
    }(EventPayload));
    Lich.NumberEventPayload = NumberEventPayload;
    var TupleEventPayload = (function (_super) {
        __extends(TupleEventPayload, _super);
        function TupleEventPayload(type, x, y) {
            _super.call(this, type);
            this.x = x;
            this.y = y;
        }
        return TupleEventPayload;
    }(EventPayload));
    Lich.TupleEventPayload = TupleEventPayload;
    var PointedAreaEventPayload = (function (_super) {
        __extends(PointedAreaEventPayload, _super);
        function PointedAreaEventPayload(clsnx, clsny, clsnHit, tileType, secx, secy) {
            _super.call(this, EventType.POINTED_AREA_CHANGE);
            this.clsnx = clsnx;
            this.clsny = clsny;
            this.clsnHit = clsnHit;
            this.tileType = tileType;
            this.secx = secx;
            this.secy = secy;
        }
        return PointedAreaEventPayload;
    }(EventPayload));
    Lich.PointedAreaEventPayload = PointedAreaEventPayload;
    var HealthChangeEventPayload = (function (_super) {
        __extends(HealthChangeEventPayload, _super);
        function HealthChangeEventPayload(maxHealth, currentHealth) {
            _super.call(this, EventType.HEALTH_CHANGE);
            this.maxHealth = maxHealth;
            this.currentHealth = currentHealth;
        }
        return HealthChangeEventPayload;
    }(EventPayload));
    Lich.HealthChangeEventPayload = HealthChangeEventPayload;
    var WillChangeEventPayload = (function (_super) {
        __extends(WillChangeEventPayload, _super);
        function WillChangeEventPayload(maxWill, currentWill) {
            _super.call(this, EventType.WILL_CHANGE);
            this.maxWill = maxWill;
            this.currentWill = currentWill;
        }
        return WillChangeEventPayload;
    }(EventPayload));
    Lich.WillChangeEventPayload = WillChangeEventPayload;
    var EventBus = (function () {
        function EventBus() {
            this.consumers = {};
        }
        EventBus.getInstance = function () {
            if (!EventBus.INSTANCE) {
                EventBus.INSTANCE = new EventBus();
            }
            return EventBus.INSTANCE;
        };
        EventBus.prototype.clear = function () {
            this.consumers = {};
        };
        EventBus.prototype.fireEvent = function (argument) {
            var array = this.consumers[argument.type];
            if (array) {
                for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
                    var consumer = array_1[_i];
                    if (consumer) {
                        var consumed = consumer(argument);
                        if (consumed)
                            break;
                    }
                }
            }
        };
        EventBus.prototype.unregisterConsumer = function (type, callback) {
            var array = this.consumers[type];
            for (var i = 0; i < array.length; i++) {
                if (array[i] == callback) {
                    array[i] = undefined;
                }
            }
        };
        EventBus.prototype.registerConsumer = function (type, callback) {
            var array = this.consumers[type];
            if (!array) {
                array = new Array();
                this.consumers[type.toString()] = array;
            }
            array.push(callback);
        };
        return EventBus;
    }());
    Lich.EventBus = EventBus;
})(Lich || (Lich = {}));
