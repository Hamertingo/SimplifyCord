import bootstrapApp from "../class/Client.js";

new bootstrapApp({ 
    autoImport: ["src/test/commands", "src/test/events"],
    token: "",
    loadLogs: true
    //commands: {
    //    guilds: [""],
    //}
}); 