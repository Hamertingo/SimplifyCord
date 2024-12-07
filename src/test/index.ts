import { bootstrapApp } from "../class";
import "dotenv/config";

new bootstrapApp({ 
    autoImport: ["src/test/commands"],
    token: "MTI1MzUzNjc3NDk1MzYzNTg4MA.GbVJaS.SDzvsQnrWQfriw0rpePXXBW6g9Q64jGn7LQqgU",
    loadLogs: true,
    commands: {
        guilds: ["1253532718755745855"]
    }
});