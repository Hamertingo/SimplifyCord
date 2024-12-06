import bootstrapApp from "../class/Client.js";

new bootstrapApp({ 
    autoImport: ["src/test/commands", "src/test/events"],
    loadLogs: true
    //commands: {
    //    guilds: [""],
    //}
}); 