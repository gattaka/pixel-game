namespace Lich {

    export enum EventType {
        LOAD_PROGRESS,
        LOAD_ITEM,
        LOAD_FINISHED,
        HEALTH_CHANGE,
        WILL_CHANGE,
        MOUSE_MOVE,
        FPS_CHANGE,
        POINTED_AREA_CHANGE,
        SAVE_WORLD,
        LOAD_WORLD,
        NEW_WORLD
    }

    abstract class EventPayload {
        constructor(public type: EventType) { }
    }

    export class SimpleEventPayload extends EventPayload {
        constructor(type: EventType) { super(type); }
    }

    export class StringEventPayload extends EventPayload {
        constructor(type: EventType, public payload: string) { super(type); }
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

    export class HealthChangeEventPayload extends EventPayload {
        constructor(public maxHealth: number, public currentHealth: number) { super(EventType.HEALTH_CHANGE); }
    }

    export class WillChangeEventPayload extends EventPayload {
        constructor(public maxWill: number, public currentWill: number) { super(EventType.WILL_CHANGE); }
    }

    export class EventBus {

        private static INSTANCE: EventBus;

        consumers: { [key: number]: Array<(payload: EventPayload) => boolean> } = {};

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
                    let consumed: boolean = consumer(argument);
                    if (consumed)
                        break;
                }
            }
        }

        public registerConsumer(type: EventType, callback: (payload: EventPayload) => boolean) {
            let array = this.consumers[type];
            if (!array) {
                array = new Array<(payload: EventPayload) => boolean>();
                this.consumers[type.toString()] = array;
            }
            array.push(callback);
        }

    }

}