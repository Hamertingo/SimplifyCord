"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slashCommandHandlers = void 0;
exports.slashCommandHandlers = new Map();
class default_1 {
    constructor(options) {
        exports.slashCommandHandlers.set(options.name, options);
    }
}
exports.default = default_1;
