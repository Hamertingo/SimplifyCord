import { UserSelectMenuBuilder, StringSelectMenuBuilder, ChannelSelectMenuBuilder, RoleSelectMenuBuilder, ChannelType } from 'discord.js';
interface OptionData {
    label: string;
    value: string | number;
    emoji?: string;
    description?: string;
    default?: boolean;
}
interface MenuData {
    customId: string;
    placeholder: string;
    minValue?: number;
    maxValue?: number;
    type?: ChannelType;
    getValueInLastParam?: boolean;
}
interface MenuStringData {
    customId: string;
    placeholder: string;
    options: OptionData[];
    minValue?: number;
    maxValue?: number;
    type?: ChannelType;
    getValueInLastParam?: boolean;
}
export default class CreateSelect {
    UserSelectMenuBuilder(menuData: MenuData): UserSelectMenuBuilder;
    StringSelectMenuBuilder(menuData: MenuStringData): StringSelectMenuBuilder;
    ChannelSelectMenuBuilder(menuData: MenuData): ChannelSelectMenuBuilder;
    RoleSelectMenuBuilder(menuData: MenuData): RoleSelectMenuBuilder;
}
export {};
