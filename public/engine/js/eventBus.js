var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Lich;
(function (Lich) {
    var EventType;
    (function (EventType) {
        EventType[EventType["ACHIEVEMENT_PROGRESS"] = 0] = "ACHIEVEMENT_PROGRESS";
        EventType[EventType["ACHIEVEMENT_DONE"] = 1] = "ACHIEVEMENT_DONE";
        EventType[EventType["LOADER_COLOR_CHANGE"] = 2] = "LOADER_COLOR_CHANGE";
        EventType[EventType["LOADER_NAME_CHANGE"] = 3] = "LOADER_NAME_CHANGE";
        EventType[EventType["LOAD_START"] = 4] = "LOAD_START";
        EventType[EventType["LOAD_PROGRESS"] = 5] = "LOAD_PROGRESS";
        EventType[EventType["LOAD_ITEM"] = 6] = "LOAD_ITEM";
        EventType[EventType["LOAD_FINISHED"] = 7] = "LOAD_FINISHED";
        EventType[EventType["HEALTH_CHANGE"] = 8] = "HEALTH_CHANGE";
        EventType[EventType["WILL_CHANGE"] = 9] = "WILL_CHANGE";
        EventType[EventType["MOUSE_MOVE"] = 10] = "MOUSE_MOVE";
        EventType[EventType["PLAYER_SPEED_CHANGE"] = 11] = "PLAYER_SPEED_CHANGE";
        EventType[EventType["FPS_CHANGE"] = 12] = "FPS_CHANGE";
        EventType[EventType["POINTED_AREA_CHANGE"] = 13] = "POINTED_AREA_CHANGE";
        EventType[EventType["SAVE_WORLD"] = 14] = "SAVE_WORLD";
        EventType[EventType["LOAD_WORLD"] = 15] = "LOAD_WORLD";
        EventType[EventType["NEW_WORLD"] = 16] = "NEW_WORLD";
        EventType[EventType["MAP_SHIFT_X"] = 17] = "MAP_SHIFT_X";
        EventType[EventType["MAP_SHIFT_Y"] = 18] = "MAP_SHIFT_Y";
        EventType[EventType["ENEMY_COUNT_CHANGE"] = 19] = "ENEMY_COUNT_CHANGE";
        EventType[EventType["PLAYER_POSITION_CHANGE"] = 20] = "PLAYER_POSITION_CHANGE";
        EventType[EventType["SURFACE_CHANGE"] = 21] = "SURFACE_CHANGE";
        EventType[EventType["WORKSTATION_CHANGE"] = 22] = "WORKSTATION_CHANGE";
        EventType[EventType["WORKSTATION_UNREACHABLE"] = 23] = "WORKSTATION_UNREACHABLE";
        EventType[EventType["MINIMAP_UPDATE"] = 24] = "MINIMAP_UPDATE";
        EventType[EventType["MAP_UPDATE"] = 25] = "MAP_UPDATE";
        EventType[EventType["RECIPES_CHANGE"] = 26] = "RECIPES_CHANGE";
        EventType[EventType["SURFACE_REVEAL"] = 27] = "SURFACE_REVEAL";
        EventType[EventType["INV_CHANGE"] = 28] = "INV_CHANGE";
        EventType[EventType["GC_CHANGE"] = 29] = "GC_CHANGE";
    })(EventType = Lich.EventType || (Lich.EventType = {}));
    var EventPayload = (function () {
        function EventPayload(type) {
            this.type = type;
        }
        return EventPayload;
    }());
    var SimpleEventPayload = (function (_super) {
        __extends(SimpleEventPayload, _super);
        function SimpleEventPayload(type) {
            return _super.call(this, type) || this;
        }
        return SimpleEventPayload;
    }(EventPayload));
    Lich.SimpleEventPayload = SimpleEventPayload;
    var StringEventPayload = (function (_super) {
        __extends(StringEventPayload, _super);
        function StringEventPayload(type, payload) {
            var _this = _super.call(this, type) || this;
            _this.payload = payload;
            return _this;
        }
        return StringEventPayload;
    }(EventPayload));
    Lich.StringEventPayload = StringEventPayload;
    var NumberEventPayload = (function (_super) {
        __extends(NumberEventPayload, _super);
        function NumberEventPayload(type, payload) {
            var _this = _super.call(this, type) || this;
            _this.payload = payload;
            return _this;
        }
        return NumberEventPayload;
    }(EventPayload));
    Lich.NumberEventPayload = NumberEventPayload;
    var TupleEventPayload = (function (_super) {
        __extends(TupleEventPayload, _super);
        function TupleEventPayload(type, x, y) {
            var _this = _super.call(this, type) || this;
            _this.x = x;
            _this.y = y;
            return _this;
        }
        return TupleEventPayload;
    }(EventPayload));
    Lich.TupleEventPayload = TupleEventPayload;
    var InvChangeEventPayload = (function (_super) {
        __extends(InvChangeEventPayload, _super);
        function InvChangeEventPayload(key, amount) {
            var _this = _super.call(this, EventType.INV_CHANGE) || this;
            _this.key = key;
            _this.amount = amount;
            return _this;
        }
        return InvChangeEventPayload;
    }(EventPayload));
    Lich.InvChangeEventPayload = InvChangeEventPayload;
    var PointedAreaEventPayload = (function (_super) {
        __extends(PointedAreaEventPayload, _super);
        function PointedAreaEventPayload(clsnx, clsny, clsnHit, partsOffsetX, partsOffsetY, tileType, tileVariant, secx, secy) {
            var _this = _super.call(this, EventType.POINTED_AREA_CHANGE) || this;
            _this.clsnx = clsnx;
            _this.clsny = clsny;
            _this.clsnHit = clsnHit;
            _this.partsOffsetX = partsOffsetX;
            _this.partsOffsetY = partsOffsetY;
            _this.tileType = tileType;
            _this.tileVariant = tileVariant;
            _this.secx = secx;
            _this.secy = secy;
            return _this;
        }
        return PointedAreaEventPayload;
    }(EventPayload));
    Lich.PointedAreaEventPayload = PointedAreaEventPayload;
    var HealthChangeEventPayload = (function (_super) {
        __extends(HealthChangeEventPayload, _super);
        function HealthChangeEventPayload(maxHealth, currentHealth) {
            var _this = _super.call(this, EventType.HEALTH_CHANGE) || this;
            _this.maxHealth = maxHealth;
            _this.currentHealth = currentHealth;
            return _this;
        }
        return HealthChangeEventPayload;
    }(EventPayload));
    Lich.HealthChangeEventPayload = HealthChangeEventPayload;
    var WillChangeEventPayload = (function (_super) {
        __extends(WillChangeEventPayload, _super);
        function WillChangeEventPayload(maxWill, currentWill) {
            var _this = _super.call(this, EventType.WILL_CHANGE) || this;
            _this.maxWill = maxWill;
            _this.currentWill = currentWill;
            return _this;
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
