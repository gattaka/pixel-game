var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    (function (EventType) {
        EventType[EventType["HEALTH_CHANGE"] = 0] = "HEALTH_CHANGE";
        EventType[EventType["MOUSE_MOVE"] = 1] = "MOUSE_MOVE";
        EventType[EventType["FPS_CHANGE"] = 2] = "FPS_CHANGE";
        EventType[EventType["POINTED_AREA_CHANGE"] = 3] = "POINTED_AREA_CHANGE";
    })(Lich.EventType || (Lich.EventType = {}));
    var EventType = Lich.EventType;
    var EventPayload = (function () {
        function EventPayload(type) {
            this.type = type;
        }
        return EventPayload;
    }());
    var NumberEventPayload = (function (_super) {
        __extends(NumberEventPayload, _super);
        function NumberEventPayload(type, payload) {
            _super.call(this, type);
            this.payload = payload;
        }
        return NumberEventPayload;
    }(EventPayload));
    Lich.NumberEventPayload = NumberEventPayload;
    var MouseMoveEventPayload = (function (_super) {
        __extends(MouseMoveEventPayload, _super);
        function MouseMoveEventPayload(x, y) {
            _super.call(this, EventType.MOUSE_MOVE);
            this.x = x;
            this.y = y;
        }
        return MouseMoveEventPayload;
    }(EventPayload));
    Lich.MouseMoveEventPayload = MouseMoveEventPayload;
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
        EventBus.prototype.fireEvent = function (argument) {
            var array = this.consumers[argument.type];
            if (array) {
                for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
                    var consumer = array_1[_i];
                    consumer(argument);
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
