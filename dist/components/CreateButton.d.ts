import Discord, { ButtonBuilder, Interaction } from 'discord.js';
import { Client } from '../class';
type ButtonOptions = {
    customId: string;
    style?: Discord.ButtonStyle;
    label: string;
    disabled?: boolean;
    emoji?: string;
    url?: string;
    onClick?: (client: Client, interaction: Interaction, ...args: string[]) => void;
};
declare const CreateButton: ({ customId, style, label, disabled, emoji, url, onClick }: ButtonOptions) => ButtonBuilder;
export default CreateButton;
