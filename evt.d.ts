export interface EventCallback<T> {
    (evt: T): boolean | void;
}
export declare class EventDispatcher<EventMap> {
    listeners: Map<string, Set<EventCallback<keyof EventMap>>>;
    constructor();
    private getListenerType;
    listen<K extends keyof EventMap>(type: K, cb: EventCallback<EventMap[K]>): this;
    deafen<K extends keyof EventMap>(type: K, cb: EventCallback<EventMap[K]>): this;
    fire<K extends keyof EventMap>(type: K, evt: EventMap[K], cancelable?: boolean): this;
}
