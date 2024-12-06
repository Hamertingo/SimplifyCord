import { Event } from "class";

new Event({
    name: "Ready Event",
    event: "ready",
    async run() {
        console.log(`Bot está online!`);
    },
});
