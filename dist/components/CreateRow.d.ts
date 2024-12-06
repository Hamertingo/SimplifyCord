import { ActionRowBuilder, AnyComponentBuilder } from 'discord.js';
declare function CreateRow<T extends AnyComponentBuilder>(components: T[] | T[][]): ActionRowBuilder<T>;
export default CreateRow;
