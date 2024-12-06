import { Client, ClientEvents } from "discord.js";
interface EventData<EventName extends keyof ClientEvents> {
    name: string;
    event: EventName;
    once?: boolean;
    run(...args: ClientEvents[EventName]): void;
}
export declare class Event<EventName extends keyof ClientEvents> {
    private static items;
    constructor(data: EventData<EventName>);
    static register(client: Client): void;
    static loadLogs(): void;
}
export {};
