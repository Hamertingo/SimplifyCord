"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class CreateSelect {
    UserSelectMenuBuilder(menuData) {
        try {
            const placeholder = menuData.placeholder;
            const useOptionInLastParam = menuData.getValueInLastParam;
            let customId = menuData.customId;
            let minValue = menuData.minValue;
            let maxValue = menuData.maxValue;
            if (!customId)
                throw new Error('>> SelectMenu custom_id is required');
            if (!placeholder)
                throw new Error('>> SelectMenu placeholder is required');
            if (useOptionInLastParam)
                customId += '(OILP)';
            if (minValue === undefined)
                minValue = 1;
            if (maxValue === undefined)
                maxValue = 1;
            const selectMenu = new discord_js_1.UserSelectMenuBuilder();
            selectMenu.setCustomId(customId);
            selectMenu.setPlaceholder(placeholder);
            selectMenu.setMinValues(minValue);
            selectMenu.setMaxValues(maxValue);
            return selectMenu;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    StringSelectMenuBuilder(menuData) {
        try {
            const placeholder = menuData.placeholder;
            const useOptionInLastParam = menuData.getValueInLastParam;
            let customId = menuData.customId;
            let minValue = menuData.minValue;
            let maxValue = menuData.maxValue;
            if (!customId)
                throw new Error('>> SelectMenu custom_id is required');
            if (!placeholder)
                throw new Error('>> SelectMenu placeholder is required');
            if (useOptionInLastParam)
                customId += '(OILP)';
            if (minValue === undefined)
                minValue = 1;
            if (maxValue === undefined)
                maxValue = 1;
            if (!menuData.options || menuData.options.length <= 0)
                throw new Error('>> SelectMenu options is required. You need to pass an array of options');
            const selectMenu = new discord_js_1.StringSelectMenuBuilder();
            selectMenu.setCustomId(customId);
            selectMenu.setPlaceholder(placeholder);
            selectMenu.setMinValues(minValue);
            selectMenu.setMaxValues(maxValue);
            menuData.options.forEach(option => {
                if (!option.label)
                    throw new Error('>> SelectMenu option label is required');
                if (!option.value)
                    throw new Error('>> SelectMenu option value is required');
                const optionBuilder = new discord_js_1.StringSelectMenuOptionBuilder();
                optionBuilder.setLabel(option.label);
                optionBuilder.setValue(String(option.value));
                if (option.emoji)
                    optionBuilder.setEmoji(option.emoji);
                if (option.description)
                    optionBuilder.setDescription(option.description);
                if (option.default)
                    optionBuilder.setDefault(option.default);
                selectMenu.addOptions(optionBuilder);
            });
            return selectMenu;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    ChannelSelectMenuBuilder(menuData) {
        try {
            const placeholder = menuData.placeholder;
            const useOptionInLastParam = menuData.getValueInLastParam;
            let customId = menuData.customId;
            let minValue = menuData.minValue;
            let maxValue = menuData.maxValue;
            let type = menuData.type;
            if (!customId)
                throw new Error('>> SelectMenu custom_id is required');
            if (!placeholder)
                throw new Error('>> SelectMenu placeholder is required');
            if (useOptionInLastParam)
                customId += '(OILP)';
            if (minValue === undefined)
                minValue = 1;
            if (maxValue === undefined)
                maxValue = 1;
            if (!type)
                type = discord_js_1.ChannelType.GuildText;
            const selectMenu = new discord_js_1.ChannelSelectMenuBuilder();
            selectMenu.setCustomId(customId);
            selectMenu.setPlaceholder(placeholder);
            selectMenu.setMinValues(minValue);
            selectMenu.setMaxValues(maxValue);
            selectMenu.setChannelTypes(type);
            return selectMenu;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    RoleSelectMenuBuilder(menuData) {
        try {
            const placeholder = menuData.placeholder;
            const useOptionInLastParam = menuData.getValueInLastParam;
            let customId = menuData.customId;
            let minValue = menuData.minValue;
            let maxValue = menuData.maxValue;
            if (!customId)
                throw new Error('>> SelectMenu custom_id is required');
            if (!placeholder)
                throw new Error('>> SelectMenu placeholder is required');
            if (useOptionInLastParam)
                customId += '(OILP)';
            if (minValue === undefined)
                minValue = 1;
            if (maxValue === undefined)
                maxValue = 1;
            const selectMenu = new discord_js_1.RoleSelectMenuBuilder();
            selectMenu.setCustomId(customId);
            selectMenu.setPlaceholder(placeholder);
            selectMenu.setMinValues(minValue);
            selectMenu.setMaxValues(maxValue);
            return selectMenu;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.default = CreateSelect;
