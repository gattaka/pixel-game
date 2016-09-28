namespace Lich {

    export enum EventType {
        HEALTH_CHANGE,
        MOUSE_MOVE,
        FPS_CHANGE,
        POINTED_AREA_CHANGE
    }

    abstract class EventPayload {
        constructor(public type: EventType) { }
    }

    export class NumberEventPayload extends EventPayload {
        constructor(type: EventType, public payload: number) { super(type); }
    }

    export class MouseMoveEventPayload extends EventPayload {
        constructor(public x: number, public y: number) { super(EventType.MOUSE_MOVE); }
    }

    export class PointedAreaEventPayload extends EventPayload {
        constructor(public clsnx: number, public clsny: number, public clsnHit: boolean,
            public tileType: number,
            public secx: number, public secy: number) { super(EventType.POINTED_AREA_CHANGE); }
    }

    export class EventBus {

        static INSTANCE: EventBus;

        consumers: { [key: number]: Array<(payload: EventPayload) => void> } = {};

        public static getInstance() {
            if (!EventBus.INSTANCE) {
                EventBus.INSTANCE = new EventBus();
            }
            return EventBus.INSTANCE;
        }

        private constructor() { }

        public fireEvent(argument: EventPayload) {
            let array = this.consumers[argument.type];
            if (array) {
                for (let consumer of array) {
                    consumer(argument);
                }
            }
        }

        public registerConsumer(type: EventType, callback: (payload: EventPayload) => void) {
            let array = this.consumers[type];
            if (!array) {
                array = new Array<(payload: EventPayload) => void>();
                this.consumers[type.toString()] = array;
            }
            array.push(callback);
        }

    }

}