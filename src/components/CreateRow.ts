import { ActionRowBuilder, AnyComponentBuilder } from 'discord.js';

function CreateRow<T extends AnyComponentBuilder>(components: T[] | T[][]): ActionRowBuilder<T> {
    if (!components || components.length === 0) {
        throw new Error('CreateRow: Components array cannot be empty');
    }

    const flatComponents = Array.isArray(components[0]) ? components[0] : components;

    if (flatComponents.length === 0) {
        throw new Error('CreateRow: Components array cannot be empty');
    }
    if (flatComponents.length > 5) {
        throw new Error('CreateRow: ActionRow can only contain up to 5 components');
    }

    return new ActionRowBuilder<T>().addComponents(flatComponents as T[]);
}

export default CreateRow;
